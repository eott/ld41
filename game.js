// Game and meta globals
var can = document.getElementById("screen"); // The canvas element
var ctx = can.getContext("2d"); // The 2D draw context

var sp3 = 0.86602540378 // Number is sin(PI/3)
var a = 20
var b = 0.8 * a * Math.sin(2 * 3.1415926 / 3)
var c = Math.sqrt(a * a - b * b)

var Hex = function(x, y) {
    this.x = x
    this.y = y
    this.value = 127

    this.nodes = [
        [x + 0.5 * a + c, y],
        [x + c, y - b],
        [x - c, y - b],
        [x - 0.5 * a - c, y],
        [x - c, y + b],
        [x + c, y + b]
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

    for (var i = 0; i < 25; i++) {
        for (var k = 0; k < 20; k++) {
            if (i % 2 == 0) {
                var x_offset = a + c
                var y_offset = b + c
            } else {
                var x_offset = a + c
                var y_offset = 2 * b + c
            }
            hexes.push(new Hex(x_offset + i * (a + 1.3 * c), y_offset + k * 2 * b))
        }
    }

    for (idx in hexes) {
        hexes[idx].draw(ctx)
    }
}

//window.setInterval('gameLoop()', 1000);
gameLoop()