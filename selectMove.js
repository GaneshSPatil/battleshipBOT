module.exports = function(placesShoot){
  Object.keys(placesShoot).forEach(function(k){
    console.log(k, '-->', placesShoot[k]);
  });
  placesShoot = Object.keys(placesShoot).length;
  var vertical = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'];
  var v = vertical[Math.floor(placesShoot/10)];
  var h = placesShoot - (Math.floor(placesShoot/10)*10) + 1;
  selector = v + h;
  return selector;
};

 
