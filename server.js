
function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

const numerek = getRandomInt(1, 35);
console.log(numerek);

var http = require('http');

var dane = {};

dane.numerek = numerek;
dane['data_losowania'] = new Date().getTime()

var jutro = new Date();
jutro.setDate(jutro.getDate() + 1);
dane['data_kolejnego_losowania'] = jutro.getTime()

dane['school_name'] = "ZS1 Bochnia";
dane['school_ico'] = "http://zs1.bochnia.pl/images/logobiale.png";

http.createServer(function(request, response){
  response.writeHead(200, {'Content-type':'application/json'});
  response.write( JSON.stringify(dane) );
  response.end( );

}).listen(801);

// 1. Wylosowac liczbe / zapamietac
// 2. Zapamietac date
// 3. Eliminacja juz wylooswanych numerow
// 4. Server http / serwer www
// 5.
