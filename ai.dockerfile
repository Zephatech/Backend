FROM python:3.9-slim

WORKDIR /usr/src/app 

COPY AI_with_Flask/requirements.txt .
RUN pip install -r requirements.txt

COPY AI_with_Flask .

EXPOSE 8000

CMD ["python3", "text_model_inference.py"]
