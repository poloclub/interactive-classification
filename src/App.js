import React, { Component } from 'react';

import * as dl from 'deeplearn';
import {SqueezeNet} from './squeezenet/squeezenet.js';
import {MobileNet} from './mobilenet/mobilenet.js';
import {MuiThemeProvider, Toolbar, ToolbarTitle, Card} from 'material-ui';
import {indigo500, red800} from 'material-ui/styles/colors';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import {BeatLoader} from 'react-spinners';

import * as model from './model.js';
import Options from './Options.js';
import Modified from './Modified.js';
import Original from './Original.js';

import './App.css';

class App extends Component {
  constructor(props) {
    super(props);

    // muiTheme only used in App.js: global var -> class specfic
    this.muiTheme = getMuiTheme({
      palette: {
        primary1Color: indigo500,
        accent1Color: red800
      },
    });
    
    this.state = {
      netStatus: 'Loading SqueezeNet',
      image: 'lighthouse.jpg',
      topK: new Map(),
      brushSize: 15,
      blurSize: 2,
      blur: 0,
      reset: 0,
      loading: false
    };

    // Set your ConvNet model here: 
    // model.netEnum.MOBILE or model.netEnum.SQUEEZE
    var netName = model.netEnum.SQUEEZE;
    this.net = model.getModel(netName);
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
        reset: 0,
        loading: false
      });
    });
  }

  // TODO: rewrite model transition into one function and move to model.js
  reloadSqueeze = (e, val) => {
    this.setState({
      loading: true
    });
    this.net = new SqueezeNet(this.math);
    this.net.load().then(() => {
      console.log("squeeze loaded!!")
      this.setState({
        netStatus: 'Loaded'
      });
      this.reset();
    });
  }

  reloadMobile = (e, val) => {
    this.setState({
      loading: true
    });
    this.net = new MobileNet(this.math);
    this.net.load().then(() => {
      this.setState({
        netStatus: 'Loaded'
      });
      this.reset();
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
        <MuiThemeProvider muiTheme={this.muiTheme}>
          <BeatLoader color={'rgb(40, 53, 147)'} loading={this.state.loading} margin={'0 auto'}/>
          <div id="mui-container">
            <Toolbar id="header" style={{backgroundColor: "rgba(63, 81, 181,1.0)", color: "white"}}>
              <a href="/"><ToolbarTitle text="Interactive Classification" /></a>
            </Toolbar>
            <div id="main">
              <Options imageChanged={this.imageChanged} brushChanged={this.brushChanged} blurChanged={this.blurChanged} blur={this.blur} reset={this.reset} 
                      blurSize={this.state.blurSize} brushSize={this.state.brushSize} image={this.state.image} reloadSQ={this.reloadSqueeze} reloadMB={this.reloadMobile} net={this.net} />
              <Modified image={this.state.image} net={this.net} brushSize={this.state.brushSize} blurSize={this.state.blurSize} 
                        reset={this.state.reset} blur={this.state.blur} ref={(c) => this.mod = c} topK={this.state.topK} />
              <Original image={this.state.image} net={this.net} reset={this.state.reset} updateKeys={this.updateTop} />
            </div>
          </div>
        </MuiThemeProvider>
      );
    } else {
      return (
        <h3>Loading image classifier...</h3>
      );
    }
  }
}

export default App;
