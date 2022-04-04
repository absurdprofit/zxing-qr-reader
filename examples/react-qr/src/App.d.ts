import React from 'react';
import './css/App.css';
import QrReader from 'zxing-qr-reader';
interface AppState {
    file?: File;
    qr_reader?: QrReader;
}
declare class App extends React.Component<any, AppState> {
    state: AppState;
    componentDidMount(): void;
    componentWillUnmount(): void;
    render(): JSX.Element;
}
export default App;
