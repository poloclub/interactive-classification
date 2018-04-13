import React, { Component } from 'react';
import {predict, inpaint, drawImage, createCompRows, drawCAM} from './util.js';
import {Table, TableHeader, TableHeaderColumn, TableBody, TableRow} from 'material-ui';
import {IMAGENET_CLASSES} from './squeezenet/imagenet_classes.js';
import {canvasRGB} from 'stackblur-canvas';
import './App.css';

class Modified extends Component {
    constructor(props) {
        super(props);

        this.state = {
            results: [],
            mouseDown: false,
            clickX: [],
            clickY: [],
            order: 0,
        };
    }

    mouseDown = () => {
       this.setState({
           mouseDown: true,
           clickX: [],
           clickY: []
       }) 
    }

    mouseMove = (evt) => {
        const ctx = this.cDraw.getContext('2d');
        const rect = this.cDraw.getBoundingClientRect();
        const x = evt.clientX - rect.left;
        const y = evt.clientY - rect.top;
        if (this.state.mouseDown) {
            // Drawing from http://www.williammalone.com/articles/create-html5-canvas-javascript-drawing-app/
            const clickX = this.state.clickX;
            const clickY = this.state.clickY;
            clickX.push(x)
            clickY.push(y)

            ctx.clearRect(0, 0, 227, 227);
  
            ctx.strokeStyle = 'rgba(237, 17, 175, 0.5)';
            ctx.lineJoin = 'round';
            ctx.lineCap = 'round';
            ctx.lineWidth = this.props.brushSize * 2;

            if (clickX.length > 1) {
                ctx.beginPath();
                ctx.moveTo(clickX[0], clickY[0]);
                for(let i = 1; i < clickX.length; i++) {		
                    ctx.lineTo(clickX[i], clickY[i]);
                }
                ctx.stroke();
            }
        } else {
            ctx.clearRect(0, 0, 227, 227);
  
            ctx.strokeStyle = 'rgba(237, 17, 175, 0.5)';
            ctx.lineJoin = 'round';
            ctx.lineCap = 'round';
            ctx.lineWidth = this.props.brushSize * 2;
            ctx.beginPath();
            ctx.moveTo(x, y);
            ctx.lineTo(x, y);
            ctx.stroke();
        }
    }

    mouseUp = () => {
        this.setState({
            mouseDown: false
        }) 

        inpaint(this.cImg.getContext('2d'), this.cDraw.getContext('2d'))
        .then(img => {
            let classes = null;
            if (!this.state.order) {
                classes = Array.from(this.props.topK.keys());
            }
            predict(img, this.props.net, classes, function(top, activation) {
                const rows = createCompRows(top, this.props.topK);
                this.setState({
                    results: rows,
                    activation: activation
                });
            }.bind(this));
         });
    }

    mouseLeave = () => {
       const ctx = this.cDraw.getContext('2d');
       ctx.clearRect(0, 0, 227, 227);
       this.setState({
           mouseDown: false
       }) 
    }

    drawCAM = (e) => {
        if (e.length !== 0) {
            let ar = Object.assign([], IMAGENET_CLASSES);
            let row = this.state.results[e[0]];
            let index = ar.indexOf(row.key);
            drawCAM(this.cImg, this.props.net, this.state.activation, this.cCam, index);
        } else {
            const ctx = this.cCam.getContext('2d');
            ctx.clearRect(0, 0, 227, 227);
        }
    }

    orderChanged = (e, row, column) => {
        if (column === 2) {
            if (this.state.order) {
                e.target.innerHTML = 'Confidence %';
            } else {
                e.target.innerHTML = '↓ Confidence %';
            }
                this.changeOrder(!this.state.order);
                this.setState({
                    order: !this.state.order
                });
        }
    }

    changeOrder = (val) => {
        let classes = null;
        if (!val) {
            classes = Array.from(this.props.topK.keys());
        }
        predict(this.cImg, this.props.net, classes, function(top, activation) {
            let rows = createCompRows(top, this.props.topK);
            this.setState({
                results: rows,
                activation: activation
            });
        }.bind(this));
    }

    componentDidMount() {
        const ctx = this.cImg.getContext('2d');
        drawImage(ctx, this.props.image, function(img) {
            predict(img, this.props.net, null, function(top, activation) {
                let rows = createCompRows(top, null);
                this.setState({
                    results: rows,
                    activation: activation
                });
            }.bind(this));
        }.bind(this));
    }

    componentWillReceiveProps(nProps) {
        let classes = null;
        if (!this.state.order) {
            classes = Array.from(this.props.topK.keys());
        }
        if (nProps.reset || nProps.image !== this.props.image) {
            let ctx = this.cCam.getContext('2d');
            ctx.clearRect(0, 0, 227, 227);
            ctx = this.cImg.getContext('2d');
            drawImage(ctx, nProps.image, function(img) {
                predict(img, nProps.net, null, function(top, activation) {
                    let rows = createCompRows(top, null);
                    this.setState({
                        results: rows,
                        activation: activation,
                        cam: [-1]
                    });
                }.bind(this));
            }.bind(this));
        } else if (nProps.blur) {
            canvasRGB(this.cImg, 0, 0, 227, 227, this.props.blurSize);
            predict(this.cImg, nProps.net, classes, function(top, activation) {
                let rows = createCompRows(top, this.props.topK);
                this.setState({
                    results: rows,
                    activation: activation
                });
            }.bind(this));
        }
        this.props = nProps;
    }

    render() {
        return (
            <div className="box" id="modified">
                <canvas id="modified-canvas" height="227px" width="227px" 
                        ref={cImg => this.cImg = cImg}> 
                </canvas>
                <canvas id="modified-cam" height="227px" width="227px" ref={c => this.cCam = c}></canvas>
                <canvas id="draw-canvas" height="227px" width="227px" 
                        ref={cDraw => this.cDraw = cDraw} onMouseDown={this.mouseDown}
                        onMouseMove={this.mouseMove} onMouseUp={this.mouseUp}
                        onMouseLeave={this.mouseLeave}>
                </canvas>
                <h3>Modified Image</h3>
                <Table className="table" onRowSelection={this.drawCAM}>
                    <TableHeader adjustForCheckbox={false} displaySelectAll={false}>
                        <TableRow className="header-row" onCellClick={(e, f, g) => this.orderChanged(e, f, g)}>
                            <TableHeaderColumn>Class</TableHeaderColumn>
                            <TableHeaderColumn style={{textAlign: 'right', cursor: 'pointer'}}>Confidence %</TableHeaderColumn>
                            <TableHeaderColumn style={{textAlign: 'right'}}>Absolute % Change</TableHeaderColumn>
                        </TableRow>
                    </TableHeader>
                    <TableBody displayRowCheckbox={false} showRowHover={true} deselectOnClickaway={false}>
                        {this.state.results}
                    </TableBody>
                </Table>
            </div>
        );
    }
}

export default Modified;
