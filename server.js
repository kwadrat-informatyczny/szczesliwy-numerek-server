var fs = require('fs'),
  http = require('http');

var dane = {},
  port = 801;
dane['school_name'] = "ZS1 Bochnia";
dane['school_ico'] = "http://zs1.bochnia.pl/images/logobiale.png";

fs.readFile('settings.json',  "utf8", (err, data) => {
  if (err) console.log("Problem with reading file! " + err.toString())
  console.log('Settings file: ' + data);

  if (data) dane = JSON.parse(data)

  if (!dane.size)
    dane.size = 32;

  // setup numbers for draw
  if (!dane.toDraw || dane.toDraw.length == 0) {
    let c = 0;
    dane.toDraw = [];
    while (c < dane.size) {
      c++;
      dane.toDraw.push(c);
    }
  }
  console.log("List of numbers to be used in generation: " + dane.toDraw.toString())

  fs.writeFile('settings.json', JSON.stringify(dane) , (err) => {
    if (err) return console.log("Problem with saving file! " + err.toString())
  });
});

http.createServer(function(request, response){

  // check if we need to generate number
  var now = new Date(),
    old = new Date(now.getTime() - 24 * 60 * 60);

  if (dane['data_losowania'])
    old = new Date(dane['data_losowania']);

  var when = getNextDrawTime(old);
  console.log("Last draw time: " + old.toISOString() + ", next draw: " + when.toISOString())

  if ((when.getTime() <= now.getTime()) || !dane.numerek) {
    dane.numerek = getRandomInt(0, dane.toDraw.length);
    dane.toDraw.splice(dane.toDraw.indexOf(dane.numerek), 1);
    dane['data_losowania'] = now.getTime();

    console.log("GENERATED NUMBER --> " + dane.numerek + " <--")

    fs.writeFile('settings.json', JSON.stringify(dane) , (err) => {
      if (err) return console.log("Problem with saving file! " + err.toString())
    });
  }

  response.writeHead(200, {'Content-type':'application/json'});
  response.write( JSON.stringify(dane) );
  response.end( );
}).listen(port);

console.log("Listening to connections on port " + port)






function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getNextDrawTime(czas) {
  var jutro = new Date(czas.getTime());

	if (jutro.getDay() == 5){
		jutro.setDate(jutro.getDate() + 2);
  }
  else if (jutro.getDay() == 6) {
		jutro.setDate(jutro.getDate() + 1);
  } else if (jutro.getDay() == 4 && jutro.getHours() >= 20){
		jutro.setDate(jutro.getDate() + 3);
	} else if (jutro.getHours() < 20){
				jutro = new Date();
	} else {
	  jutro.setDate(jutro.getDate() + 1);
  }
  jutro.setHours(20);
  jutro.setMinutes(0);
  jutro.setSeconds(0);

  return jutro;
}
