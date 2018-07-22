import React, { Component } from 'react';
import drawImage, {predict, createRows, drawCAM} from './util.js';
import {Table, TableHeader, TableHeaderColumn, TableBody, TableRow, Paper} from 'material-ui';
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
        if (e.length !== 0) {
            // TODO: move IMAGENET_CLASSES SOMEWHERE
            let ar = Object.assign([], IMAGENET_CLASSES);
            let row = this.state.results[e[0]];
            let index = ar.indexOf(row.key);
            drawCAM(this.cImg, this.props.net, this.props.netName, this.state.activation, this.cCam, index);
        } else {
            const ctx = this.cCam.getContext('2d');
            ctx.clearRect(0, 0, 227, 227);
        }
    }

    drawAndUpdate = (image) => {
        const ctx = this.cImg.getContext('2d');
        // console.log("drawing image..", image);
        drawImage(ctx, image, function(img) {
            predict(img, this.props.net, this.props.netName, null, function(top, activation) {
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
        if (nProps.reset) {
          this.drawAndUpdate(this.props.image);
        }
        this.props = nProps;
    }

    render() {
      return (
          <div className="box" id="original">
              <Paper style={{marginBottom: 30, height: 227, width: 227}} zDepth={3}>
                <canvas id="original-canvas" height="227px" width="227px" ref={c => this.cImg = c}></canvas>
                <canvas id="original-cam" height="227px" width="227px" ref={c => this.cCam = c}></canvas>
              </Paper>
              <h3>Original Image</h3>
                <Table className="table" onRowSelection={this.drawCAM}>
                    <TableHeader adjustForCheckbox={false} displaySelectAll={false}>
                        <TableRow className="header-row">
                            <TableHeaderColumn>Class</TableHeaderColumn>
                            <TableHeaderColumn style={{textAlign: 'right'}}>Confidence %</TableHeaderColumn>
                        </TableRow>
                    </TableHeader>
                    <TableBody displayRowCheckbox={false} showRowHover={true} deselectOnClickaway={false}>
                        {this.state.results}
                    </TableBody>
                </Table>
                <img src={window.location.origin + '/gt_logo.png'} className="float-right" style={{width: "154px", height: "80px", bottom:"25px", right:"15px", position:"absolute"}}/>
                <img src={window.location.origin + '/cvpr_logo.jpg'} className="float-right" style={{width: "120px", height: "71px", bottom:"25px", right:"169px", position:"absolute"}}/>
                
          </div>
      );
    }
}

export default Original;
