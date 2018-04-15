import React, { Component, Button } from 'react';
import {RaisedButton, Slider, SelectField, MenuItem, TextField} from 'material-ui';
import './App.css';

class Options extends Component {

  constructor(props) {
    super(props);
    this.state = {
      mLabel: props.net.constructor.name
    }
  }

  componentWillReceiveProps(nProps) {
        console.log("nProps (options)", nProps);
       
        if (nProps.reset) {
          this.setState({mLabel: nProps.net.constructor.name});
        }
  }

  render() {
    return (
      <div className="box" id="options">
        <div id="select-container">
          <h4>Select Image</h4>
          <SelectField onChange={this.props.imageChanged} value={this.props.image} fullWidth={true}>
            <MenuItem value="lighthouse.jpg" primaryText="Lighthouse"/>
            <MenuItem value="sailboat.jpg" primaryText="Sail Boat"/>
            <MenuItem value="boat.png" primaryText="Boat"/>
            <MenuItem value="room.jpg" primaryText="Room"/>
            <MenuItem value="elephant.jpg" primaryText="Elephant"/>
            <MenuItem value="crowd.jpg" primaryText="Crowd"/>
            <MenuItem value="ski.jpg" primaryText="Ski Lift"/>
            <MenuItem value="ride.jpg" primaryText="Attraction Park"/>
            <MenuItem value="jazz.jpg" primaryText="Jazz Stage"/>
            <MenuItem value="desk.jpg" primaryText="Desk"/>
            <MenuItem value="snow_park.jpg" primaryText="Snowy Park"/>
            <MenuItem value="beach.jpg" primaryText="Beach"/>
            <MenuItem value="classic_car.jpg" primaryText="Classic Car"/>
            <MenuItem value="port.jpg" primaryText="Port"/>
          </SelectField>
        </div>
        <div id="brush-container">
          <h4>Brush Size</h4>
          <div id="brush-slider-container">
            <div id="slider-container">
              <Slider min={2} max={30} defaultValue={15} step={1} className='slider' onChange={this.props.brushChanged}/>
            </div>
            <div id="svg-container">
              <svg height="60px" width="60px">
                <circle cx="30" cy="30" fill="rgb(40, 53, 147)" r={this.props.brushSize}/>
              </svg>
            </div>
          </div>
        </div>
        <div id="select-container">
          <RaisedButton className="modelButton" label="SqueezeNet" secondary={true} onClick={this.props.reloadSQ}/>
          <br />
          <RaisedButton className="modelButton" label="MobileNet" secondary={true} onClick={this.props.reloadMB}/>
          <h4>Current model: </h4> <TextField id="modelLabel" style={{display: "inline"}} value={this.state.mLabel} />
        </div>
        <div id="reset-button">
          <RaisedButton label="Reset" secondary={true} onClick={this.props.reset}/>
        </div>
      </div>
    );
    /*
        <div id="blur-container">
          <h4>Blur Radius:</h4>
          <Slider min={0.5} max={15} defaultValue={2} step={0.5} className='slider' onChange={this.props.blurChanged}/>
          <RaisedButton className="blur-button" label="Blur" primary={true} onClick={this.props.blur}/>
        </div>
    */
  }
}

export default Options;
