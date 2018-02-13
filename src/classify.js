import React from 'react';
import {Array3D} from 'deeplearn';

export function drawAndPredict(ctx, src, net, callback){
    var img = new Image(227, 227);
    img.src = src;

    var top = []
    img.onload = function () {
        ctx.clearRect(0, 0, 227, 227);
        ctx.drawImage(img, 0, 0);

        const pixels = Array3D.fromPixels(img);

        var t0 = performance.now();
        const res = net.predict(pixels);
        
        net.getTopKClasses(res, 5).then((topK) => {
            console.log('Classification took ' + parseFloat(Math.round(performance.now() - t0)) + ' milliseconds');
            for (const key in topK) {
                top.push(<h4 key={key}>{topK[key].toFixed(5)}: {key}</h4>);
            }
            callback(top);
        });
    }
}

export default drawAndPredict;