<<<<<<< HEAD
FROM python:3.9-slim

WORKDIR /usr/src/app 

COPY AI_with_Flask/requirements.txt .
RUN pip install -r requirements.txt

COPY AI_with_Flask .

EXPOSE 8000

CMD ["python3", "text_model_inference.py"]
=======
FROM python:3.9

WORKDIR /usr/src/app 

COPY AI_with_Flask ./

RUN ./init.sh
RUN export flask_app=text_model_inference.py
RUN export protocol_buffers_python_implementation=python

EXPOSE 8000

CMD ["flask", "run", "--port=8000"]
>>>>>>> 422bc68cebf3caf3af8f247e522f23a28a25452b
