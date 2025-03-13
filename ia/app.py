import time
import json
from flask import Flask, jsonify, request
from face_recognition import (
    start_camera,
    detect_emotion_once,
    stop_collection,
    collected_emotions,
    classify_topics_last_snapshot,
    last_emotion_data
)
from flask_cors import CORS
from flask_socketio import SocketIO, emit

app = Flask(__name__)
CORS(app)
socketio = SocketIO(app, cors_allowed_origins="*")

@app.route("/")
def index():
    return "Welcome to the Emotion API"

@app.route("/start_camera", methods=["GET"])
def start_camera_endpoint():
    if start_camera():
        return jsonify({"message": "Camera started"})
    else:
        return jsonify({"error": "Could not open camera"}), 500

@app.route("/detect_emotion_once", methods=["GET"])
def detect_emotion_endpoint():
    results = detect_emotion_once()
    classification = classify_topics_last_snapshot(collected_emotions)
    socketio.emit("classification_update", classification)
    return jsonify(results)

@app.route("/emotion_data", methods=["GET"])
def emotion_data_endpoint():
    global last_emotion_data
    if last_emotion_data is None:
        return jsonify({"num_faces": 0, "emotions": []})
    return jsonify(last_emotion_data)

@app.route("/stop_collection", methods=["GET"])
def stop_collection_endpoint():
    results = stop_collection()
    return jsonify(results)

@app.route("/latest_classification", methods=["GET"])
def latest_classification():
    classification = classify_topics_last_snapshot(collected_emotions)
    return jsonify(classification)

@socketio.on("connect")
def handle_connect():
    print("Client connected")
    emit("message", {"data": "Connected to Flask SocketIO"})

if __name__ == "__main__":
    socketio.run(app, debug=True)
