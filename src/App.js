import React, { Component } from 'react';

import * as dl from 'deeplearn';
import {SqueezeNet} from './squeezenet/squeezenet.js'; // comment out
import {MobileNet} from './mobilenet/mobilenet.js';
import {MuiThemeProvider, Toolbar, ToolbarTitle} from 'material-ui';
import {tealA700, red800} from 'material-ui/styles/colors';
import getMuiTheme from 'material-ui/styles/getMuiTheme';

import Options from './Options.js';
import Modified from './Modified.js';
import Original from './Original.js';

import './App.css';

var CnnEnum = { 
  SQUEEZE: 1,
  MOBILE: 2,
  VGG: 3
};
Object.freeze(CnnEnum);
// var model = CnnEnum.SQUEEZE;
var model = CnnEnum.MOBILE;

const muiTheme = getMuiTheme({
  palette: {
    primary1Color: tealA700,
    accent1Color: red800
  },
});

class App extends Component {
  constructor(props) {
    super(props);
    
    this.state = {
      netStatus: 'Loading MobileNet',
      image: 'lighthouse.jpg',
      topK: new Map(),
      brushSize: 15,
      blurSize: 2,
      blur: 0,
      reset: 0
    };

    this.math = dl.ENV.math;
    if (model == CnnEnum.SQUEEZE) {
      this.net = new SqueezeNet(this.math);
    } else if (model == CnnEnum.MOBILE) {
        this.net = new MobileNet(this.math);
    }
    this.net.load().then(() => {
      this.setState({
        netStatus: 'Loaded'
      }) 
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
        <MuiThemeProvider muiTheme={muiTheme}>
          <div id="mui-container">
            <Toolbar id="header" style={{backgroundColor: "rgb(40, 53, 147)", color: "white"}}>
              <ToolbarTitle text="Deep Inpainterpretation" />
            </Toolbar>
            <div id="main">
              <Options imageChanged={this.imageChanged} brushChanged={this.brushChanged} blurChanged={this.blurChanged} blur={this.blur} reset={this.reset} 
                      blurSize={this.state.blurSize} brushSize={this.state.brushSize} image={this.state.image}/>
              <Modified image={this.state.image} net={this.net} brushSize={this.state.brushSize} blurSize={this.state.blurSize} 
                        reset={this.state.reset} blur={this.state.blur} ref={(c) => this.mod = c} topK={this.state.topK} />
              <Original image={this.state.image} net={this.net} updateKeys={this.updateTop} />
            </div>
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
