import React from 'react';
import {Array3D} from 'deeplearn';
import {InpaintTelea} from './inpaint';

export function drawImage(ctx, src, callback) {
    var img = new Image(227, 227);
    img.src = src;

    img.onload = function () {
        ctx.clearRect(0, 0, 227, 227);
        ctx.drawImage(img, 0, 0);
        callback(img);
    }
}

export function predict(img, net, callback) {
    const pixels = Array3D.fromPixels(img);

    var t0 = performance.now();
    const res = net.predict(pixels);
    
    var top = [];
    net.getTopKClasses(res, 5).then((topK) => {
        console.log('Classification took ' + parseFloat(Math.round(performance.now() - t0)) + ' milliseconds');
        for (const key in topK) {
            top.push(<h4 key={key}>{topK[key].toFixed(5)}: {key}</h4>);
        }
        callback(top);
    });
}

export function inpaint(iCtx, dCtx, ) {
    var mask = dCtx.getImageData(0, 0, 227, 227);
    var img = iCtx.getImageData(0, 0, 227, 227);

    var mask_u8 = new Uint8Array(227 * 227);
    for(var n = 0; n < mask.data.length; n+=4){
        if (mask.data[n] > 0) {
            mask_u8[n/4] = 1;
        } else {
            mask_u8[n/4] = 0;
        }
    }

    for(var channel = 0; channel < 3; channel++){
        var img_u8 = new Uint8Array(227*227)
        for(n = 0; n < img.data.length; n+=4){
            img_u8[n / 4] = img.data[n + channel]
        }
        InpaintTelea(227, 227, img_u8, mask_u8)
        for(var i = 0; i < img_u8.length; i++){
            img.data[4 * i + channel] = img_u8[i]
        }	
    }
    for(i = 0; i < img_u8.length; i++){
        img.data[4 * i + 3] = 255;
    }
    dCtx.clearRect(0, 0, 227, 227);
    iCtx.putImageData(img, 0, 0);
    return img;
}

export default drawImage;