import React, { Component } from 'react';
import drawImage, {predict, createRows, drawCAM} from './util.js';
import {Table, TableHeader, TableHeaderColumn, TableBody, TableRow} from 'material-ui';
import {IMAGENET_CLASSES} from './squeezenet/imagenet_classes.js';
import './App.css';

class Original extends Component {
    constructor(props) {
      super(props);

      this.state = {
        results: [],
        activation: null
      };
    }

    drawCAM = (e) => {
        if (e.length != 0) {
            let ar = Object.assign([], IMAGENET_CLASSES);
            let row = this.state.results[e[0]];
            let index = ar.indexOf(row.key);
            drawCAM(this.cImg, this.props.net, this.state.activation, this.cCam, index);
        } else {
            const ctx = this.cCam.getContext('2d');
            ctx.clearRect(0, 0, 227, 227);
        }
    }

    drawAndUpdate = (image) => {
        const ctx = this.cImg.getContext('2d');
        drawImage(ctx, image, function(img) {
            predict(img, this.props.net, null, function(top, activation) {
                let rows = createRows(top, this.drawCAM);
                this.setState({
                    results: rows,
                    activation: activation
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
              <canvas id="original-canvas" height="227px" width="227px" ref={c => this.cImg = c}></canvas>
              <canvas id="original-cam" height="227px" width="227px" ref={c => this.cCam = c}></canvas>
              <h3>Original Image</h3>
                <Table className="table" onRowSelection={this.drawCAM}>
                    <TableHeader adjustForCheckbox={false} displaySelectAll={false}>
                        <TableRow className="header-row">
                            <TableHeaderColumn>Class</TableHeaderColumn>
                            <TableHeaderColumn style={{textAlign: 'right'}}>Confidence</TableHeaderColumn>
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
