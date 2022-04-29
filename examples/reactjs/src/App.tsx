import React from 'react';
import QrReader, {IResult} from 'zxing-qr-reader';
import Chip from './Chip';
import './App.css';

interface AppState {
  file?: File;
  mspf: string;
  fps: string;
  result?: URL | string;
}

class App extends React.Component<any, AppState> {
  private _found: boolean = false;
  private qr_reader: QrReader | null = null;
  private _context: CanvasRenderingContext2D | null = null;
  private foundTimeoutID: number = 0;
  state: AppState = {
    fps: '',
    mspf: '',
    result: undefined
  }

  componentDidMount() {
    const canvas: HTMLCanvasElement = document.getElementById('stream-buffer') as HTMLCanvasElement;
    this._context = canvas.getContext('2d');

    if (this._context) {
      this.qr_reader = new QrReader(this._context);
      this.qr_reader.on('error', (e: Error) => alert(e));
      this.qr_reader.on('found', this.onFound);
      this.qr_reader.on('scan', (result: IResult) => {
        const {fps, mspf} = result.profile_info;
        this.setState({fps, mspf});
      });
      

      this.qr_reader.scan();
    }
  }

  async componentWillUnmount() {
    if (this.qr_reader) {
      await this.qr_reader.stop();
    }
  }

  onStop = () => {
    if (!this.qr_reader) return;
    this.qr_reader.stop();
  }

  onFound = async (result: IResult) => {
    if (!this.qr_reader) return;
    if (this._found) return;

    try {
      this.setState({result: new URL(result.text)});
    } catch (e) {
      this.setState({result: result.text});
    }

    window.clearTimeout(this.foundTimeoutID);
    
    this.qr_reader.on('render', (context: CanvasRenderingContext2D) => {
      context.fillStyle = "yellow";
      for (let value of Object.values(result.position)) {
        const {x, y} = value;
        context.fillRect(x, y, 10, 10);
      }
    });

    this.foundTimeoutID = window.setTimeout(() => {
      this.qr_reader?.on('render', () => {});
      this.setState({result: undefined});
    }, 500);
  }

  render() {
    const height : number = window.screen.height < 500 && window.screen.height > window.screen.width ? 852 : 480;
    return (
      <div className="App">
        <Chip content={this.state.result} />
        <div className="profile-info">
          <p>FPS: {this.state.fps}</p>
          <p>MSPF: {this.state.mspf}</p>
        </div>
        <header className="App-header">
          <div id="canvas-container">
            <canvas width={480} height={height} id="stream-buffer" />
          </div>
          <button id="stop" onClick={this.onStop}>Stop</button>
        </header>
      </div>
    );
  }
}

export default App;
