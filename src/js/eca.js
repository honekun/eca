import hkc from './hkc';

export default (function () {
    let display,
        engine,
        offsetXR = 2, offsetYR = 2;
    
    const eca = {
        automatonSize: 0,
        automatonSpeed :0,
        generation: 0,
        rule: 0,
        last: null,
        history: []
    };

    const setup = (_canvas, options, controls) => {
        options = options || {};
        setSpeed(options.speed);
        setSize(options.size);
        setRule(options.rule);
        setupControls(controls);
        initECA();
        let last_time_stamp = 0;
        let acc = 0;

        const render = () => {       
            clearCanvas();
            drawHistory(eca.history);
            display.render();
        };
        
        const update = (time_stamp) => {
            acc += time_stamp - last_time_stamp;
            let cellS = Math.floor((display.width - offsetXR - offsetXR) / eca.automatonSize);
            let historyS = Math.ceil((display.height - offsetYR - offsetYR) / cellS);
            while(eca.history.length >= historyS ) eca.history.shift();
            if(acc > eca.automatonSpeed ){
                eca.last = eca.current.slice(0);
                eca.current = evolve(eca.rule, eca.current);
                eca.history.push(eca.current);
                eca.generation++;
                acc = 0;
            }
            last_time_stamp = time_stamp;
        };

        const clearCanvas = () => {
            display.buffer.beginPath();
            display.buffer.strokeStyle = '#000';
            display.buffer.fillStyle = '#fff';
            display.buffer.lineWidth = '1';
            display.buffer.rect(0, 0, display.width, display.height);
            display.buffer.closePath();
            display.buffer.fill();
            display.buffer.stroke();
        };
    
        const drawHistory = (history) => {
            if (history.length === 0) return;
            let cellS = Math.floor((display.width - offsetXR - offsetXR ) / history[0].length),
                cellSR = cellS - 1;
            for(let h = 0; h < history.length; h++) {
                let cell = history[h],
                    cellY = (cellS * h) + offsetYR;
                for(let c = 0; c < cell.length; c++){
                    let cellX = Math.floor((cellS * c) + offsetXR + ((display.width - (cellS * cell.length))/2));
                    if(cell[c]) { //live cell    
                        display.buffer.fillStyle = h === history.length - 1 ? 'red' : 'black';
                        display.buffer.fillRect(cellX, cellY, cellSR, cellSR);
                    }
                }
            }
        };

        const displayOptions = {
            width: options.width || 250,
            height: options.height || 250

        };
        display = new hkc.Display(_canvas, displayOptions);
        engine = new hkc.Engine(1000 / 30, render, update);

        window.addEventListener('resize', display.handleResize);
        display.handleResize();
    };

    const initArray = (size)  =>
    {
        let current = [];
        for(let s = 0; s < size; s++)
        {
            if(s === Math.floor(size/2)) 
            {
                current.push(1);
                continue;
            }
            current.push(0);                
        }
        return current;
    };

    const evolve = (rule, generation) => {
        let newGeneration = [];
        let ruleBinary = rule.toString(2).padStart(8,0).split('').reverse().join('');
        for(let c = 0; c < generation.length; c++) {
            let nbL = (c === 0) ? generation[generation.length - 1] : generation[c - 1],
                cell = generation[c],
                nbR = (c === generation.length - 1) ? generation[0] : generation[c + 1];
            let bitN = parseInt( nbL + '' + cell + '' + nbR, 2);
            newGeneration.push(parseInt(ruleBinary[bitN]));
        }
        return newGeneration;
    };

    const initECA = () => {
        eca.history = [];
        eca.current = initArray(eca.automatonSize);     
        eca.history.push(eca.current);
    };

    const setupControls = (controls) => {
        if(controls.start && controls.stop){
            controls.start.addEventListener('click', () => {
                engine.start();
                controls.start.disabled = true;
                controls.stop.disabled = false;
                controls.size.disabled = true;
            });
        }
        if(controls.start && controls.stop){
            controls.stop.disabled = true;
            controls.stop.addEventListener('click', () => {
                engine.stop();
                controls.stop.disabled = true;
                controls.start.disabled = false;
                controls.size.disabled = false;
            });
        }
        if(controls.restart){
            controls.restart.addEventListener('click', () => {
                engine.stop();
                controls.stop.disabled = false;
                controls.start.disabled = true;
                controls.size.disabled = true;
                
                if(controls.speed) setSpeed(controls.speed.value);
                if(controls.size) setSize(controls.size.value);
                if(controls.rule) setRule(controls.rule.value);
                initECA();
                engine.start();
                
            });
        }
        if(controls.rule){
            controls.rule.addEventListener('change', (e) => setRule(e.target.value) );
        }
        if(controls.speed){
            controls.speed.addEventListener('input', (e) => {
                let speed = e.target.value;
                speed = Math.floor(hkc.scale(speed, 1, 100, 2000, 10));
                setSpeed(speed);
            });
        }
        if(controls.size){
            controls.size.addEventListener('input', (e) => {
                let size = e.target.value;
                setSize(size);
                controls.start.disabled = true;
            });
        }
    };

    const setRule = (rule) => {
        rule = parseInt(rule) || 1;
        rule = rule > 255 ? 255 : rule;
        rule = rule < 0 ? 0 : rule;
        eca.rule = rule;
        eca.ruleBinary = rule.toString(2).padStart(8,0).split('').reverse().join('');
    };

    const setSize = (size) => {
        let minSize = 3;
        size = parseInt(size) || 31;
        size += size % 2 ? 0 : 1;
        eca.automatonSize = size < minSize ? minSize : size;
    };

    const setSpeed = (speed) => {
        let minSpeed = 10;
        speed = parseInt(speed) || minSpeed;
        eca.automatonSpeed = speed < minSpeed ? minSpeed : speed;
    };

    return {
        setup,
        eca
    };
})();
