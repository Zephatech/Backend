from transformers import pipeline
from rake_nltk import Rake
from happytransformer import HappyTextToText, TTSettings
from transformers import AutoTokenizer, AutoModelForCausalLM, pipeline

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


def deploy_function(image, inference):
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

while True:
    image = input("Enter the image path: ")
    inference = input("Enter the inference type: ")
    core_info, category, description = deploy_function(image, inference)
    print("Core information: ", core_info)
    print("Category: ", category)
    print("Description: ", description)
    print("------------------------------------------------------")
