
function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

const numerek = getRandomInt(1, 35);
console.log(numerek);

var http = require('http');

var dane = {};

dane.numerek = numerek;
dane.timestamp = new Date().getTime()

http.createServer(function(request, response){
  response.writeHead(200, {'Content-type':'application/json'});
  response.write( JSON.stringify(dane) );
  response.end( );

}).listen(80);

// 1. Wylosowac liczbe / zapamietac
// 2. Zapamietac date
// 3. Eliminacja juz wylooswanych numerow
// 4. Server http / serwer www
// 5.
