import React, { Component } from 'react';
import './App.css';

class Options extends Component {
  constructor(props) {
    super(props);

    this.state = {
      brushSize: 15
    };
  }
  
  brushChanged = (e) => {
    this.setState({
      brushSize: e.target.value
    });
    this.props.brushChanged(e);
  }

  render() {
    return (
      <div className="box" id="options">
        <h1>Deep Vis</h1>
        <h4>Select Image:</h4>
        <select id="img-select" onChange={this.props.imageChanged}>
          <option value="boat.jpg">Boat</option>
          <option value="elephant.jpg">Elephant</option>
        </select>
        <div id="brush-container">
          <h4>Brush Size:</h4>
          <input type="range" min="2" max="30" defaultValue="15" id="brush-range" onChange={this.brushChanged}></input>
          <svg height="60px" width="60px">
            <circle cx="30" cy="30" r={this.state.brushSize}/>
          </svg>
          <p id="brush-size-text">{this.state.brushSize}</p>
        </div>
        <button id="reset-button" onClick={this.props.reset}>Reset</button>
      </div>
    );
  }
}

export default Options;
