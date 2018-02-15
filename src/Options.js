import React, { Component } from 'react';
import RaisedButton from 'material-ui/RaisedButton';
import Slider from 'material-ui/Slider';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import './App.css';

class Options extends Component {
  constructor(props) {
    super(props);

    this.state = {
      brushSize: 15,
      image: 'boat.jpg'
    };
  }
  
  brushChanged = (e, val) => {
    this.setState({
      brushSize: val
    });
    this.props.brushChanged(val);
  }

  imageChanged = (e, i, val) => {
    this.setState({
      image: val
    });
    this.props.imageChanged(val);
  }

  render() {
    return (
      <div className="box" id="options">
        <h1>Deep Vis</h1>
        <h4>Select Image:</h4>
        <SelectField onChange={this.imageChanged} value={this.state.image} fullWidth={true}>
          <MenuItem value="boat.jpg" primaryText="Boat"/>
          <MenuItem value="elephant.jpg" primaryText="Elephant"/>
        </SelectField>
        <div id="brush-container">
          <h4>Brush Size:</h4>
          <Slider min={2} max={30} defaultValue={15} step={1} className='brush-slider' onChange={(event, value) => this.brushChanged(event, value)}/>
          <svg height="60px" width="60px">
            <circle cx="30" cy="30" fill="rgb(0, 188, 212)" r={this.state.brushSize}/>
          </svg>
          <p id="brush-size-text">{this.state.brushSize}</p>
        </div>
        <div id="reset-button">
          <RaisedButton label="Reset" primary={true} onClick={this.props.reset}/>
        </div>
      </div>
    );
  }
}

export default Options;
