var $ = require('jquery');

var UI = require('./lib/ui');
var Grid = require('./lib/grid');

$(function() {
    var canvas = document.getElementById('myCanvas');
    var ctx = canvas.getContext('2d');
    
    var ui = new UI(canvas);
    
    setInterval(ui.draw.bind(ui, ctx), 10);
    
    $('#myCanvas').on('mousedown', ui.onMouseDown.bind(ui));
    $('#myCanvas').on('mouseup', ui.onMouseUp.bind(ui));
});