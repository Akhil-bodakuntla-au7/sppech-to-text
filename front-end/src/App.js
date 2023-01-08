import React from "react";
import './css/App.css';
import { AudioConfig, ResultReason, SpeechConfig, SpeechRecognizer } from 'microsoft-cognitiveservices-speech-sdk';

var sppech_recognizer;

class App extends React.Component {


  constructor(props) {
    super(props);
    this.state = { isRecording:false,note:""};
  }

  recognizerCallback = (s, e) => {
    const reason = ResultReason[e.result.reason];
    if (reason === "RecognizedSpeech") {
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
      sppech_recognizer.recognized = this.recognizerCallback.bind(this);
      sppech_recognizer.startContinuousRecognitionAsync()
    } else {
      console.log("stopped")
      sppech_recognizer.stopContinuousRecognitionAsync(
        () => {
          this.sppech_recognizer.close()
          this.sppech_recognizer = undefined      
        },
         (err) => {
          this.sppech_recognizer.close()
          this.sppech_recognizer = undefined
          console.error(err)
        }
      )
    }
  }
  
  render() {
    const {isRecording,note} = this.state;
    return (
      <div>
       <h1>Speech To Text</h1>
       <div>
         <div>
           {isRecording ? <span>Recording... </span> : <span>Stopped </span>}       
           <br/>   
           <textarea style={{width:"98%"}} rows={20} name="speech" cols={120} value={note} onChange={e=> this.setState({note:e.target.value})} />
         </div>
         <button onClick={() => {this.setState({isRecording:!isRecording},()=>this.startRecordController())}}>
             Start/Stop
           </button>
       </div>
     </div>
    );
  }
}
export default App ;
