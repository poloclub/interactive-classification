import React, { Component } from 'react';
import './App.css';

class Options extends Component {
  render() {
    return (
      <div className="box" id="options">
        <h1>Deep Vis</h1>
        <h4>Select Image:</h4>
        <select name="img-select" onChange={this.props.imageChanged}>
          <option value="boat.jpg">Boat</option>
          <option value="elephant.jpg">Elephant</option>
        </select>
        <h4>Brush Size:</h4>
        <div id="brush-container">
          <input type="range" min="2" max="30" defaultValue="15" id="brush-range"></input>
        </div>
      </div>
    );
  }
}

export default Options;
