import React from "react";
import './css/App.css';
import { AudioConfig, ResultReason, SpeechConfig, SpeechRecognizer } from 'microsoft-cognitiveservices-speech-sdk';

var sppech_recognizer;

class App extends React.Component {


  constructor(props) {
    super(props);
    this.state = { isRecording:false,note:"",covid: [] };
  }

  recognizerCallback = (s, e) => {
    console.log(e.result.text);
    const reason = ResultReason[e.result.reason];
    console.log(reason);

    if (reason === "RecognizingSpeech") {
      this.innerHtml = this.lastRecognized + e.result.text;
      
    }
    if (reason === "RecognizedSpeech") {
      this.lastRecognized += e.result.text + "\r\n";
      this.innerHtml = this.lastRecognized;
      this.setState(prevState =>{
        return{
             ...prevState,
             note : prevState.note + " " + e.result.text
        }});
    }
  }
  startRecordController = () => {
    if (this.state.isRecording) {
      const audioConfig = AudioConfig.fromDefaultMicrophoneInput();
      const speechConfig = SpeechConfig.fromSubscription("ae3bb79f9f254873b419ca0aef1b1b1d", "eastus");
      speechConfig.speechRecognitionLanguage = 'en-US';
      speechConfig.enableDictation();
      sppech_recognizer = new SpeechRecognizer(speechConfig, audioConfig)
      // this.recognizerCallback.unbind(this);
      sppech_recognizer.recognized = this.recognizerCallback.bind(this);
      // _recognizer.startContinuousRecognitionAsync();
      sppech_recognizer.startContinuousRecognitionAsync()
      // sppech_recognizer.recognizeOnceAsync()
      
    //   (result => {
    //     let displayText;
    //     console.log(result);
    //     if (result.reason === ResultReason.RecognizedSpeech) {
    //         displayText = `RECOGNIZED: Text=${result.text}`
    //         this.setState(prevState =>{
    //           return{
    //                ...prevState,
    //                note : prevState.note + " " + result.text
    //           }});
    //     } else {
    //         displayText = 'ERROR: Speech was cancelled or could not be recognized. Ensure your microphone is working properly.';
    //     }
    //     console.log(displayText);
       
    // });
    } else {
      console.log("stop called")
      sppech_recognizer.stopContinuousRecognitionAsync(
        () => {
          this.sppech_recognizer.close()
          this.sppech_recognizer = undefined
          console.log('stopped')
      
        },
         (err) => {
          // this.stopRecognizer.bind(this)
          this.sppech_recognizer.close()
          this.sppech_recognizer = undefined
          console.log('stoped')
          console.error(err)
        }
      )
      // this.stopRecognizer()
      // alert("stopped")
    }
  }
  
  render() {
    const {isRecording,note} = this.state;
    return (
      <>
       <h1>Speech To Text</h1>
       <div>
         <div className="noteContainer">
           {isRecording ? <span>Recording... </span> : <span>Stopped </span>}          
           <p>{note}</p>
         </div>
         <button onClick={() => {this.setState({isRecording:!isRecording},()=>this.startRecordController())}}>
             Start/Stop
           </button>
       </div>
     </>
    );
  }
}
export default App ;
