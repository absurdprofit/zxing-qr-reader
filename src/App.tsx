import React from 'react';
import './App.css';
import {QrReader} from './common/qr_reader';
import { IResult } from './common/zxing';

class App extends React.Component {
  state = {
    file: undefined,
    qr_reader: undefined
  }


  componentDidMount() {
    const canvas : HTMLCanvasElement = document.getElementById('stream-buffer') as HTMLCanvasElement;
    const context : CanvasRenderingContext2D | null = canvas.getContext('2d');

    const result_p : HTMLParagraphElement = document.getElementById('result') as HTMLParagraphElement;
    const profile_p : HTMLParagraphElement = document.getElementById('profile-text') as HTMLParagraphElement;
    if (context) {
      const qr_reader = new QrReader(context);
      qr_reader.on('found', (result : IResult) => {
        result_p.textContent = result.text;
        profile_p.textContent = result.profile_info;
      })
      this.setState({...this.state, qr_reader: qr_reader}, () => {
        if (this.state.qr_reader) {
          qr_reader.scan();
        }
      });
      
    }
  }

  componentWillUnmount() {
    const qr_reader : QrReader = this.state.qr_reader as unknown as QrReader;
    qr_reader.stop();
  }

  render() {
    return (
      <div className="App">
        <header className="App-header" style={{justifyContent: 'flex-start'}}>
          <div id="profile" style={{position: 'absolute', top: 0, right: 0, padding: '15px', backgroundColor: 'rgba(0, 0, 0, 0.5)', zIndex: 1000, textAlign: 'left'}}>
            <p>Performance</p>
            <p id="profile-text"></p>
          </div>
          <div style={{width: window.screen.width < 600 ? window.screen.width : 600, height: 480, overflow: 'hidden', display: 'flex', justifyContent: 'center'}}>
            <canvas width="600" height="480" id="stream-buffer" />
          </div>
          <div style={{width: '90vw'}}>
            <p id="result" style={{wordWrap: 'break-word'}}></p>
          </div>
          <button onClick={() => {
            const qr_reader : QrReader = this.state.qr_reader as unknown as QrReader;
            qr_reader.stop();
          }}>Stop</button>
          
        </header>
      </div>
    );
  }
}

export default App;
