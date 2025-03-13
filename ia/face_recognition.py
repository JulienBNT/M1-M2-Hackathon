import time
import cv2
import numpy as np
from PIL import Image
from flask import request
from threading import Thread
import tensorflow as tf
from tensorflow.keras.models import load_model

collected_emotions = {}
camera = None
camera_thread = None
stop_thread = False
last_emotion_data = None

emotion_model = load_model("model.keras")
emotion_labels = ["neutral", "happy", "sad", "surprise", "fear", "disgust", "anger"]

face_cascade = cv2.CascadeClassifier(cv2.data.haarcascades + "haarcascade_frontalface_default.xml")

def predict_emotion(face_img):
    img_array = np.array(face_img)
    if img_array.ndim == 2:
        img_array = cv2.cvtColor(img_array, cv2.COLOR_GRAY2RGB)
    img_array = img_array.astype("float32") / 255.0
    img_array = np.expand_dims(img_array, axis=0)
    preds = emotion_model.predict(img_array)
    result = []
    for label, score in zip(emotion_labels, preds[0]):
        result.append({"label": label, "score": float(score)})
    result = sorted(result, key=lambda x: x["score"], reverse=True)
    return result

def start_camera():
    global camera, camera_thread, stop_thread
    if camera is None or not camera.isOpened():
        camera = cv2.VideoCapture(0)
        if not camera.isOpened():
            return False
        for i in range(5):
            camera.read()
        stop_thread = False
        camera_thread = Thread(target=camera_loop)
        camera_thread.daemon = True
        camera_thread.start()
    return True

def stop_camera():
    global camera, stop_thread, camera_thread
    stop_thread = True
    if camera_thread is not None:
        camera_thread.join(timeout=2)
        camera_thread = None
    if camera is not None and camera.isOpened():
        camera.release()
        camera = None

def camera_loop():
    global last_emotion_data, stop_thread, camera
    while not stop_thread:
        if camera is None or not camera.isOpened():
            continue
        ret, frame = camera.read()
        if not ret:
            continue
        gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
        faces = face_cascade.detectMultiScale(gray, scaleFactor=1.05, minNeighbors=3, minSize=(30, 30))
        emotion_data = []
        for (x, y, w, h) in faces:
            face_region = frame[y:y+h, x:x+w]
            face_img = Image.fromarray(cv2.cvtColor(face_region, cv2.COLOR_BGR2RGB))
            face_img = face_img.resize((224, 224))
            results = predict_emotion(face_img)
            emotion_data.append(results)
        last_emotion_data = {"num_faces": len(faces), "emotions": emotion_data}
        time.sleep(0.1)

def detect_emotion_once():
    global collected_emotions, last_emotion_data
    hashtag = request.args.get("hashtag")
    
    if not start_camera():
        return {"error": "Could not open webcam"}
    if last_emotion_data is None:
        return {"error": "No emotion data available yet"}
    
    # Temporary simulation for testing
    # Remove this block once you've confirmed the logic works.
    if hashtag == "#test":
        simulated_emotion = [{"label": "happy", "score": 0.8}, {"label": "sad", "score": 0.2}]
        emotion_data_with_hashtag = [[{**simulated_emotion[0], "hashtag": hashtag}, {**simulated_emotion[1], "hashtag": hashtag}]]
    else:
        emotion_data_with_hashtag = []
        for face in last_emotion_data.get("emotions", []):
            face_with_hashtag = [{**r, "hashtag": hashtag if hashtag else ""} for r in face]
            emotion_data_with_hashtag.append(face_with_hashtag)
    
    if hashtag:
        collected_emotions[hashtag] = emotion_data_with_hashtag
        total_snapshots = 1
    else:
        total_snapshots = 0
    
    return {
        "message": "Snapshot captured",
        "num_faces": last_emotion_data.get("num_faces", 0),
        "emotions": emotion_data_with_hashtag,
        "hashtag": hashtag,
        "total_snapshots_for_hashtag": total_snapshots
    }

def classify_topics_last_snapshot(collected):
    good_hashtags = {}
    bad_hashtags = {}
    for hashtag, snapshots in collected.items():
        if not snapshots:
            continue
        last_snapshot = snapshots[-1]
        sum_good = 0.0
        sum_bad = 0.0
        for face_array in last_snapshot:
            for emotion in face_array:
                if not isinstance(emotion, dict):
                    continue
                label = emotion.get("label", "").lower()
                # Explicitly convert to float
                try:
                    score = float(emotion.get("score", 0))
                except Exception as e:
                    score = 0
                # Debug print (remove or comment out in production)
                # print(f"Hashtag: {hashtag}, Label: {label}, Score: {score}")
                if label in ["neutral", "happy"]:
                    sum_good += score
                elif label in ["sad", "anger", "disgust", "fear"]:
                    sum_bad += score
        # Debug output for each hashtag
        # print(f"Hashtag: {hashtag}, Good Score: {sum_good}, Bad Score: {sum_bad}")
        if sum_good >= sum_bad:
            good_hashtags[hashtag] = {"good_score": sum_good, "bad_score": sum_bad}
        else:
            bad_hashtags[hashtag] = {"good_score": sum_good, "bad_score": sum_bad}
    return {"good_hashtags": good_hashtags, "bad_hashtags": bad_hashtags}

def stop_collection():
    global collected_emotions
    stop_camera()
    final_data = {"total_hashtags": len(collected_emotions), "collected_data": collected_emotions.copy()}
    classification = classify_topics_last_snapshot(collected_emotions)
    return {"message": "Stopped collecting. Here's your data.", "data": final_data, "classification": classification}
