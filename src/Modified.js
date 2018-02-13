import React, { Component } from 'react';
import drawImage, {predict, inpaint} from './util.js';
import './App.css';

class Modified extends Component {
    constructor(props) {
        super(props);

        this.state = {
            results: [],
            mouseDown: false,
            clickX: [],
            clickY: []
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
        if (this.state.mouseDown) {
            // Drawing from http://www.williammalone.com/articles/create-html5-canvas-javascript-drawing-app/

            const ctx = this.cDraw.getContext('2d');
            const rect = this.cDraw.getBoundingClientRect();

            const clickX = this.state.clickX;
            const clickY = this.state.clickY;
            clickX.push(evt.clientX - rect.left)
            clickY.push(evt.clientY - rect.top)

            ctx.clearRect(0, 0, 227, 227);
  
            ctx.strokeStyle = 'rgba(237, 17, 175, 0.5)';
            ctx.lineJoin = 'round';
            ctx.lineCap = 'round';
            ctx.lineWidth = 15;

            if (clickX.length > 1) {
                ctx.beginPath();
                ctx.moveTo(clickX[0], clickY[0]);
                for(var i = 1; i < clickX.length; i++) {		
                    ctx.lineTo(clickX[i], clickY[i]);
                }
                ctx.stroke();
            }
        }
    }

    mouseUp = () => {
        this.setState({
            mouseDown: false
        }) 

        var img = inpaint(this.cImg.getContext('2d'), this.cDraw.getContext('2d'));
        predict(img, this.props.net, function(top) {
            this.setState({
                results: top
            });
        }.bind(this));
    }

    mouseLeave = () => {
       this.setState({
           mouseDown: false
       }) 
    }

    componentDidMount() {
        const ctx = this.cImg.getContext('2d');
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
        const ctx = this.cImg.getContext('2d');
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
            <div className="box" id="original">
                <h2>Modified Image</h2>
                <canvas id="modified-canvas" height="227px" width="227px" 
                        ref={cImg => this.cImg = cImg}> 
                </canvas>
                <canvas id="draw-canvas" height="227px" width="227px" 
                        ref={cDraw => this.cDraw = cDraw} onMouseDown={this.mouseDown}
                        onMouseMove={this.mouseMove} onMouseUp={this.mouseUp}
                        onMouseLeave={this.mouseLeave}>
                </canvas>
                <div id="modified-results">
                    {this.state.results}
                </div>
            </div>
        );
    }
}

export default Modified;
