import React, { Component } from 'react';

import * as dl from 'deeplearn';
import {SqueezeNet} from './squeezenet/squeezenet.js';
import {MobileNet} from './mobilenet/mobilenet.js';
import {MuiThemeProvider, Toolbar, ToolbarTitle, Card} from 'material-ui';
import {indigo500, red800} from 'material-ui/styles/colors';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import {ClipLoader} from 'react-spinners';
import ReactPlayer from 'react-player';

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
      loading: false,
      net: ''
    };

    // Set your default ConvNet model here: 
    // model.netEnum.MOBILE or model.netEnum.SQUEEZE
    var netName = model.netEnum.SQUEEZE;
    this.net = model.getModel(netName);
    this.net.load().then(() => {
      this.setState({
        netStatus: 'Loaded',
        netName: 'SqueezeNet'
      });
    });
  }

  imageChanged = (e, i, val) => {
    if (!val) {
      let reader = new FileReader();
      reader.onload = (event) => {
          this.setState({image: event.target.result});
      };
      reader.readAsDataURL(e.target.files[0]);
    } else {
      this.setState({
        image: val
      });
    }
  }

  setCroppedImage = e => {
    this.setState({image: e});
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

  reloadSqueeze = (e, val) => {
    this.setState({
      loading: true
    });
    this.net = new SqueezeNet(this.math);
    this.net.load().then(() => {
      console.log("squeeze loaded!!")
      this.setState({
        netStatus: 'Loaded',
        netName: 'SqueezeNet'
      });
      this.reset();
    }).then(() => this.setState({
      loading: false
    }));
  }

  reloadMobile = (e, val) => {
    this.setState({
      loading: true
    });
    this.net = new MobileNet(this.math);
    this.net.load().then(() => {
      this.setState({
        netStatus: 'Loaded',
        netName: 'MobileNet'
      });
      this.reset();
    }).then(() => this.setState({
      loading: false
    }));
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
          <div id="mui-container">
            <div className="banner-cover" id="banner">
              <div style={{display: "inline"}}>                
                <span className="subtitle-right">
                  <div id="model-loader">
                    <ClipLoader id="model-loader" color={'white'} loading={this.state.loading}/>
                  </div>
                  <div style={{marginTop: "5px", marginBottom: "5px", display:"inline"}}>
                    powered by <img src={window.location.origin + '/tfjs.png'} style={{width: "171px", height: "26px"}} alt={"Tensorflow.js"}/>
                  </div>
                </span>
                <p className="banner-intro"> 
                  <span className="title-shine">Interactive Classification for Deep Learning Interpretation</span><br/><span className="subtitle">CVPR 2018, Salt Lake City. </span><br/><br/>
                </p>
              </div>
            </div>
            <div id="main">
              <Options imageChanged={this.imageChanged} setCroppedImage={this.setCroppedImage} handleFiles={this.handleFiles} imageUploaded={this.imageUploaded} brushChanged={this.brushChanged} blurChanged={this.blurChanged} blur={this.blur} reset={this.reset} 
                      blurSize={this.state.blurSize} brushSize={this.state.brushSize} image={this.state.image} reloadSQ={this.reloadSqueeze} reloadMB={this.reloadMobile} netName={this.state.netName} />
              <Modified image={this.state.image} net={this.net} brushSize={this.state.brushSize} blurSize={this.state.blurSize}  
                        reset={this.state.reset} blur={this.state.blur} ref={(c) => this.mod = c} topK={this.state.topK} netName={this.state.netName} />
              <Original image={this.state.image} net={this.net} reset={this.state.reset} updateKeys={this.updateTop} netName={this.state.netName} />
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
