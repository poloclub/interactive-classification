import React, { Component } from 'react';
import drawImage, {predict} from './util.js';
import {Table, TableHeader, TableHeaderColumn, TableBody, TableRow} from 'material-ui';
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
        if (this.props.image !== nProps.image) {
            const ctx = this.c.getContext('2d');
            drawImage(ctx, nProps.image, function(img) {
                predict(img, nProps.net, function(top) {
                    this.setState({
                        results: top
                    });
                }.bind(this));
            }.bind(this));
        }
        this.props = nProps;
    }

    render() {
      return (
          <div className="box" id="modified">
              <h2>Original Image</h2>
              <canvas id="original-canvas" height="227px" width="227px" ref={c => this.c = c}></canvas>
                <Table className="table" selectable={false}>
                    <TableHeader adjustForCheckbox={false} displaySelectAll={false}>
                        <TableRow className="header-row">
                            <TableHeaderColumn>Class</TableHeaderColumn>
                            <TableHeaderColumn>Confidence</TableHeaderColumn>
                        </TableRow>
                    </TableHeader>
                    <TableBody displayRowCheckbox={false}>
                        {this.state.results}
                    </TableBody>
                </Table>
          </div>
      );
    }
}

export default Original;
