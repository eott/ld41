var SFX = function() {
    this.nameAudioMap = {}
    this.loadSounds()
}

SFX.prototype.loadSounds = function() {
    this.nameAudioMap["baseLine"] = new Audio("assets/audio/base_line.wav");
    this.nameAudioMap["good"] = new Audio("assets/audio/good.wav");
    this.nameAudioMap["bad"] = new Audio("assets/audio/bad.wav");
}

SFX.prototype.playSound = function(name) {
    if (this.nameAudioMap[name]) {
        this.nameAudioMap[name].play();
    }
}

SFX.prototype.stopSound = function(name) {
    if (this.nameAudioMap[name] && !initState) {
        this.nameAudioMap[name].pause();
        this.nameAudioMap[name].currentTime = 0;
    }
}

SFX.prototype.resetSound = function(name) {
    if (this.nameAudioMap[name]) {
        this.nameAudioMap[name].currentTime = 0;
        this.nameAudioMap[name].play();
    }
}