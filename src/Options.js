import React, { Component } from 'react';
import {RaisedButton, Slider, SelectField, MenuItem, Toggle} from 'material-ui';
import './App.css';

class Options extends Component {
  render() {
    return (
      <div className="box" id="options">
        <h4>Select Image:</h4>
        <SelectField onChange={this.props.imageChanged} value={this.props.image} fullWidth={true}>
          <MenuItem value="boat.jpg" primaryText="Boat"/>
          <MenuItem value="elephant.jpg" primaryText="Elephant"/>
          <MenuItem value="crowd.jpg" primaryText="Crowd"/>
          <MenuItem value="ski.jpg" primaryText="Ski Lift"/>
          <MenuItem value="ride.jpg" primaryText="Attraction Park"/>
          <MenuItem value="jazz.jpg" primaryText="Jazz Performance"/>
        </SelectField>
        <div id="brush-container">
          <h4>Brush Size:</h4>
          <Slider min={2} max={30} defaultValue={15} step={1} className='slider' onChange={this.props.brushChanged}/>
          <svg height="60px" width="60px">
            <circle cx="30" cy="30" fill="rgb(0, 188, 212)" r={this.props.brushSize}/>
          </svg>
          <p id="brush-size-text">{this.props.brushSize}</p>
        </div>
        <div id="blur-container">
          <h4>Blur Radius:</h4>
          <Slider min={0.5} max={15} defaultValue={2} step={0.5} className='slider' onChange={this.props.blurChanged}/>
          <RaisedButton className="blur-button" label="Blur" primary={true} onClick={this.props.blur}/>
        </div>
        <div id="top-order">
          <Toggle style={{ display: 'inline-block', width: '130px', marginLeft: '25px'}} label="Top Order" onToggle={this.props.orderChanged} />
        </div>
        <div id="reset-button">
          <RaisedButton label="Reset" primary={true} onClick={this.props.reset}/>
        </div>
      </div>
    );
  }
}

export default Options;
