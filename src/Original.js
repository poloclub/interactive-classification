import React, { Component } from 'react';
import drawImage, {predict, createRows} from './util.js';
import {Table, TableHeader, TableHeaderColumn, TableBody, TableRow} from 'material-ui';
import './App.css';

class Original extends Component {
    constructor(props) {
      super(props);

      this.state = {
        results: []
      };
    }

    drawAndUpdate = (image) => {
        const ctx = this.c.getContext('2d');
        drawImage(ctx, image, function(img) {
            predict(img, this.props.net, null, function(top) {
                let rows = createRows(top);
                this.setState({
                    results: rows
                });
                this.props.updateKeys(top);
            }.bind(this));
        }.bind(this));
    }

    componentDidMount() {
        this.drawAndUpdate(this.props.image);
    }

    componentWillReceiveProps(nProps) {
        if (this.props.image !== nProps.image) {
            this.drawAndUpdate(nProps.image);
        }
        this.props = nProps;
    }

    render() {
      return (
          <div className="box" id="modified">
              <h2>Original Image</h2>
              <canvas id="original-canvas" height="227px" width="227px" ref={c => this.c = c}></canvas>
                <Table className="table">
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
