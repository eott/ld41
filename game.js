var Hex = function(i, k, x, y) {
    this.i = i
    this.k = k
    this.x = x
    this.y = y

    this.nodes = [
        [x + 0.5 * a + c, y],
        [x + c, y - b],
        [x - c, y - b],
        [x - 0.5 * a - c, y],
        [x - c, y + b],
        [x + c, y + b]
    ]

    if ((i == 0 && k <= 1) || (i == 1 && k == 0)) {
        this.corruption = 0
        this.buildingType = 1
    } else if ((i == 22 && k == 15) || (i == 23 && k >= 14)) {
        this.corruption = 255
        this.buildingType = 2
    } else {
        this.corruption = 127
        this.buildingType = 0
    }

    this.neighbors = []
    if (i > 0) this.neighbors.push([i - 1, k])
    if (i < 23) this.neighbors.push([i + 1, k])
    if (k > 0) this.neighbors.push([i, k - 1])
    if (k < 15) this.neighbors.push([i, k + 1])
    if (i % 2 == 1) {
        if (k < 15 && i > 0) this.neighbors.push([i - 1, k + 1])
        if (k < 15 && i < 23) this.neighbors.push([i + 1, k + 1])
    } else {
        if (k > 0 && i > 0) this.neighbors.push([i - 1, k - 1])
        if (k > 0 && i < 23) this.neighbors.push([i + 1, k - 1])
    }
}

Hex.prototype.draw = function(ctx) {
    ctx.fillStyle = this.fillColor()
    ctx.strokeStyle = this.strokeColor()
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

Hex.prototype.fillColor = function() {
    return 'rgba(' + Math.round(this.corruption) + ', ' + (255 - Math.round(this.corruption)) + ', 0, 1)'
}

Hex.prototype.strokeColor = function() {
    if (this.corruption < 80) {
        return '#33bb33'
    } else if (this.corruption < 174) {
        return '#000000'
    } else {
        return '#bb3333'
    }
}

Hex.prototype.preUpdate = function() {
    if (this.buildingType == 0) {
        difference = 0
        for (idx in this.neighbors) {
            var i = this.neighbors[idx][0]
            var k = this.neighbors[idx][1]
            difference += game.hexes[k * 24 + i].corruption - this.corruption
        }
        difference = difference * 30 / this.neighbors.length / 255
        this.newCorruption = this.corruption + difference
    }
}

Hex.prototype.postUpdate = function() {
    if (this.buildingType == 0) {
        this.corruption = this.newCorruption
    }
}

var Player = function(humanPlayer, i, k) {
    this.i = i
    this.k = k
    this.img = new Image()
    this.img.scale = 0.5
    this.img.width = 48
    this.img.height = 110
    this.img.src = humanPlayer ? "player_human.png" : "player_ai.png"
}

Player.prototype.draw = function(ctx) {
    coords = game.centerOfHex(this.i, this.k)
    ctx.drawImage(
        this.img,
        coords[0] - 0.5 * this.img.width * this.img.scale,
        coords[1] - this.img.height * this.img.scale,
        this.img.width * this.img.scale,
        this.img.height * this.img.scale
    )
}

var GameApp = function(can, ctx) {
    this.can = can
    this.ctx = ctx
    this.isInitialized = false
    this.hexes = []
    this.human = new Player(true, 0, 1)
    this.ai = new Player(false, 23, 14)
}

GameApp.prototype.centerOfHex = function(i, k) {
    if (i % 2 == 0) {
        var x_offset = a + c
        var y_offset = b + c
    } else {
        var x_offset = a + c
        var y_offset = 2 * b + c
    }
    // @TODO figure out why 1.3 is necessary and what's the precise number
    return [x_offset + i * (a + 1.3 * c), y_offset + k * 2 * b]
}

GameApp.prototype.init = function() {
    for (var k = 0; k < 16; k++) {
        for (var i = 0; i < 24; i++) {
            var coords = this.centerOfHex(i, k)
            this.hexes.push(new Hex(i, k, coords[0], coords[1]))
        }
    }

    this.isInitialized = true
}

GameApp.prototype.gameLoop = function() {
    this.ctx.clearRect(0, 0, can.width, can.height)

    if (!game.isInitialized) {
        game.init()
    }

    for (idx in game.hexes) {
        game.hexes[idx].preUpdate()
    }

    for (idx in game.hexes) {
        game.hexes[idx].postUpdate()
        game.hexes[idx].draw(this.ctx)
    }

    this.human.draw(this.ctx)
    this.ai.draw(this.ctx)
}

var can = document.getElementById("screen"); // The canvas element
var ctx = can.getContext("2d"); // The 2D draw context

var sp3 = 0.86602540378 // Number is sin(PI/3)
var a = 20
var b = 0.8 * a * Math.sin(2 * 3.1415926 / 3)
var c = Math.sqrt(a * a - b * b)

var game = new GameApp(can, ctx)
window.setInterval('game.gameLoop()', 40);