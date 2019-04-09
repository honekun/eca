'use strict';

//TODO: 'regla' random checkbox, invertir slider 'tamaño' y 'velocidad'

import eca from './js/eca';
import './scss/canvas.scss';

let canvas = document.getElementById('canvas');
let startBtn = document.getElementById('start');
let stopBtn = document.getElementById('stop');
let restartBtn = document.getElementById('restart');
let ruleInp = document.getElementById('rule');
let speedInp = document.getElementById('speed');
let sizeInp = document.getElementById('size');

let options = {
    width: 800,
    height: 800,
    rule: ruleInp.value,
    size: 80,
    speed: speedInp.value
};
let controls = {
    start: startBtn,
    stop: stopBtn,
    restart: restartBtn,
    rule: ruleInp,
    speed: speedInp,
    size: sizeInp
};

eca.setup(canvas, options, controls);
