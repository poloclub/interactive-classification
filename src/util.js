import React from 'react';
import * as dl from 'deeplearn';
import {InpaintTelea} from './inpaint';
import {TableRow, TableRowColumn} from 'material-ui';

export function drawImage(ctx, src, callback) {
    const img = new Image(227, 227);
    img.src = src;

    img.onload = function () {
        ctx.clearRect(0, 0, 227, 227);
        ctx.drawImage(img, 0, 0);
        callback(img);
    }
}

/**
 * Source: https://gist.github.com/mjackson/5311256
 * Converts an HSL color value to RGB. Conversion formula
 * adapted from http://en.wikipedia.org/wiki/HSL_color_space.
 * Assumes h, s, and l are contained in the set [0, 1] and
 * returns r, g, and b in the set [0, 255].
 *
 * @param   Number  h       The hue
 * @param   Number  s       The saturation
 * @param   Number  l       The lightness
 * @return  Array           The RGB representation
 */
function hslToRgb(h, s, l) {
    var r, g, b;
  
    if (s === 0) {
      r = g = b = l; // achromatic
    } else {
      function hue2rgb(p, q, t) {
        if (t < 0) t += 1;
        if (t > 1) t -= 1;
        if (t < 1/6) return p + (q - p) * 6 * t;
        if (t < 1/2) return q;
        if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
        return p;
      }
  
      var q = l < 0.5 ? l * (1 + s) : l + s - l * s;
      var p = 2 * l - q;
  
      r = hue2rgb(p, q, h + 1/3);
      g = hue2rgb(p, q, h);
      b = hue2rgb(p, q, h - 1/3);
    }
  
    return [ r * 255, g * 255, b * 255 ];
  }

export function drawCAM(img, net, activation, canvas, id) {
    const weights = net.getLastWeights();
    let cam = net.CAM(weights, activation, id);

    cam = cam.dataSync();
    console.log(cam);
    let buff = new Uint8ClampedArray(227*227*4);
    for (let y = 0; y < 227; y++) {
    for (let x = 0; x < 227; x++) {
        let pos = (y * 227 + x) * 4;
        let h = hslToRgb(1.0 - cam[pos/4], 1, .5)
        buff[pos] = h[0];
        buff[pos + 1] = h[1];
        buff[pos + 2] = h[2];
        buff[pos + 3] = .4 * 255;
    }
    }

    const ctx = canvas.getContext('2d');
    let iData = ctx.createImageData(227, 227);
    iData.data.set(buff);
    ctx.putImageData(iData, 0, 0);
}

export function predict(img, net, classes, callback) {
    const pixels = dl.fromPixels(img);
    const resized = dl.image.resizeBilinear(pixels, [227, 227]);

    const t0 = performance.now();
    const resAll = net.predictWithActivation(resized, 'fire9');
    console.log('Classification took ' + parseFloat(Math.round(performance.now() - t0)) + ' milliseconds');

    const res = resAll.logits;
    
    const map = new Map();
    if (classes == null) {
        net.getTopKClasses(res, 1000).then((topK) => {
            for (let key in topK) {
                map.set(key, (topK[key]*100.0).toFixed(2));
            }
            callback(map, resAll.activation);
        });
    } else {
        net.getTopKClasses(res, 1000).then((topK) => {
            for (let i = 0; i < 5; i++) {
                map.set(classes[i], (topK[classes[i]]*100.0).toFixed(2));
            }
            callback(map, resAll.activation);
        });
    }
}

export function inpaint(iCtx, dCtx, ) {
    const mask = dCtx.getImageData(0, 0, 227, 227);
    const img = iCtx.getImageData(0, 0, 227, 227);

    const mask_u8 = new Uint8Array(227 * 227);
    for(let n = 0; n < mask.data.length; n+=4){
        if (mask.data[n] > 0) {
            mask_u8[n/4] = 1;
        } else {
            mask_u8[n/4] = 0;
        }
    }

    for(let channel = 0; channel < 3; channel++){
        const img_u8 = new Uint8Array(227*227)
        for(let n = 0; n < img.data.length; n+=4){
            img_u8[n / 4] = img.data[n + channel]
        }
        InpaintTelea(227, 227, img_u8, mask_u8)
        for(let i = 0; i < img_u8.length; i++){
            img.data[4 * i + channel] = img_u8[i]
        }	
    }
    for(let i = 0; i < mask_u8.length; i++){
        img.data[4 * i + 3] = 255;
    }
    dCtx.clearRect(0, 0, 227, 227);
    iCtx.putImageData(img, 0, 0);
    return img;
}


export function createRows(top, callback) {
    let rows = []
    let entries = top.entries();
    for (let i = 0; i < 5; i++) {
        let pair = entries.next().value;
        rows.push(<TableRow key={pair[0]}>
                        <TableRowColumn style={{wordWrap: 'break-word', whiteSpace: 'normal'}}>{pair[0]}</TableRowColumn>
                        <TableRowColumn style={{textAlign: 'right'}} className='right'> {pair[1]}%</TableRowColumn>
                    </TableRow>);

    }
    return rows;
}

export function createCompRows(top, originalTop) {
    let rows = []
    let entries = top.entries();

    for (let i = 0; i < 5; i++) {
        let pair = entries.next().value;

        let change = 0
        if(originalTop != null) {
            change = parseFloat(pair[1]) - parseFloat(originalTop.get(pair[0]));
        } 

        let color = 'black';
        let plus = '';
        if (change < 0) {
            color = 'red'; 
        } else if (change > 0) {
            color = 'green';
            plus = '+';
        }

        rows.push(<TableRow key={pair[0]}>
            <TableRowColumn style={{wordWrap: 'break-word', whiteSpace: 'normal'}}>{pair[0]}</TableRowColumn>
            <TableRowColumn style={{textAlign: 'right'}}>{pair[1]}%</TableRowColumn>
            <TableRowColumn style={{textAlign: 'right', color: color}}>{plus}{change.toFixed(2)}%</TableRowColumn>
        </TableRow>);
    }
    return rows;
}

export default drawImage;