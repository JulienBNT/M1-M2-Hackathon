import time
import cv2
import numpy as np
from PIL import Image
from transformers import pipeline
from flask import request
import json

# Global dictionary to store snapshots by topic
collected_emotions = {}  # Keys: topic string, Value: snapshot data

# Global camera object
camera = None

# Load your pipeline once at import time
emotion_pipe = pipeline(
    "image-classification",
    model="motheecreator/vit-Facial-Expression-Recognition"
)

# Load the face cascade
face_cascade = cv2.CascadeClassifier(
    cv2.data.haarcascades + "haarcascade_frontalface_default.xml"
)

#Helper functions to determine when to start the cam
#a changer quand application au projet
def start_camera():
    """
    Opens the camera if it's not already open and warms it up.
    Returns True if the camera is successfully opened.
    """
    global camera
    if camera is None or not camera.isOpened():
        camera = cv2.VideoCapture(0)
        if not camera.isOpened():
            return False
        # Warm-up: read a few frames so that auto-adjustments are applied.
        for i in range(5):
            camera.read()
    return True

def stop_camera():
    """
    Stops (releases) the camera.
    """
    global camera
    if camera is not None and camera.isOpened():
        camera.release()
        camera = None

def detect_emotion_once():
    """
    Captures one frame from the already-opened camera,
    detects faces and their emotions, and if a topic is provided
    as a query parameter, registers the result under that topic.
    """
    global collected_emotions, camera

    # Start (or restart) the camera if needed.
    if not start_camera():
        return {"error": "Could not open webcam"}

    # Get the topic from the query parameters.
    # If no topic is provided, the snapshot won't be registered.
    topic = request.args.get("topic")

    ret, frame = camera.read()
    if not ret:
        return {"error": "Failed to capture frame"}
    
    # OPTIONAL: Save the captured frame for debugging.
    cv2.imwrite("captured_frame.jpg", frame)

    gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
    
    # Detect faces with adjusted cascade parameters.
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
        results = emotion_pipe(face_img)
        clean_results = []
        for r in results:
            clean_results.append({
                "label": r["label"],
                "score": float(r["score"]),
                "topic": topic if topic else "none"
            })
        emotion_data.append(clean_results)

    # Register the snapshot under the topic if one was provided.
    if topic:
        collected_emotions[topic] = emotion_data
        print("Collected topics:", list(collected_emotions.keys()))

    return {
        "message": "One snapshot captured",
        "num_faces": len(faces),
        "emotions": emotion_data,
        "topic": topic,
        "total_topics_collected": len(collected_emotions)
    }

def stop_collection():
    """
    Returns all the collected snapshots and stops the camera.
    """
    global collected_emotions
    # Stop the camera when the user clicks the stop button.
    stop_camera()
    final_data = {
        "total_topics": len(collected_emotions),
        "collected_data": collected_emotions.copy()
    }
    return {
        "message": "Stopped collecting. Here's your data.",
        "data": final_data
    }
