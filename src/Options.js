import React, { Component } from 'react';
import {RaisedButton, Slider, SelectField, MenuItem, Card, CardHeader, CardText, CardActions, FlatButton} from 'material-ui';
import NavigationArrowForward from 'material-ui/svg-icons/navigation/arrow-forward';
import NavigationArrowBack from 'material-ui/svg-icons/navigation/arrow-back';
import {indigo500} from 'material-ui/styles/colors';
import { withStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import './App.css';

import { unmountComponentAtNode } from 'react-dom';
import ReactDOM from 'react-dom';
import ReactCrop, {makeAspectCrop} from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';
import Button from '@material-ui/core/Button';


class Options extends Component {
  constructor(props) {
    super(props);
    
    this.state = {
      mLabel: props.netName,
      tSlide: 0,
      slides: [
        <span><b>Interactive Classification</b> allows you to modify images to explore how computers see.</span>,
        <span>The <b>Class</b> column tells you what the computer thinks the image is, and the <b>Confidence %</b> column tells you how confident it is in its choice.</span>,
        <span>You can click on row to see the <b>Class Activation Map</b>. This is a heatmap showing which areas of the image the computer found most important when choosing that class.</span>,
        <span>Hover over the <b>Modified Image</b> to see a yellow circle. Draw, by clicking and draging over the image, to remove an object from the image.</span>,
        <span>The <b>Absolute % Change</b> column shows you the difference between the original classication and the modified classification. Clicking on <b>Confidence %</b> sorts by the new top classes. You can also see the new <b>Class Activation Maps</b> for the modified image by clicking on a row.</span>,
        <span>Try out different images and see how the computer does! You can try taking the ball out of a soccer match, removing the poles from a skier, taking people out of a beach scene, and much more!</span>
      ],
      displayTutorial: true,
      src: null,
      crop: null
    };
  }

  onImageLoaded = image => {
    this.setState({
      crop: makeAspectCrop({
        x: 25,
        y: 25,
        aspect: 1 / 1,
        width: 227,
      }, 
      image.width / image.height), 
      image: image
    });
  }

  onCropClicked = () => {
    this.getCroppedImg(this.state.image, this.state.crop);
  }

  onSelectFile = e => {
    if (e.target.files && e.target.files.length > 0) {
      const reader = new FileReader();
      reader.addEventListener(
        'load',
        () => {
          this.setState({
            src: reader.result,
          });

          let parent = this;          
          let image = new Image();
          image.src = reader.result;
          image.onload = function() {
            // cache raw image size here 
            parent.setState({
              origWidth: image.width,
              origHeight: image.height
            });
          };
        },
        false
      )
      reader.readAsDataURL(e.target.files[0]);
    }
  }

  getCroppedImg(image, pixelCrop) {
    let imgX = this.state.origWidth;
    let imgY = this.state.origHeight;

    // Print crops to canvas
    // const canvas = this.refs.canvas;
    // const ctx = this.refs.canvas.getContext('2d');
    const canvas = document.createElement('canvas');
    canvas.width = imgX;
    canvas.height = imgY;
    const ctx = canvas.getContext('2d');

    // ctx.drawImage(image, sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight) API: 
    // https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/drawImage
    ctx.drawImage(
      image,
      (pixelCrop.x/100)*imgX,
      (pixelCrop.y/100)*imgY,
      (pixelCrop.width/100)*imgX,
      (pixelCrop.height/100)*imgY,
      0,
      0,
      imgX,
      imgY
    );

    // As Base64 string
    const base64Image = canvas.toDataURL('image/jpeg');
    this.props.setCroppedImage(base64Image);
    // DEBUG: console.log("getCroppedImg (base64)", base64Image);
  }

  onCropComplete = crop => {
    // console.log('onCropComplete', crop);
  }

  onCropChange = crop => {
    this.setState({ crop });
  }

  nextPage = () => {
    if (this.state.tSlide !== this.state.slides.length - 1) {
      this.setState({
        tSlide: this.state.tSlide + 1
      });
    }
  }

  handleDelete = () => {
    this.setState({displayTutorial: false});
  }

  prevPage = () => {
    if (this.state.tSlide !== 0) {
      this.setState({
        tSlide: this.state.tSlide - 1
      });
    }
  }

  componentWillReceiveProps(nProps) {
      if (nProps.reset) {
        this.setState({mLabel: nProps.netName});
      }
  }

  render() {
    var tutorial;
    if (this.state.displayTutorial) {
      tutorial = <div id="tutorial-container" ref="tutorialCard">
                  <Card>
                    <CardHeader title="Tutorial" titleColor={indigo500} titleStyle={{fontWeight: 800}} style={{paddingBottom: 0, position: "absolute"}} />
                    <CardActions className="float-right">
                      <Button size="small" color="primary" onClick={this.handleDelete}>Dismiss</Button>
                    </CardActions><br/><br/>
                    <CardText style={{paddingTop: 10}}>
                      {this.state.slides[this.state.tSlide]}
                    </CardText>
                    <CardActions>
                      <FlatButton icon={<NavigationArrowBack />} onClick={this.prevPage} />
                      <FlatButton icon={<NavigationArrowForward />} onClick={this.nextPage}/>
                    </CardActions>
                  </Card>
                </div>;
    }

    return (
      <div className="box" id="options">
        <div id="select-container" style={{paddingBottom: "20px"}}>
          <h4 style={{marginBottom: "0px"}}>Select Image</h4>
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
          <div id="file-container">
            OR <h4 style={{marginTop: "15px", marginBottom: "5px"}}>Upload an Image </h4>
            <input style={{marginBottom: "0px"}} onChange={this.onSelectFile} type="file" id="files" name="files[]" multiple/>
          </div>

          {this.state.src && (
            <div> 
              <ReactCrop
                src={this.state.src}
                crop={this.state.crop}
                onImageLoaded={this.onImageLoaded}
                onComplete={this.onCropComplete}
                onChange={this.onCropChange}
                style={{marginTop: "6px", marginBottom: "4px"}}
              />
              <RaisedButton 
                label="Crop" 
                secondary={true} 
                onClick={this.onCropClicked}
              /> 
            </div>
          )}

        </div>
        <div id="brush-container">
          <h4 style={{marginTop: "10px"}}>Brush Size</h4>
          <div id="brush-slider-container" style={{paddingBottom: "0px"}}>
            <div id="slider-container">
              <Slider min={2} max={30} defaultValue={15} step={1} className='slider' onChange={this.props.brushChanged}/>
            </div>
            <div id="svg-container">
              <svg height="60px" width="60px">
                <circle cx="30" cy="30" fill={indigo500} r={this.props.brushSize}/>
              </svg>
            </div>
          </div>
        </div>
        <div id="model-container" style={{paddingTop: "15px"}}>
          <RaisedButton className="modelButton" label="SqueezeNet" secondary={true} onClick={this.props.reloadSQ}/> 
          <br />
          <RaisedButton className="modelButton" label="MobileNet" secondary={true} onClick={this.props.reloadMB}/>
          <h4 style={{marginTop: "10px", marginBottom: "5px"}}>Selected model: </h4>
          <TextField style={{width: "98%"}} value={this.state.mLabel} />
        </div>
        <div id="reset-button">
          <RaisedButton label="Reset" secondary={true} onClick={this.props.reset}/>
        </div>
        <br />
        {tutorial}
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
