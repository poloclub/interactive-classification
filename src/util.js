import React from 'react';

import {TableRow, TableRowColumn} from 'material-ui';
import * as dl from 'deeplearn';
import {scaleSequential} from 'd3-scale';
import {rgb} from 'd3-color';
import {interpolateInferno} from 'd3-scale-chromatic'

import {InpaintTelea} from './inpaint';

const SCALE = scaleSequential(interpolateInferno).domain([0,1]);

export function drawImage(ctx, src, callback) {
    const img = new Image(227, 227);
    img.src = src;

    img.onload = function () {
        ctx.clearRect(0, 0, 227, 227);
        ctx.drawImage(img, 0, 0);
        callback(img);
    }
}

export function drawCAM(img, net, activation, canvas, id) {
    let cam = net.CAM(net.getLastWeights(), activation, id);
    cam = cam.dataSync();

    let buff = new Uint8ClampedArray(227*227*4);
    for (let y = 0; y < 227; y++) {
        for (let x = 0; x < 227; x++) {
            let pos = (y * 227 + x) * 4;
            let col = rgb(SCALE(cam[pos/4]));
            buff[pos] = col.r;
            buff[pos + 1] = col.g;
            buff[pos + 2] = col.b;
            buff[pos + 3] = .6 * 255;
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

export async function inpaint(iCtx, dCtx) {
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

    // Try to call resynthesizer, if not use Telea
    return fetch('http://ec2-54-152-210-53.compute-1.amazonaws.com/inpaint', {
        method: 'POST',
        mode: 'cors',
        headers: {
            'Accept': 'application/json',
        },
        body: JSON.stringify({
            "image": Array.from(img.data),
            "mask": Array.from(mask_u8)
        })
    }).then(res => res.json())
    .then(res => {
        const changedImg = new ImageData(Uint8ClampedArray.from(res), 227, 227);
        dCtx.clearRect(0, 0, 227, 227);
        iCtx.putImageData(changedImg, 0, 0);
        return changedImg;
    })
    .catch(err => {
        console.log("ERROR:", err, "using Telea");
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
    });
}


export function createRows(top, callback) {
    let rows = []
    let entries = top.entries();
    for (let i = 0; i < 5; i++) {
        let pair = entries.next().value;
        rows.push(<TableRow key={pair[0]}>
                        <TableRowColumn style={{wordWrap: 'break-word', whiteSpace: 'normal'}}>{pair[0]}</TableRowColumn>
                        <TableRowColumn style={{textAlign: 'right'}} className='right'> {pair[1]}</TableRowColumn>
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
            <TableRowColumn style={{wordWrap: 'break-word', whiteSpace: 'normal', paddingRight: 0}}>{pair[0]}</TableRowColumn>
            <TableRowColumn style={{textAlign: 'right'}}>{pair[1]}</TableRowColumn>
            <TableRowColumn style={{textAlign: 'right', color: color}}>{plus}{change.toFixed(2)}</TableRowColumn>
        </TableRow>);
    }
    return rows;
}

export default drawImage;