import React from 'react';
import './css/App.css';
import {QrReader} from 'zxing-qr-reader/reader';
import {IResult} from 'zxing-qr-reader/zxing';

class App extends React.Component {
  state = {
    file: undefined,
    qr_reader: undefined
  }


  componentDidMount() {
    const canvas : HTMLCanvasElement = document.getElementById('stream-buffer') as HTMLCanvasElement;
    const context : CanvasRenderingContext2D | null = canvas.getContext('2d');

    if (context) {
      const qr_reader = new QrReader(context);
      qr_reader.on('found', (result : IResult) => {
        if (window.confirm(`Are you sure you want to open ${result.text}?`)) {
          const _window  = window.open(result.text, "_blank");
          _window?.focus();
        }
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
    const height : number = window.screen.height < 500 && window.screen.height > window.screen.width ? 852 : 480;
    return (
      <div className="App">
        <header className="App-header" style={{justifyContent: 'flex-start'}}>
          <div id="canvas-container">
            <canvas width={480} height={height} id="stream-buffer" />
          </div>
          <button id="stop" onClick={() => {
            const qr_reader : QrReader = this.state.qr_reader as unknown as QrReader;
            qr_reader.stop();
          }}>Stop</button>
          
        </header>
      </div>
    );
  }
}

export default App;
