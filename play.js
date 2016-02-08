var page = require('webpage').create();
var selectMove = require('./selectMove.js');

//----------------------------------- Page Events ---------------------------------------//

page.onConsoleMessage = function(msg){
  console.log(msg);
};

page.onUrlChanged = function(targetUrl) {
    console.log('New URL: ' + targetUrl);
};

//---------------------------------------------------------------------------------------//

var printLoginPageTitle = function(page){
  var title = page.evaluate(function() {
    return document.title;
  });
  console.log('Page title is ' + title);
};


var printInputValue = function(page){
  var title = page.evaluate(function() {
    return document.getElementsByName('name')[0].value;
  });
  console.log('Page name field value is ' + title);
};

var setInputValue = function(page, value){
  page.evaluate(function(value) {
    document.getElementsByName('name')[0].value = value;
  }, value);
};

//------------------------------------------- GAME LOGIC ------------------------------------------------------//

var placesShoot = {};
var lastHitStatus;

var shoot = function(page){
  
  var selector = selectMove(placesShoot, lastHitStatus);
  
  var output = page.evaluate(function(s, p){
    var placesShoot;
    var lastHit;
    $.ajax({
      type: 'POST',
      url: 'http://localhost:5000/html/shoot',
      data: { position : s},
      success: function(data){
          var status = JSON.parse(data);
          p[s] = status.reply;
          var obj = {};
          obj.place = s;
          obj.status = status.reply;
          lastHit = obj;
          placesShoot = p;
      },
      async:false
    });
    return [placesShoot, lastHit];
  }, selector, placesShoot);

  placesShoot = output[0];
  lastHitStatus = output[1];

  setTimeout(play, 2000, page);
};


var endGame = function(page){
  var status = page.evaluate(function(){
    return document.querySelector('.game_screen .gameStatus').innerHTML;
    document.forms[2].click();
  });
  console.log('Game status is', status);
  phantom.exit();
};


var play = function(page){
  var value = page.evaluate(function(){
    var val = document.querySelector('.mainContent .message');
    if(val){
      return document.querySelector('.mainContent .message p').innerHTML;
    }
  });
  console.log(value);
  if(value == 'Your Turn'){
    shoot(page);
  }else if(value == null){
    endGame(page);
  }else{
    setTimeout(play, 2000, page); 
  };
};


//-------------------------------------------------------------------------------------------------------------//

var clickReadyButton = function(page){
  console.log('going to click ready button');
  page.evaluate(function(){
   document.getElementById('ready').click(); 
  });
  
  var doLater = function(){
    page.render('shipPage.png');
    play(page);
  }
  setTimeout(doLater, 2000);
};

var deployShips = function(page){
  console.log('yeah');
  page.evaluate(function(){
    document.getElementById('position_of_ship').value = 'battleship';
    document.getElementById('A1').click(); 
    document.getElementById('position_of_ship').value = 'cruiser';
    document.getElementById('A2').click(); 
    document.getElementById('position_of_ship').value = 'carrier';
    document.getElementById('A3').click(); 
    document.getElementById('position_of_ship').value = 'destroyer';
    document.getElementById('A4').click(); 
    document.getElementById('position_of_ship').value = 'submarine';
    document.getElementById('A5').click();
  });
  var doLater = function(){
    page.render('shipPlaced.png');
    clickReadyButton(page);
  };
  setTimeout(doLater, 2000);
};


var createNewGame = function(page){
  console.log('Came here');
  page.evaluate(function(){
    document.querySelector('#newGame button').click();
  });
  var doLater = function(){
   deployShips(page); 
  };
  setTimeout(doLater, 2000);
};


var clickStartButton = function(page){
  page.evaluate(function(){
    document.getElementById('submit_player_name').click();
  });
  var doLater = function(){
    createNewGame(page);
  };
  setTimeout(doLater, 2000);
};

var loginIntoGame = function(page, name){
  setInputValue(page, name);
  clickStartButton(page, name);
};

page.open('http://localhost:5000/', function() {
    printLoginPageTitle(page);
    loginIntoGame(page, 'Ganesh');
});
