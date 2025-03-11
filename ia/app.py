import time
import json
from flask import Flask, jsonify, send_from_directory
from face_recog import detect_emotion_once, stop_collection
from flask_cors import CORS
from flask_socketio import SocketIO, emit

#initialising flask application, cors and socket
app = Flask(__name__)
CORS(app)
socketio = SocketIO(app, cors_allowed_origins="*")

@app.route("/")
def home():
    # Serve the static HTML file (ensure test_front.html is in the same directory as app.py)
    return send_from_directory(".", "test_front.html")

#Endpoint that gets emotion and topic when clicking a button
@app.route("/detect_emotion_once", methods=["GET"])
def detect_emotion():
    results = detect_emotion_once()
    return jsonify(results)

#Endpoint that gets the final JSON with all the data
@app.route("/stop_collection", methods=["GET"])
def stop_collections():
    results = stop_collection()
    return jsonify(results)

#Websocket connection
@socketio.on("connect")
def handle_connect():
    print("Client connected")
    # Optionally, send an initial message
    emit("message", {"data": "Connected to Flask SocketIO"})

if __name__ == "__main__":
    app.run(debug=True, use_reloader=False)
