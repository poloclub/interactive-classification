import React, { Component } from 'react';
import {RaisedButton, Slider, SelectField, MenuItem, Card, CardHeader, CardText, CardActions, FlatButton} from 'material-ui';
import NavigationArrowForward from 'material-ui/svg-icons/navigation/arrow-forward';
import NavigationArrowBack from 'material-ui/svg-icons/navigation/arrow-back';
import {indigo800} from 'material-ui/styles/colors';
import './App.css';

class Options extends Component {
  constructor(props) {
    super(props);
    
    this.state = {
      tSlide: 0,
      slides: [
        <span><b>Interactive Classification</b> allows you to modify images in order to explore how computers see.</span>,
        <span>The <b>Class</b> column tells you what the computer thinks the image is, and the <b>Confidence %</b> column tells you how confident it is in that choice.</span>,
        <span>By clicking on a row a <b>Class Activation Map</b> will appear. This heatmap shows what areas of the image the computer found the most important when choosing that class.</span>,
        <span>Modifying the image allows you to explore how robust or sensitive the computer is. Hovering over the <b>Modified Image</b> you will see a pink circle. Use this to remove an object in the image by drawing over it (click and drag).</span>,
        <span>The <b>Absolute % Change</b> column shows you by how much the old classification % has changed in the modified image. Clicking on <b>Confidence %</b> lets you see the new top classes. You can also see the new <b>Class Activation Maps</b> for the modified image by clicking on the row!</span>,
        <span>Try out different images and see how the computer does! You can try taking the ball out of a soccer match, removing the poles from a skier, taking people out of a beach scene, and much more!</span>
      ]
    };
  }

  nextPage = () => {
    if (this.state.tSlide !== this.state.slides.length - 1) {
      this.setState({
        tSlide: this.state.tSlide + 1
      });
    }
  }

  prevPage = () => {
    if (this.state.tSlide !== 0) {
      this.setState({
        tSlide: this.state.tSlide - 1
      });
    }
  }

  render() {
    return (
      <div className="box" id="options">
        <div id="select-container">
          <h4>Select Image</h4>
          <SelectField onChange={this.props.imageChanged} value={this.props.image} fullWidth={true}>
            <MenuItem value="lighthouse.jpg" primaryText="Lighthouse"/>
            <MenuItem value="sailboat.jpg" primaryText="Sail Boat"/>
            <MenuItem value="soccer.jpg" primaryText="Soccer"/>
            <MenuItem value="baseball.jpg" primaryText="Baseball"/>
            <MenuItem value="nadal.jpg" primaryText="Nadal"/>
            <MenuItem value="boat.png" primaryText="Boat"/>
            <MenuItem value="elephant.jpg" primaryText="Elephant"/>
            <MenuItem value="crowd.jpg" primaryText="Crowd"/>
            <MenuItem value="ski.jpg" primaryText="Ski Lift"/>
            <MenuItem value="skiing.jpg" primaryText="Skiing"/>
            <MenuItem value="ride.jpg" primaryText="Attraction Park"/>
            <MenuItem value="jazz.jpg" primaryText="Jazz Stage"/>
            <MenuItem value="desk.jpg" primaryText="Desk"/>
            <MenuItem value="beach.jpg" primaryText="Beach"/>
          </SelectField>
        </div>
        <div id="brush-container">
          <h4>Brush Size</h4>
          <div id="brush-slider-container">
            <div id="slider-container">
              <Slider min={2} max={30} defaultValue={15} step={1} className='slider' onChange={this.props.brushChanged}/>
            </div>
            <div id="svg-container">
              <svg height="60px" width="60px">
                <circle cx="30" cy="30" fill="rgb(40, 53, 147)" r={this.props.brushSize}/>
              </svg>
            </div>
          </div>
        </div>
        <div id="reset-button">
          <RaisedButton label="Reset" secondary={true} onClick={this.props.reset}/>
        </div>
        <div id="tutorial-container">
          <Card>
            <CardHeader title="Tutorial" titleColor={indigo800} titleStyle={{fontWeight: 800}} style={{paddingBottom: 0}} />
            <CardText style={{paddingTop: 10}}>
              {this.state.slides[this.state.tSlide]}
            </CardText>
            <CardActions>
              <FlatButton icon={<NavigationArrowBack />} onClick={this.prevPage} />
              <FlatButton icon={<NavigationArrowForward />} onClick={this.nextPage}/>
            </CardActions>
          </Card>
        </div>
      </div>
    );
    /*
        <div id="blur-container">
          <h4>Blur Radius:</h4>
          <Slider min={0.5} max={15} defaultValue={2} step={0.5} className='slider' onChange={this.props.blurChanged}/>
          <RaisedButton className="blur-button" label="Blur" primary={true} onClick={this.props.blur}/>
        </div>
    */
  }
}

export default Options;
