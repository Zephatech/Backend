from nsfw_detector import predict

def get_nsfw_score(model, image):
    value = predict.classify(model, image)
    if value[image]['porn'] > 0.1 or value[image]['sexy'] > 0.1:
        return "Toxic"
    # if value[image]['neutral'] < 0.9:
    #     return "Need further review"
    return "Safe"

model = predict.load_model('nsfw_mobilenet2.224x224.h5')

while True:
    image = input("Enter image path: ") 
    if image == "exit":
        break
    else:
        print(get_nsfw_score(model, image))