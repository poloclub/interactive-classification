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

export function predict(img, net, classes, callback) {
    const pixels = dl.fromPixels(img);
    const resized = dl.image.resizeBilinear(pixels, [227, 227]);

    const t0 = performance.now();
    const resAll = net.predictWithActivation(resized, 'conv10');
    console.log('Classification took ' + parseFloat(Math.round(performance.now() - t0)) + ' milliseconds');

    const res = resAll.logits;
    
    const map = new Map();
    if (classes == null) {
        net.getTopKClasses(res, 1000).then((topK) => {
            for (let key in topK) {
                map.set(key, (topK[key]*100.0).toFixed(2));
            }
            callback(map);
        });
    } else {
        net.getTopKClasses(res, 1000).then((topK) => {
            for (let i = 0; i < 5; i++) {
                map.set(classes[i], (topK[classes[i]]*100.0).toFixed(2));
            }
            callback(map);
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


export function createRows(top) {
    let rows = []
    let entries = top.entries();
    for (let i = 0; i < 5; i++) {
        let pair = entries.next().value;
        rows.push(<TableRow key={pair[0]}>
            <TableRowColumn style={{wordWrap: 'break-word', whiteSpace: 'normal'}}>{pair[0]}</TableRowColumn>
            <TableRowColumn>{pair[1]}%</TableRowColumn>
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
        if (change < 0) {
            color = 'red'; 
        } else if (change > 0) {
            color = 'green';
        }

        rows.push(<TableRow key={pair[0]}>
            <TableRowColumn style={{wordWrap: 'break-word', whiteSpace: 'normal'}}>{pair[0]}</TableRowColumn>
            <TableRowColumn>{pair[1]}%</TableRowColumn>
            <TableRowColumn style={{color: color}}>{change.toFixed(2)}%</TableRowColumn>
        </TableRow>);
    }
    return rows;
}

export default drawImage;