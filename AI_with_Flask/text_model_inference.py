import torch
from torch import nn
from flask import Flask, request, jsonify
from transformers import DistilBertTokenizerFast
from transformers import DistilBertConfig
from DLModel import DistilBertForSequenceClassification
from nsfw_detector import predict
from rake_nltk import Rake
from happytransformer import HappyTextToText, TTSettings
from transformers import AutoTokenizer, AutoModelForCausalLM, pipeline

tokenizer = DistilBertTokenizerFast.from_pretrained('distilbert-base-uncased')
if torch.cuda.is_available():
   map_location=lambda storage, loc: storage.cuda()
else:
   map_location='cpu'
config = DistilBertConfig(vocab_size_or_config_json_file=32000, hidden_size=768,dropout=0.1,num_labels=2,
   num_hidden_layers=12, num_attention_heads=12, intermediate_size=3072)

local_model = DistilBertForSequenceClassification(config)
local_model.load_state_dict(torch.load('sensitive_model_v1.pt', map_location=map_location))
model_image_toxic = predict.load_model('nsfw_mobilenet2.224x224.h5')

def sensitive_text_inference(text, model = local_model, tokenizer = tokenizer):
    # text: string
    # model: torch model
    def format_output(x):
        if x == 1:
            return "Toxic"
        else:
            return "NonToxic"
        
    bert_input = tokenizer(text,padding='max_length', max_length = 50,
                       truncation=True, return_tensors="pt")
    example_mask = bert_input['attention_mask']
    example_input_id = bert_input['input_ids'].squeeze(1)
    output = model(example_input_id, example_mask)
    return format_output(output.argmax(dim=1).numpy())

def get_nsfw_score(image, model = model_image_toxic):
    value = predict.classify(model, image)
    if value[image]['porn'] > 0.1 or value[image]['sexy'] > 0.1:
        return "Toxic"
    if value[image]['neutral'] < 0.9:
        return "Need further review"
    return "Safe"

# core information generation model
image_to_text_model = pipeline("image-to-text",model="Salesforce/blip-image-captioning-base")
# fix spelling mistakes
fix_spelling = pipeline("text2text-generation",model="oliverguhr/spelling-correction-english-base")
# fix grammar mistakes
happy_tt = HappyTextToText("T5", "vennify/t5-base-grammar-correction")
args = TTSettings(num_beams=5, min_length=1)
# categories extraction model
r = Rake()
# description generation model
tokenizer = AutoTokenizer.from_pretrained("HamidRezaAttar/gpt2-product-description-generator")
model = AutoModelForCausalLM.from_pretrained("HamidRezaAttar/gpt2-product-description-generator")
generator = pipeline('text-generation', model, tokenizer=tokenizer, config={'max_length':100})

def generate_core_information(image, model = image_to_text_model):
    core_info = model(image)
    return core_info[0]['generated_text']

def generate_category(description, model = r):
    model.extract_keywords_from_text(description)
    return model.get_ranked_phrases()[:2]

def correct_spelling(text, model = fix_spelling):
    return model(text, max_length = 2048)[0]['generated_text']

def correct_grammar(text, model = happy_tt, args = args):
    result = model.generate_text(text, args)
    return result.text

def description_generation(text, generator = generator):
    generated_text = generator(text)
    return generated_text[0]['generated_text']


def deploy_function(image, inference = "other"):
    if inference == "fast":
        core_info = generate_core_information(image)
        category = generate_category(core_info)
        description = description_generation(core_info)
    else:    
        core_info = generate_core_information(image)
        category = generate_category(core_info)
        description = description_generation(core_info)
        description = correct_grammar(description)
        description = correct_spelling(description)
    return core_info, category, description


app = Flask(__name__)
@app.route('/predict', methods=['POST'])
def predict_text():
    data = request.get_json()
    text = data['text']

    result = sensitive_text_inference(text)

    return jsonify({'result': result})

@app.route('/predict_image', methods=['POST'])
def predict_image():
    data = request.get_json()
    path = data['path']

    result = get_nsfw_score(path)

    return jsonify({'result': result})

@app.route('/image_to_text', methods=['POST'])
def image_to_tect():
    data = request.get_json()
    path = data['path']

    core_info, category, description  = deploy_function(path)

    return jsonify({"title": core_info, "category": category, "description": description})


if __name__ == '__main__':
    app.run()

