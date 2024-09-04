from flask import Flask, request, jsonify
from flask_cors import CORS
import pyttsx3
import threading

app = Flask(__name__)
CORS(app)

engine = pyttsx3.init()
is_playing = False
pause_event = threading.Event()
stop_event = threading.Event()

def speak_text(text):
    global is_playing
    is_playing = True
    engine.say(text)
    engine.runAndWait()
    is_playing = False

@app.route('/speak', methods=['POST'])
def speak():
    global is_playing, stop_event
    text = request.json.get('text')
    if not is_playing:
        stop_event.clear()
        threading.Thread(target=speak_text, args=(text,)).start()
        return jsonify({"status": "speaking"}), 200
    return jsonify({"status": "already speaking"}), 409

@app.route('/pause', methods=['POST'])
def pause():
    global is_playing
    if is_playing:
        pause_event.set()
        return jsonify({"status": "paused"}), 200
    return jsonify({"status": "not speaking"}), 409

@app.route('/resume', methods=['POST'])
def resume():
    global is_playing
    if is_playing and pause_event.is_set():
        pause_event.clear()
        return jsonify({"status": "resumed"}), 200
    return jsonify({"status": "not paused or already resumed"}), 409

@app.route('/stop', methods=['POST'])
def stop():
    global is_playing, stop_event
    if is_playing:
        stop_event.set()
        engine.stop()
        is_playing = False
        return jsonify({"status": "stopped"}), 200
    return jsonify({"status": "not speaking"}), 409

if __name__ == '__main__':
    app.run(port=5000)
