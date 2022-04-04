import React from 'react';
import './css/App.css';
import QrReader, {IResult} from 'zxing-qr-reader';

interface AppState {
  file?: File;
  qr_reader?: QrReader;
}

class App extends React.Component<any, AppState> {
  private _found: boolean = false;
  state: AppState = {}

  componentDidMount() {
    const canvas: HTMLCanvasElement = document.getElementById('stream-buffer') as HTMLCanvasElement;
    const context: CanvasRenderingContext2D | null = canvas.getContext('2d');

    if (context) {
      const qr_reader = new QrReader(context);
      qr_reader.on('error', (e: Error) => alert(e));
      qr_reader.on('found', async (result : IResult) => {
        if (this._found) return;
        this._found = true;
        await qr_reader.stop();
        setTimeout(() => {
          qr_reader.scan();
          this._found = false;
        }, 500);
        if (window.confirm(`Are you sure you want to open ${result.text}?`)) {
          const _window  = window.open(result.text, "_blank");
          _window?.focus();
        }
        
      });
      this.setState({...this.state, qr_reader: qr_reader}, () => {
        if (this.state.qr_reader) {
          qr_reader.scan();
        }
      });
      
    }
  }

  componentWillUnmount() {
    if (this.state.qr_reader) {
      this.state.qr_reader.stop();
    }
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
            if (!this.state.qr_reader) return;
            this.state.qr_reader.stop();
          }}>Stop</button>
          
        </header>
      </div>
    );
  }
}

export default App;
