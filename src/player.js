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
        this.humanUpate()
    } else {
        this.aiUpdate()
    }
}

Player.prototype.humanUpate = function() {
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
        } else {
            this.sync -= 0.1
        }
        this.sync = Math.min(1.0, Math.max(0, this.sync))
    }
}

Player.prototype.aiUpdate = function() {

}