from fastapi import FastAPI, File, UploadFile
from PIL import Image, ImageDraw, ImageFont
import io
import numpy as np
import tensorflow as tf
from tensorflow.keras.applications.efficientnet import preprocess_input
from google.cloud import storage

app = FastAPI()

# path to h5 model
# model_path = "kata/modelterbarufix.h5"

# Google Cloud Storage bucket details
bucket_name = "akujuga_model"
model_path = "kata/modelterbarufix.h5"

# list of class name
class_names = [
    'Halo', 'Tidur', 'Kamu', 'Makan', 'Saya'
]

# initialize tflite interpreter
# interpreter = tf.lite.Interpreter(model_path=model_path)
# interpreter.allocate_tensors()

interpreter = None

def download_model():
    # download model from cloud storage bucket
    client = storage.Client()
    bucket = client.bucket(bucket_name)
    blob = bucket.blob(model_path)
    model_content = blob.download_as_bytes()

    # save model locally
    with open("modelterbarufix.h5", "wb") as f:
        f.write(model_content)

def load_model():
    model_local_path = 'modelterbarufix.h5'
    model_kata = tf.keras.models.load_model(model_local_path)

def preprocess_image(image):

    # preprocess image before making a prediction
    # resize image to 224x224 pixels and apply preprocessing specific to the efficientnet model

    image = Image.open(image_path).convert('L')
    image = image.resize((30, 258))
    image_array = np.array(image) / 255.0
    image_array = np.expand_dims(image_array, axis=0)
    image_array = np.transpose(image_array, (0, 2, 1))
    return image_array

def predict_image(image):

    # run image classification using tflite model
    # return the predicted class name and prediction
    image_array = preprocess_image(image)
    predictions = model_kata.predict(image_array)
    prediction_idx = np.argmax(predictions)
    predicted_class_name = class_names[prediction_idx]
    prediction_prob = predictions[prediction_idx]

    return predicted_class_name, prediction_prob

@app.on_event("startup")
async def startup_event():
    # download and load model into memory when application started
    download_model()
    load_model()

@app.post("/predict")
async def predict(file: UploadFile = File(...)):

    # endpoint for predicting the class of an uploaded image

    contents = await file.read()

    # check if the file is in JPEG format
    if not file.filename.lower().endswith((".jpg", ".jpeg")):
        return {
            "error": "Only support .jpg/.jpeg file"
            }
    
    image = Image.open(io.BytesIO(contents))

    # perform prediction
    predicted_class, prediction_prob = predict_image(image)

    return {
        "predicted_class": predicted_class,
        "prediction_prob": float(prediction_prob)
        }

@app.get("/")
def read_root():
    # root endpoint for checking if the API is running
    return {"Detect sign language API started"}

if __name__ == '__main__':
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=5000)
