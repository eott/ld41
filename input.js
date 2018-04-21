Input = function() {
    // w a s d space left right up down
    this.keyStatus = [0, 0, 0, 0, 0, 0, 0, 0, 0]

    this.registerListeners()
}

Input.prototype.keyEvent = function(type, key) {
    // w = 87, a = 65, s = 83, d = 68, space = 32
    // left = 37, right= 39, up = 38, down = 40
    var index = [87, 65, 83, 68, 32, 37, 39, 38, 40].indexOf(key)
    
    if (index == -1) {
        return
    }

    this.keyStatus[index] = type

    if (this.keyStatus[index] == 0 && type == 1) {
        this.keyStatus[index] = 1
    } else if (this.keyStatus[index] > 0 && type == 0) {
        this.keyStatus[index] = 0
    }
}

Input.prototype.registerListeners = function() {
    window.addEventListener("keydown", function(e) {this.keyEvent(1, e.keyCode);}, false)
    window.addEventListener("keyup", function(e) {this.keyEvent(0, e.keyCode);}, false)
}