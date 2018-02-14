import React, { Component } from 'react';

import {ENV} from 'deeplearn';
import {SqueezeNet} from 'deeplearn-squeezenet';

import Options from './Options.js';
import Modified from './Modified.js';
import Original from './Original.js';

import './App.css';


class App extends Component {
  constructor(props) {
    super(props);
    
    this.state = {
      image: 'boat.jpg',
      netStatus: 'Loading SqueezeNet',
      brushSize: 15
    };

    this.math = ENV.math;
    this.net = new SqueezeNet(this.math);
    this.net.load().then(() => {
      this.setState({
        netStatus: 'Loaded'
      }) 
    });
  }

  imageChanged = (e) => {
    this.setState({
      image: e.target.value
    });
  }

  brushChanged = (e) => {
    this.setState({
      brushSize: e.target.value
    });
  }
  
  reset = (e) => {
    this.setState({
      image: this.state.image
    });
  }

  render() {
    if (this.state.netStatus === "Loaded") {
      return (
        <div id="main">
          <Options imageChanged={this.imageChanged} brushChanged={this.brushChanged} reset={this.reset}/>
          <Modified image={this.state.image} net={this.net} brushSize={this.state.brushSize}/>
          <Original image={this.state.image} net={this.net}/>
        </div>
      );
    } else {
      return (
        <h3>Loading SqueezeNet</h3>
      );
    }
  }
}

export default App;
