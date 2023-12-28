FROM python:3.9

WORKDIR /usr/src/app 

COPY AI_with_Flask ./

RUN ./init.sh
RUN export flask_app=text_model_inference.py
RUN export protocol_buffers_python_implementation=python

EXPOSE 8000

CMD ["flask", "run", "--port=8000"]