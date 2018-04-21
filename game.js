// Game and meta globals
var can = document.getElementById("screen"); // The canvas element
var ctx = can.getContext("2d"); // The 2D draw context
var sp3 = 0.86602540378 // Number is sin(PI/3)

var a = 20
var b = 2 * a * sp3 * 0.7
var c = a * (1 - sp3)

var Hex = function(x, y, size) {
    this.x = x
    this.y = y
    this.size = size
    this.value = 127

    var b = sp3 * size
    var a = Math.sqrt(size * size - b * b)
    b = b * 0.7

    this.nodes = [
        [x - a, y - b],
        [x + a, y - b],
        [x + size, y],
        [x + a, y + b],
        [x - a, y + b],
        [x - size, y]
    ]
}

Hex.prototype.draw = function(ctx) {
    ctx.fillStyle = this.color()
    ctx.strokeStyle = '#000000'
    ctx.beginPath()
    ctx.moveTo(this.nodes[0][0], this.nodes[0][1])
    ctx.lineTo(this.nodes[1][0], this.nodes[1][1])
    ctx.lineTo(this.nodes[2][0], this.nodes[2][1])
    ctx.lineTo(this.nodes[3][0], this.nodes[3][1])
    ctx.lineTo(this.nodes[4][0], this.nodes[4][1])
    ctx.lineTo(this.nodes[5][0], this.nodes[5][1])
    ctx.closePath()
    ctx.fill()
    ctx.stroke()
}

Hex.prototype.color = function() {
    return 'rgba(' + this.value + ', ' + (255 - this.value) + ', 0, 1)'
}

function gameLoop() {
    hexes = []
    ctx.clearRect(0, 0, can.width, can.height)

    for (var i = 0; i < 20; i++) {
        for (var k = 0; k < 40; k++) {
            if (k % 2 == 0) {
                var offset = size
            } else {
                var offset = size * 2.5
            }
            hexes.push(new Hex(offset + i * 3 * size, size + 0.7 * k * sp3 * size, size))
        }
    }

    for (idx in hexes) {
        hexes[idx].draw(ctx)
    }
}

//window.setInterval('gameLoop()', 1000);
gameLoop()