import React, { Component } from 'react';

import * as dl from 'deeplearn';
//import {SqueezeNet} from 'deeplearn-squeezenet';
import {SqueezeNet} from './squeezenet/squeezenet.js';
import {MuiThemeProvider, Toolbar, ToolbarTitle} from 'material-ui';

import Options from './Options.js';
import Modified from './Modified.js';
import Original from './Original.js';

import './App.css';

class App extends Component {
  constructor(props) {
    super(props);
    
    this.state = {
      netStatus: 'Loading SqueezeNet',
      image: 'boat.jpg',
      topK: new Map(),
      order: 0,
      brushSize: 15,
      blurSize: 2,
      blur: 0,
      reset: 0
    };

    this.math = dl.ENV.math;
    this.net = new SqueezeNet(this.math);
    this.net.load().then(() => {
      this.setState({
        netStatus: 'Loaded'
      }) 
    });
  }

  orderChanged = (e, val) => {
    this.setState({
      order: val
    });
  }

  imageChanged = (e, i, val) => {
    this.setState({
      image: val
    });
  }

  blurChanged = (e, val) => {
    this.setState({
      blurSize: val
    });
  }

  brushChanged = (e, val) => {
    this.setState({
      brushSize: val
    });
  }

  updateTop = (k) => {
    this.setState({
      topK: k
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
          <Toolbar>
            <ToolbarTitle text="Deep Vis" />
          </Toolbar>
          <div id="main">
            <Options imageChanged={this.imageChanged} brushChanged={this.brushChanged} blurChanged={this.blurChanged} blur={this.blur} reset={this.reset} 
                     blurSize={this.state.blurSize} brushSize={this.state.brushSize} image={this.state.image} orderChanged={this.orderChanged} />
            <Modified image={this.state.image} net={this.net} brushSize={this.state.brushSize} blurSize={this.state.blurSize} 
                      reset={this.state.reset} blur={this.state.blur} order={this.state.order} ref={(c) => this.mod = c} topK={this.state.topK} />
            <Original image={this.state.image} net={this.net} updateKeys={this.updateTop} />
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
