import Controller from './Controller';
import Display from './Display';
import Game from './Game';
import Engine from './Engine';

//string padStart pollyfill
if (!String.prototype.padStart) {
    String.prototype.padStart = function padStart(targetLength, padString) {
        targetLength = targetLength >> 0; //truncate if number, or convert non-number to 0;
        padString = String(typeof padString !== 'undefined' ? padString : ' ');
        if (this.length >= targetLength) {
            return String(this);
        } else {
            targetLength = targetLength - this.length;
            if (targetLength > padString.length) {
                padString += padString.repeat(targetLength / padString.length); //append to original to ensure we are longer than needed
            }
            return padString.slice(0, targetLength) + String(this);
        }
    };
}

function scale (num, in_min, in_max, out_min, out_max) {
    return (num - in_min) * (out_max - out_min) / (in_max - in_min) + out_min;
}

function random (min,max) {
    min = min || 0;
    max = max || 1;
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;  
}

function make2DArray(cols, rows) {
    let arr = new Array(cols);
    for (let i = 0; i < arr.length; i++) {
        arr[i] = new Array(rows);
    }
    return arr;
}

function distanceV2(v1, v2) {
    if(v1 === undefined || v2 === undefined) throw new Error('falta vector');

    let p2 = Math.pow(v1.x - v2.x, 2) + Math.pow(v1.y - v2.y, 2);

    return Math.sqrt(p2);
}

function distanceV2fast(v1, v2) {
    if(v1 === undefined || v2 === undefined) throw new Error('falta vector');

    let p2 = Math.pow(v1.x - v2.x, 2) + Math.pow(v1.y - v2.y, 2);

    return p2;
}

export default {
    Controller: Controller,
    Display: Display,
    Game: Game,
    Engine: Engine,
    random: random,
    distanceV2: distanceV2,
    distanceV2fast: distanceV2fast,
    make2DArray: make2DArray,
    scale:scale
};
