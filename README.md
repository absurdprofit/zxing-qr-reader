# ZXing QR Reader
A QR code reader based on a wasm port of Zebra Crossing library by [@nu-book](https://github.com/nu-book).

## Installation
```
npm install zxing-qr-reader
```

## Demo
You can find the demo [here](https://nxtexe.github.io/zxing-qr-reader/)

## Usage
Instantiate the QrReader class by passing a canvas context to the constructor.  
The way this was designed means you shouldn't need a react to use it :D.  
NOTE: The resolution of the camera feed is the same as the size of the canvas.
```
import React from 'react';
import { QrReader } from 'zxing-qr-reader';

class App extends React.Component {
	componentDidMount() {
		const canvas = document.getElementById('canvas');//get canvas
		const context = canvas.getContext('2d');//get canvas context

		this.qr_reader = new QrReader(context);//instantiate qr reader

		this.qr_reader.scan();//start scan

		this.qr_reader.on('found', (result) => {
			console.log(result.text); //called when qr code was found
		});
    	}
    
	componentWillUnmount() {
		this.qr_reader.stop();
	}
	render() {
		return (
			<div>
				<canvas id="canvas" width={480} height={852}></canvas> //480p resolution in portrait on mobile
			</div>
		);
	}
}
```
A cover calculation is done when the image is drawn to the canvas meaning supplying one resolution for mobile devices and one other for desktop devices should suffice.  
Typically a 600x600 resolution for desktop and 480x852 resolution for mobile does the trick. This gives fullscreen image on mobile and a large enough image on most desktop monitors.
#### QR Code From File
```
const file = e.target.files[0];
const result = this.qr_reader.readBarCodeFromFile(file);
```

#### Error Handling
```
this.qr_reader.on('error', (e) => {
	console.log(e);
});
```
##### Errors
```Stream already initialised.``` Occurs when ```scan()``` method is called contiguously.

```DOM Exception. Permission denied.``` Occurs when the user has not given your site permission. ```Error. Permission denied. Please update browser permissions to access camera.``` is written to the canvas in this event. Notifying the user.

```Browser does not support getUserMedia``` Occurs when a browser does not support webRTC. ```Error. Your browser does not support camera access. Use a modern browser or update your browser.``` is written to the canvas in this event. Notifying the user.

```Stream was not initialised``` Occurs when ```stop()``` method is called before ```scan()``` method.

```Reader isn't initialised``` Occurs when readBarCodeFile is called before wasm module is loaded. (Uncommon)

## Known Issues
Trying to set a canvas size that is of a higher resolution than the device camera can deliver, undefined behaviour occurs.  

Calling ```stop()``` before the reader could fully initialise causes a bug where the last stream is always on. Meaning the user camera stays on and calling ```stop()``` changes nothing.
