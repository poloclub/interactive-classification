import React, { Component } from 'react';

import {ENV} from 'deeplearn';
import {SqueezeNet} from 'deeplearn-squeezenet';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

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
      brushSize: 15,
      blurSize: 0,
      reset: 0,
      blur: 0
    };

    this.math = ENV.math;
    this.net = new SqueezeNet(this.math);
    this.net.load().then(() => {
      this.setState({
        netStatus: 'Loaded'
      }) 
    });
  }

  imageChanged = (val) => {
    this.setState({
      image: val
    });
  }

  blurChanged = (val) => {
    this.setState({
      blurSize: val
    });
  }

  brushChanged = (val) => {
    this.setState({
      brushSize: val
    });
  }
  
  reset = (e) => {
    this.setState({
      reset: 1
    }, function() {
      this.setState({
        reset: 0
      });
    });
  }

  blur = (e) => {
    this.setState({
      blur: 1
    }, function() {
      this.setState({
        blur: 0
      });
    });
  }

  render() {
    if (this.state.netStatus === "Loaded") {
      return (
        <MuiThemeProvider>
          <div id="main">
            <Options imageChanged={this.imageChanged} brushChanged={this.brushChanged} blurChanged={this.blurChanged} blur={this.blur} reset={this.reset} />
            <Modified image={this.state.image} net={this.net} brushSize={this.state.brushSize} blurSize={this.state.blurSize} 
                      reset={this.state.reset} blur={this.state.blur} ref={(c) => this.mod = c}/>
            <Original image={this.state.image} net={this.net}/>
          </div>
        </MuiThemeProvider>
      );
    } else {
      return (
        <h3>Loading SqueezeNet</h3>
      );
    }
  }
}

export default App;
