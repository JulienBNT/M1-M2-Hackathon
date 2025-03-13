import time
import cv2
import numpy as np
from PIL import Image
from flask import request
from threading import Thread
import tensorflow as tf
from tensorflow.keras.models import load_model

# Global dictionary to store captured emotion snapshots
collected_emotions = {}

# Global camera variables
camera = None
camera_thread = None
stop_thread = False
last_emotion_data = None  

# Load the Keras model (ensure model.keras exists or adjust as needed)
emotion_model = load_model("model.keras")
emotion_labels = ["neutral", "happy", "sad", "surprise", "fear", "disgust", "anger"]

# Load face cascade for face detection
face_cascade = cv2.CascadeClassifier(
    cv2.data.haarcascades + "haarcascade_frontalface_default.xml"
)

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
        faces = face_cascade.detectMultiScale(
            gray,
            scaleFactor=1.05,
            minNeighbors=3,
            minSize=(30, 30)
        )
        emotion_data = []
        for (x, y, w, h) in faces:
            face_region = frame[y:y+h, x:x+w]
            face_img = Image.fromarray(cv2.cvtColor(face_region, cv2.COLOR_BGR2RGB))
            face_img = face_img.resize((224, 224))
            results = predict_emotion(face_img)
            emotion_data.append(results)
        last_emotion_data = {
            "num_faces": len(faces),
            "emotions": emotion_data
        }
        time.sleep(0.1)

def detect_emotion_once():
    global collected_emotions, last_emotion_data
    topic = request.args.get("topic")
    
    # For testing: simulate emotion data when topic is "test" or "vacances"
    if topic:
        if topic.lower() == "test":
            simulated = [[{"label": "happy", "score": 1.0, "topic": topic}]]
            last_emotion_data = {"num_faces": 1, "emotions": simulated}
            if topic not in collected_emotions:
                collected_emotions[topic] = []
            collected_emotions[topic].append(simulated)
            return {
                "message": "Snapshot captured for test topic",
                "num_faces": 1,
                "emotions": simulated,
                "topic": topic,
                "total_snapshots_for_topic": len(collected_emotions[topic])
            }
        elif topic.lower() == "vacances":
            simulated = [[{"label": "sad", "score": 1.0, "topic": topic}]]
            last_emotion_data = {"num_faces": 1, "emotions": simulated}
            if topic not in collected_emotions:
                collected_emotions[topic] = []
            collected_emotions[topic].append(simulated)
            return {
                "message": "Snapshot captured for vacances topic",
                "num_faces": 1,
                "emotions": simulated,
                "topic": topic,
                "total_snapshots_for_topic": len(collected_emotions[topic])
            }
    
    # Normal operation: capture real data
    if not start_camera():
        return {"error": "Could not open webcam"}
    if last_emotion_data is None:
        return {"error": "No emotion data available yet"}
    emotion_data_with_topic = []
    for face in last_emotion_data.get("emotions", []):
        face_with_topic = [{**r, "topic": topic if topic else "none"} for r in face]
        emotion_data_with_topic.append(face_with_topic)
    if topic:
        if topic not in collected_emotions:
            collected_emotions[topic] = []
        collected_emotions[topic].append(emotion_data_with_topic)
        total_snapshots = len(collected_emotions[topic])
    else:
        total_snapshots = 0
    return {
        "message": "Snapshot captured",
        "num_faces": last_emotion_data.get("num_faces", 0),
        "emotions": emotion_data_with_topic,
        "topic": topic,
        "total_snapshots_for_topic": total_snapshots
    }

def classify_topics_last_snapshot(collected):
    good_topics = {}
    bad_topics = {}
    for topic, snapshots in collected.items():
        if topic.lower() == "test":
            good_topics[topic] = {"good_score": 1.0, "bad_score": 0.0}
            continue
        if topic.lower() == "vacances":
            bad_topics[topic] = {"good_score": 0.0, "bad_score": 1.0}
            continue
        if not snapshots:
            continue
        last_snapshot = snapshots[-1]
        sum_good = 0.0
        sum_bad = 0.0
        for face_array in last_snapshot:
            for emotion in face_array:
                label = emotion.get("label", "").lower()
                score = emotion.get("score", 0)
                if label in ["neutral", "happy"]:
                    sum_good += score
                elif label in ["sad", "anger", "disgust", "fear"]:
                    sum_bad += score
        if sum_good >= sum_bad:
            good_topics[topic] = {"good_score": sum_good, "bad_score": sum_bad}
        else:
            bad_topics[topic] = {"good_score": sum_good, "bad_score": sum_bad}
    return {"good_topics": good_topics, "bad_topics": bad_topics}

def stop_collection():
    global collected_emotions
    stop_camera()
    final_data = {
        "total_topics": len(collected_emotions),
        "collected_data": collected_emotions.copy()
    }
    classification = classify_topics_last_snapshot(collected_emotions)
    return {
        "message": "Stopped collecting. Here's your data.",
        "data": final_data,
        "classification": classification
    }
