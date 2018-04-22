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