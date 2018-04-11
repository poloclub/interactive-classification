import React, { Component } from 'react';
// import {Table, TableHeader, TableHeaderColumn, TableBody, TableRow, Paper, Slider} from 'material-ui';
import {IMAGENET_CLASSES} from './mobilenet/imagenet_classes';
import './App.css';

import * as dl from 'deeplearn';
import {SqueezeNet} from './squeezenet/squeezenet.js'; // comment out
import {MobileNet} from './mobilenet/mobilenet.js';


export var netEnum = { 
  SQUEEZE: 1,
  MOBILE: 2,
  VGG: 3
};
Object.freeze(netEnum);

export function getModel (netName){
  switch (netName) {
    case netEnum.MOBILE:
      return new MobileNet(dl.ENV.math);
  }
}

export class model extends Component {

  constructor(props) {
    super(props);

    this.state = {
      netName: this.props.netSelection,
      netStatus: 'Loading model...',
      image: 'lighthouse.jpg',
      topK: new Map(),
      brushSize: 15,
      blurSize: 2,
      blur: 0,
      reset: 0,
    };

    this.net = this.getModel(this.netName);
    this.net.load().then(() => {
      this.setState({
        netStatus: 'Loaded'
      });
    });
  }


  predict(img, net, classes, callback) {
    const pixels = dl.fromPixels(img);
    const resized = dl.image.resizeBilinear(pixels, [227, 227]);

    const t0 = performance.now();
    const resAll = (this.netName==netEnum.SQUEEZE)?net.predictWithActivation(resized, 'fire9'):net.predictWithActivation(resized);
    console.log('Classification took ' + parseFloat(Math.round(performance.now() - t0)) + ' milliseconds');

    // const res = resAll.logits;
    const res = (this.netName==netEnum.SQUEEZE)?resAll.logits:resAll.logits;
    console.log(resAll);
    
    const map = new Map();
    if (classes == null) {
        console.log("classes == null");
        net.getTopKClasses(res, 1000).then((topK) => {
            for (let key in topK) {
                map.set(key, (topK[key]*100.0).toFixed(2));
            }
            callback(map, resAll.activation);
        });
    } else {
        console.log("classes != null");
        net.getTopKClasses(res, 1000).then((topK) => {
            for (let i = 0; i < 5; i++) {
                map.set(classes[i], (topK[classes[i]]*100.0).toFixed(2));
            }
            callback(map, resAll.activation);
        });
    }
  }
}
