import os
import azure.cognitiveservices.speech as speechsdk
from flask import Flask, request, render_template
from flask_cors import CORS, cross_origin

app = Flask(__name__,  template_folder='templates', static_folder='static')
CORS(app)

def recognize_from_microphone():
    # This example requires environment variables named "SPEECH_KEY" and "SPEECH_REGION"
    speech_translation_config = speechsdk.translation.SpeechTranslationConfig(subscription="dece6edf0a5e4916b1fe907a0be9c954", region="eastus")
    speech_translation_config.speech_recognition_language="en-US"

    target_language="it"
    speech_translation_config.add_target_language(target_language)

    # audio_config = speechsdk.audio.AudioConfig(use_default_microphone=True)
    audio_config = speechsdk.audio.AudioConfig(stream="http://mediaserv30.live-streams.nl:8086/live")
    translation_recognizer = speechsdk.translation.TranslationRecognizer(translation_config=speech_translation_config, audio_config=audio_config)

    print("Speak into your microphone.")
    translation_recognition_result = translation_recognizer.recognize_once_async().get()

    if translation_recognition_result.reason == speechsdk.ResultReason.TranslatedSpeech:
        print("Recognized: {}".format(translation_recognition_result.text))
    elif translation_recognition_result.reason == speechsdk.ResultReason.NoMatch:
        print("No speech could be recognized: {}".format(translation_recognition_result.no_match_details))
    elif translation_recognition_result.reason == speechsdk.ResultReason.Canceled:
        cancellation_details = translation_recognition_result.cancellation_details
        print("Speech Recognition canceled: {}".format(cancellation_details.reason))
        if cancellation_details.reason == speechsdk.CancellationReason.Error:
            print("Error details: {}".format(cancellation_details.error_details))
            print("Did you set the speech resource key and region values?")
            
    return translation_recognition_result.text

@app.route('/', methods =["post","get"])
def home():
    result  = recognize_from_microphone()
    return {"response":result}

if __name__ == "__main__":
    port = int(os.environ.get('PORT', 4000))
    app.run(debug=True, host='0.0.0.0', port=port)

recognize_from_microphone()