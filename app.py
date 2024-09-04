import pyttsx3

engine = pyttsx3.init()

# Set voice and rate
voices = engine.getProperty('voices')
engine.setProperty('voice', voices[1].id)  # Female voice
engine.setProperty('rate', 150)  # Speed

# Speak the text
engine.say("Hello, this is a customizable text-to-speech example.")
engine.runAndWait()
