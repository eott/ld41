var Player = function(humanPlayer, i, k) {
    this.i = i
    this.k = k
    this.isHuman = humanPlayer

    this.img = new Image()
    this.img.scale = 0.5
    this.img.width = 48
    this.img.height = 110
    this.img.src = humanPlayer
        ? "assets/images/player_human.png"
        : "assets/images/player_ai.png"

    this.sync = 0.25

    this.lastBeat = 0
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

Player.prototype.update = function() {
    if (this.isHuman) {
        this.humanUpdate()
    } else {
        this.aiUpdate()
    }
}

Player.prototype.humanUpdate = function() {
    // check building placement
    if (game.input.keyWasPressed('space')) {
        var index = this.k * 24 + this.i
        if (
            game.hexes[index].corruption < game.scene.corruptionBreak1
            && this.sync >= game.scene.buildingCost
        ) {
            switch (game.hexes[index].buildingType) {
                case game.scene.getBuildingType("none"):
                    this.sync -= game.scene.buildingCost
                    game.hexes[index].setBuilding(game.scene.getBuildingType("human_tower"))
                    break;
                case game.scene.getBuildingType("human_tower"):
                    this.sync -= game.scene.buildingCost
                    game.hexes[index].setBuilding(game.scene.getBuildingType("human_power"))
                    break;
                case game.scene.getBuildingType("human_power"):
                    this.sync -= game.scene.buildingCost
                    game.hexes[index].setBuilding(game.scene.getBuildingType("human_thrower"))
                    break;
            }
        }
    }

    // check movement
    var dk = (game.input.keyWasPressed('w') || game.input.keyWasPressed('up')) ? -1 : 0
    dk += (game.input.keyWasPressed('s') || game.input.keyWasPressed('down')) ? 1 : 0
    var di = (game.input.keyWasPressed('a') || game.input.keyWasPressed('left')) ? -1 : 0
    di += (game.input.keyWasPressed('d') || game.input.keyWasPressed('right')) ? 1 : 0

    var newXPos = Math.min(23, Math.max(0, this.i + di))
    var newYPos = Math.min(15, Math.max(0, this.k + dk))

    // do movement
    if (newXPos != this.i || newYPos != this.k) {
        this.i = newXPos
        this.k = newYPos

        if (game.beatProximity < game.beatSlack) {
            this.sync += 0.05
            game.sfx.playSound("good")
        } else {
            this.sync -= 0.1
            game.sfx.playSound("bad")
            game.gui.doScreenShake()
        }
        this.sync = Math.min(1.0, Math.max(0, this.sync))
    }
}

Player.prototype.shuffle = function(array) {
    for (var i = array.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
}

Player.prototype.aiUpdate = function() {
    // the ai only has to do stuff once per beat
    if (game.beatCounter > this.lastBeat) {
        this.lastBeat = game.beatCounter
    } else {
        return
    }

    // if current tile is upgradeable, try to do so
    tile = game.hexes[this.k * 24 + this.i]
    if (this.sync >= game.scene.buildingCost && tile.faction == 2) {
        this.sync -= game.scene.buildingCost
        if (tile.buildingType == game.scene.getBuildingType("none")) {
            tile.setBuilding(game.scene.getBuildingType("ai_tower"))
        } else if (tile.buildingType == game.scene.getBuildingType("ai_tower")) {
            tile.setBuilding(game.scene.getBuildingType("ai_power"))
        } else if (tile.buildingType == game.scene.getBuildingType("ai_power")) {
            tile.setBuilding(game.scene.getBuildingType("ai_thrower"))
        }
    }

    // move around randomly in own territory
    var target = undefined
    var tile = game.hexes[this.k * 24 + this.i]
    var copy = tile.neighbors.slice()
    this.shuffle(copy)
    for (idx in copy) {
        tile = game.hexes[copy[idx][1] * 24 + copy[idx][0]]
        if (tile.faction == 2) {
            target = game.hexes[copy[idx][1] * 24 + copy[idx][0]]
        }
    }

    // go towards target or to lower right corner
    if (target) {
        this.sync += 0.05
        this.i = target.i
        this.k = target.k
    } else {
        this.sync += 0.05
        this.i = Math.max(0, Math.min(23, this.i + 1))
        this.k = Math.max(0, Math.min(15, this.k + 1))
    }
}

var Projectile = function(humanPlayer, sx, sy, ti, tk) {
    this.isHuman = humanPlayer

    this.x = sx
    this.y = sy
    this.tx = game.centerOfHex(ti, tk)[0]
    this.ty = game.centerOfHex(ti, tk)[1]
    this.ti = ti
    this.tk = tk

    this.vx = this.tx - sx
    this.vy = this.ty - sy
    var l = Math.sqrt(this.vx * this.vx + this.vy * this.vy)
    this.vx /= l
    this.vy /= l
    this.speed = 15.0
    this.damage = 20

    this.img = new Image()
    this.img.scale = 1.0
    this.img.width = 15
    this.img.height = 15
    this.img.src = humanPlayer
        ? "assets/images/particle_thrower_human.png"
        : "assets/images/particle_thrower_ai.png"
}

Projectile.prototype.update = function(ctx) {
    this.x += this.vx * this.speed
    this.y += this.vy * this.speed

    if (
        (this.tx - this.x) * (this.tx - this.x)
        + (this.ty - this.y) * (this.ty - this.y)
        < this.speed * this.speed
    ) {
        game.hexes[this.tk * 24 + this.ti].corruption +=
            this.isHuman ? -this.damage : this.damage
        return false
    } else {
        return this
    }
}

Projectile.prototype.draw = function(ctx) {
    ctx.drawImage(
        this.img,
        this.x - 0.5 * this.img.width * this.img.scale,
        this.y - 0.5 * this.img.height * this.img.scale,
        this.img.width * this.img.scale,
        this.img.height * this.img.scale
    )
}