import torch
from torch import nn
from flask import Flask, request, jsonify
from transformers import DistilBertTokenizerFast
from transformers import DistilBertConfig
from DLModel import DistilBertForSequenceClassification


tokenizer = DistilBertTokenizerFast.from_pretrained('distilbert-base-uncased')
if torch.cuda.is_available():
   map_location=lambda storage, loc: storage.cuda()
else:
   map_location='cpu'
config = DistilBertConfig(vocab_size_or_config_json_file=32000, hidden_size=768,dropout=0.1,num_labels=2,
   num_hidden_layers=12, num_attention_heads=12, intermediate_size=3072)

local_model = DistilBertForSequenceClassification(config)
local_model.load_state_dict(torch.load('sensitive_model_v1.pt', map_location=map_location))

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

app = Flask(__name__)

@app.route('/predict', methods=['POST'])
def predict():
    data = request.get_json()  # 获取POST请求中的数据
    text = data['text']  # 获取文本数据

    result = sensitive_text_inference(text)

    return jsonify({'result': result})  # 返回推断结果


if __name__ == '__main__':
    app.run()

