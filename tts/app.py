from flask import Flask, request, jsonify
from flask_cors import CORS
import pyttsx3
from collections import deque

app = Flask(__name__)
CORS(app)

# Initialize TTS engine
engine = pyttsx3.init()
is_running = False  # Global state to manage engine status
request_queue = deque()  # Queue to manage incoming requests

# Log available voices and their attributes
voices = engine.getProperty('voices')
for voice in voices:
    print(f"Voice: {voice.name}, ID: {voice.id}, Lang: {voice.languages}, Rate: {engine.getProperty('rate')}")

def process_queue():
    global is_running
    while request_queue:
        text, rate = request_queue.popleft()  # Get the next request
        is_running = True  # Set the flag before speaking

        # Set and log the rate
        engine.setProperty('rate', rate)
        print(f'Setting speech rate to: {rate} wpm')
        print(f'Current rate before speaking: {engine.getProperty("rate")}')

        # Log the current settings
        print(f'Speaking text: "{text}" at rate: {rate}')

        engine.say(text)
        engine.runAndWait()  # This blocks until speaking is done
        print("Speaking completed.")
        
        is_running = False  # Reset state after speaking is done

@app.route('/speak', methods=['POST'])
def speak():
    global is_running
    data = request.json
    text = data.get('text')
    rate = data.get('rate', 250)

    # Check for empty text
    if not text:
        return jsonify({"error": "No text provided"}), 400  # Bad request error

    # Add request to the queue
    request_queue.append((text, rate))

    # Process the queue if not already running
    if not is_running:
        process_queue()

    return jsonify({"message": "Speaking started"}), 200

@app.route('/stop', methods=['POST'])
def stop():
    global is_running
    if is_running:
        engine.stop()
        is_running = False
        return jsonify({"status": "stopped"}), 200
    return jsonify({"status": "not speaking"}), 409

if __name__ == '__main__':
    app.run(debug=True, port=5000)
