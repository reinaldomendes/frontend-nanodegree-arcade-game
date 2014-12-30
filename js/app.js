var Colision = function(){
    
}
Colision.prototype.getArea = function(){            
    var resource = Resources.get(this.sprite);    
    this.area = {
        x : this.x - resource.width / 8,
        y : this.y - resource.height / 8,
        width: resource.width,
        height:resource.height,
        x2 : this.x + resource.width / 8,
        y2 : this.y + resource.height / 8
    }
    
    return this.area;
}
Colision.prototype.colide = function(colisable){
    var thisArea = this.getArea();
    var colideArea = colisable.getArea();    
    if(thisArea.x2 > colideArea.x && 
        thisArea.x < colideArea.x2 //colide in yAxis
        && //colide in xAxis
        thisArea.y2 > colideArea.y &&
        thisArea.y < colideArea.y2
        ){ 
        return true;
    }
    return false;
}
// Enemies our player must avoid
var Enemy = function(x,y,offsetX,offsetY) {
    // Variables applied to each of our instances go here,
    // we've provided one for you to get started    
    // The image/sprite for our enemies, this uses
    // a helper we've provided to easily load images
    this.sprite = 'images/enemy-bug.png';
    
    //enemy position and StartPosition on restart game
    this.x = this.enemyStartX = x;
    this.y = this.enemyStartY = y;
    this.offsetX = offsetX;
    this.offsetY = offsetY;
    
    this.randomizeMaxXPosition();
    this.randomizeYPosition();
    
    
}
Enemy.prototype = Object.create(Colision.prototype);
Enemy.prototype.construtor = Enemy;
Enemy.prototype.randomizeMaxXPosition = function(){
    var rand = Math.random() + 1 ;    
    this.maxPosition = (400 * rand);    
}
Enemy.prototype.randomizeYPosition = function(){
    
    var rand = (Math.floor(Math.random() * 100) % 3) + 1;        
    this.y = this.offsetY * rand ;
}
// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function(dt) {
    // You should multiply any movement by the dt parameter
    // which will ensure the game runs at the same speed for
    // all computers.
    this.x = Math.max(this.x + this.offsetX * 2 * dt) % this.maxPosition ;
    if(this.x <= 100){
        this.randomizeMaxXPosition();
    }
    if(this.x > 500){
        this.randomizeYPosition();
    }
    //check colision
    if(this.colide(player)){
        player.construtor.call(player)
    }
    
}



// Draw the enemy on the screen, required method for game
Enemy.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
}


// Now write your own player class
// This class requires an update(), render() and
// a handleInput() method.
var Player = function(){
    //player position and player start position on start or dead on game
    this.playerStartX  = 205;
    this.playerStartY = 390;
    this.x = this.playerStartX ;
    this.y = this.playerStartY;
    this.offsetX = 85;
    this.offsetY = 80;
    this.sprite= 'images/char-boy.png';    
    
    
    
}
Player.prototype = Object.create(Colision.prototype);
Player.prototype.construtor = Player;
//Update the players's position, required method for game
Player.prototype.update = function() {
    
    if(this.y <= 0){
        var _self = this;
        if(!_self.timer){            
            _self.timer = setTimeout(function(){
                _self.construtor.call(_self)
                _self.timer = null;
            },2000)
            
        }
        
    }
}



// Draw the player on the screen, required method for game
Player.prototype.render = function(){
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
    
    
}

Player.prototype.handleInput = function(direction){
    switch(direction){
        case 'left':
            this.x = Math.max(this.x - this.offsetX,0);
            break;
        case 'right':
            this.x = Math.min(this.x + this.offsetX,400);            
            break;
        case 'up':
            this.y = Math.max(this.y - this.offsetY,-10);
            break;
        case 'down':
            this.y = Math.min(this.y + this.offsetY,this.playerStartY);
            break;
    }    
}


// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
// Place the player object in a variable called player
var maxPositionX  = 400;
var minPositionX = 0;

var yOffset =  80;
var yStart  = 60;
var xOffset = 100;
var xStart = 0;


allEnemies = []
for(var i = 0; i < 5; i ++){
    var x = xStart + xOffset * i;
    var y = yStart + yOffset * i;
    allEnemies.push(new Enemy(x, y,xOffset,yOffset));
}



player = new Player();



// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
document.addEventListener('keyup', function(e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };
    if(allowedKeys[e.keyCode]){
        e.preventDefault();
    }
    
    player.handleInput(allowedKeys[e.keyCode]);
});
