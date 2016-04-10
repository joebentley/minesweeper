
var Square = function(bomb, visible) {
    if (typeof bomb == 'undefined') {
        bomb = false;
    }
    if (typeof visible == 'undefined') {
        visible = false;
    }
    
    return {
        visible: visible,
        bomb: bomb
    };
};

module.exports = Square;