
const Display = function(canvas, options) {
    options = options || {};
    this.buffer  = document.createElement('canvas').getContext('2d'),
    this.context = canvas.getContext('2d');
    this.canvas = canvas;
    this.fullsize = options.fullsize || false;
    this.width = Math.floor(this.canvas.clientWidth);
    this.height = Math.floor(this.canvas.clientHeight);
    this.ratio = 1; 
    
    this.renderColor = function(color) {
        this.buffer.fillStyle = color;
        this.buffer.fillRect(0, 0, this.buffer.canvas.width, this.buffer.canvas.height);
    };

    this.render = () => { 
        this.context.drawImage(
            this.buffer.canvas, 
            0, 
            0, 
            this.buffer.canvas.width, 
            this.buffer.canvas.height, 
            0, 
            0, 
            this.context.canvas.width, 
            this.context.canvas.height
        );
    };

    this.resizeFullsize = () => {
        this.width = Math.floor(this.canvas.clientWidth);
        this.height = Math.floor(this.canvas.clientHeight);
        this.buffer.canvas.width = this.width;
        this.buffer.canvas.height = this.height;
        this.context.canvas.width = this.width;
        this.context.canvas.height = this.height;
        this.canvas.width = this.width;
        this.canvas.height = this.height;

        this.render();
    };

    this.resize = function() { 
        this.width = Math.floor(this.canvas.clientWidth);
        this.height = Math.floor(this.canvas.clientHeight);
        if (this.height / this.width > this.ratio) {
    
            this.context.canvas.height = this.width * this.ratio;
            this.context.canvas.width = this.width;

            this.buffer.canvas.height = this.width * this.ratio;
            this.buffer.canvas.width = this.width;

            this.canvas.width = this.width;
            this.canvas.height = this.height;
        } else {
            this.buffer.canvas.height = this.height;
            this.buffer.canvas.width = this.height / this.ratio;

            this.buffer.canvas.height = this.height;
            this.buffer.canvas.width = this.height / this.ratio;

            this.canvas.width = this.width;
            this.canvas.height = this.height;
        }
    };
  
    this.handleResize = (event) => {
        if(this.fullsize) {
            return this.resizeFullsize(event);
        }
        this.resize(event);
    };
};

Display.prototype = {
    constructor : Display
};

export default Display;