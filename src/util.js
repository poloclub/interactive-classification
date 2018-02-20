import React from 'react';
import {Array3D} from 'deeplearn';
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
    const pixels = Array3D.fromPixels(img);
    //var math = ENV.math;

    const t0 = performance.now();
    const resAll = net.predictWithActivation(pixels, 'conv10');
    // WIP for class activation mapping
    /*
    var im = math.slice3D(resAll.activation, [0,0,0], [13, 13, 1]).as2D(13, 13);
    im.data().then((d) => {
        var imgArr = Int16Array.from(d);
        var max = Math.max.apply(Math, imgArr);
        var min = Math.min.apply(Math, imgArr);
        var normed = imgArr.map(function(d) {
            return ((d - min)/max) * 225;
        })
        console.log(normed);
    });
    */
    const res = resAll.logits;
    
    const top = [];
    if (classes == null) {
        net.getTopKClasses(res, 5).then((topK) => {
            console.log('Classification took ' + parseFloat(Math.round(performance.now() - t0)) + ' milliseconds');
            for (let key in topK) {
                top.push([key, (topK[key]*100.0).toFixed(2)]);
            }
            callback(top);
        });
    } else {
        net.getTopKClasses(res, 1000).then((topK) => {
            console.log('Classification took ' + parseFloat(Math.round(performance.now() - t0)) + ' milliseconds');
            for (let i = 0; i < 5; i++) {
                top.push([classes[i], (topK[classes[i]]*100.0).toFixed(2)]);
            }
            callback(top);
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
    top.forEach((key) => {
        rows.push(<TableRow key={key[0]}>
            <TableRowColumn style={{wordWrap: 'break-word', whiteSpace: 'normal'}}>{key[0]}</TableRowColumn>
            <TableRowColumn>{key[1]}%</TableRowColumn>
        </TableRow>);
    });
    return rows;
}

export function createCompRows(top, topK) {
    let rows = []
    top.forEach((key, i) => {
        let change = 0
        if(topK != null) {
            change = parseFloat(key[1]) - parseFloat(topK[i][1]);
        } 
        let color = 'black';
        if (change < 0) {
            color = 'red'; 
        } else if (change > 0) {
            color = 'green';
        }

        rows.push(<TableRow key={key[0]}>
            <TableRowColumn style={{wordWrap: 'break-word', whiteSpace: 'normal'}}>{key[0]}</TableRowColumn>
            <TableRowColumn>{key[1]}%</TableRowColumn>
            <TableRowColumn style={{color: color}}>{change.toFixed(2)}%</TableRowColumn>
        </TableRow>);
    });
    return rows;
}

export default drawImage;