var $ = require('jquery');

var UI = require('./lib/ui');
var Grid = require('./lib/grid');

$(function() {
    var canvas = document.getElementById('myCanvas');
    var ctx = canvas.getContext('2d');
    
    var ui = new UI(canvas, new Grid.randomGrid(16, 16, 20));
    
    setInterval(ui.draw.bind(ui, ctx), 10);
    
    $('#myCanvas').on('mousedown', ui.onMouseDown.bind(ui));
});