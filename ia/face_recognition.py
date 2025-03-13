import time
import cv2
import numpy as np
from PIL import Image
from flask import request
from threading import Thread
import tensorflow as tf
from tensorflow.keras.models import load_model

# Global dictionnaire
collected_emotions = {}  

# Global camera object 
camera = None
camera_thread = None
stop_thread = False
last_emotion_data = None  

# recharger le modèle
emotion_model = load_model("model.keras")
emotion_labels = ["neutral", "happy", "sad", "surprise", "fear", "disgust", "anger"]

# Recharger le face cascade
face_cascade = cv2.CascadeClassifier(
    cv2.data.haarcascades + "haarcascade_frontalface_default.xml"
)

def predict_emotion(face_img):
    """
    Retourner une liste des dictionnaires avec le label des émotions et les scores
    """
    img_array = np.array(face_img)

    if img_array.ndim == 2:
        img_array = cv2.cvtColor(img_array, cv2.COLOR_GRAY2RGB)
    # Normaliser les valeurs pixel à [0, 1]
    img_array = img_array.astype("float32") / 255.0
    img_array = np.expand_dims(img_array, axis=0)
    
    # Prediction de modele avec Keras
    preds = emotion_model.predict(img_array)
    
    # Map des préductions
    result = []
    for label, score in zip(emotion_labels, preds[0]):
        result.append({"label": label, "score": float(score)})
    # Trier le score
    result = sorted(result, key=lambda x: x["score"], reverse=True)
    return result

def start_camera():
    """
    Allumer la caméra et faire une boucle de capture
    Retourne true si la caméra est ouvert
    """
    global camera, camera_thread, stop_thread
    if camera is None or not camera.isOpened():
        camera = cv2.VideoCapture(0)
        if not camera.isOpened():
            return False

        for i in range(5):
            camera.read()
        # SCapture en boucle
        stop_thread = False
        camera_thread = Thread(target=camera_loop)
        camera_thread.daemon = True  
        camera_thread.start()
    return True

def stop_camera():
    """
    Arreter la caméra et le boucle d'image
    """
    global camera, stop_thread, camera_thread
    stop_thread = True
    if camera_thread is not None:
        camera_thread.join(timeout=2)
        camera_thread = None
    if camera is not None and camera.isOpened():
        camera.release()
        camera = None

def camera_loop():
    """
    Detection des émotions et mise a jour de last_emotion_data
    """
    global last_emotion_data, stop_thread, camera
    while not stop_thread:
        if camera is None or not camera.isOpened():
            continue
        ret, frame = camera.read()
        if not ret:
            continue

        gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
        
        #Détecter les émotions avec les paramètre cascade
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
            # Utilisation de Keras pour la prédiction des émotions
            results = predict_emotion(face_img)
            emotion_data.append(results)

        # Mise à jour des données
        last_emotion_data = {
            "num_faces": len(faces),
            "emotions": emotion_data
        }
        # 10 fps
        time.sleep(0.1)

def detect_emotion_once():
    """
   Capture les données émotionnelles les plus récentes (à partir de la boucle de capture continue),
   associe le sujet fourni à chaque résultat émotionnel, et ajoute la capture à une liste de captures pour ce sujet
    """
    global collected_emotions, last_emotion_data

    if not start_camera():
        return {"error": "Could not open webcam"}

    topic = request.args.get("topic")
    if last_emotion_data is None:
        return {"error": "No emotion data available yet"}


    emotion_data_with_topic = []
    for face in last_emotion_data.get("emotions", []):
        face_with_topic = [{**r, "topic": topic if topic else "none"} for r in face]
        emotion_data_with_topic.append(face_with_topic)

    # Conllection des émotions
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
    """
    Itèration sur les émotions collectées et calcule les scores agrégés en utilisant uniquement 
    la dernière capture pour chaque sujet. Un sujet est considéré comme "bon" 
    si le score total pour 'neutre' et 'heureux' est supérieur ou égal au score total pour 
    'triste', 'colère', 'dégoût' et 'peur'
    """
    good_topics = {}
    bad_topics = {}
    
    for topic, snapshots in collected.items():
        if not snapshots:
            continue
        # Utilise uniquement la dernière capture pour la classification
        last_snapshot = snapshots[-1]
        sum_good = 0.0
        sum_bad = 0.0
        
        # Chaque capture est une liste de tableaux de visages. Itère sur chaque tableau de visages
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
    """
    Arrête la caméra, renvoie toutes les captures d'écran collectées et ajoute une classification 
    des sujets en "bons" et "mauvais" basée sur les scores émotionnels agrégés de la dernière capture
    """
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
