import React, { Component } from 'react';
import drawImage, {predict} from './util.js';
import './App.css';

class Original extends Component {
    constructor(props) {
      super(props);

      this.state = {
        results: []
      };
    }

    componentDidMount() {
        const ctx = this.c.getContext('2d');
        drawImage(ctx, this.props.image, function(img) {
            predict(img, this.props.net, function(top) {
                this.setState({
                    results: top
                });
            }.bind(this));
        }.bind(this));
    }

    componentWillReceiveProps(nProps) {
        this.props = nProps;
        const ctx = this.c.getContext('2d');
        drawImage(ctx, this.props.image, function(img) {
            predict(img, this.props.net, function(top) {
                this.setState({
                    results: top
                });
            }.bind(this));
        }.bind(this));
    }

    render() {
      return (
          <div className="box" id="modified">
              <h2>Original Image</h2>
              <canvas id="original-canvas" height="227px" width="227px" ref={c => this.c = c}></canvas>
              <div id="original-results">
                  {this.state.results}
              </div>
          </div>
      );
    }
}

export default Original;
