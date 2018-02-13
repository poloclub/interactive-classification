import React, { Component } from 'react';
import drawAndPredict from './classify.js';
import './App.css';

class Modified extends Component {
    constructor(props) {
      super(props);

      this.state = {
        results: []
      };
    }


    componentDidMount() {
      const ctx = this.c.getContext('2d');
      drawAndPredict(ctx, this.props.image, this.props.net, function(top) {
          this.setState({
              results: top
          });
      }.bind(this));
    }

    componentWillReceiveProps(nProps) {
        this.props = nProps;
        const ctx = this.c.getContext('2d');
        drawAndPredict(ctx, this.props.image, this.props.net, function(top) {
            this.setState({
                results: top
            });
        }.bind(this));
    }

    render() {
      return (
          <div className="box" id="modified">
              <h2>Modified Image</h2>
              <canvas id="modified-canvas" height="227px" width="227px" ref={c => this.c = c}></canvas>
              <div id="modified-results">
                  {this.state.results}
              </div>
          </div>
      );
    }
}

export default Modified;
