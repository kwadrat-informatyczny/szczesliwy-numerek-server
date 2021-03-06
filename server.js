//-----DATA INITIALIZATION-----
var fs = require('fs'),
  http = require('http');

var dane = {},
port = 9960;
dane['school_name'] = "ZS1 Bochnia";
dane['school_ico'] = "http://zs1.bochnia.pl/images/logobiale.png",
requestNmbr = 0;

//-----SAVING NUMBERS INTO FILE-----
fs.readFile('settings.json',  "utf8", (err, data) => {
  if (err) console.log("Problem with reading file! " + err.toString());
	console.log('Settings file: ' + data);

  if (data) dane = JSON.parse(data);

  dane.size = 36;

  // setup numbers for draw
  if (!dane['toDraw'] || dane.toDraw.length === 0) {
    let c = 0;
    dane['toDraw'] = [];
    while (c < dane.size) {
      c++;
      dane.toDraw.push(c);
    }
  }
	console.log("List of numbers to be used in generation: " + dane.toDraw.toString());

fs.writeFile('settings.json', JSON.stringify(dane) , (err) => {
    if (err) return console.log("Problem with saving file! " + err.toString());
  });
});

//-----CREATING SERVER-----
http.createServer(function(request, response){

	response.setHeader('Access-Control-Allow-Origin', '*');
	response.setHeader('Access-Control-Request-Method', '*');
	response.setHeader('Access-Control-Allow-Methods', 'OPTIONS, GET');
	response.setHeader('Access-Control-Allow-Headers', '*');
	if ( request.method === 'OPTIONS' ) {
		response.writeHead(200);
		response.end();
		return;
	}

  requestNmbr++;
  console.log("News request #" + requestNmbr)

  // check if we need to generate number
  var now = new Date(),
    old = new Date(now.getTime() - 24 * 60 * 60);

  if (dane['data_losowania'])
    old = new Date(dane['data_losowania']);

  var when = getNextDrawTime(now);
	console.log("(#" + requestNmbr + ") Last draw time: " + old.toISOString() + ", next draw: " + when.toISOString());
	dane['nastepne_losowanie'] = when.getTime();

  if ((when.getTime() <= now.getTime()) || !dane['numerek']) {
    dane['numerek'] = getRandomInt(0, dane.toDraw.length);
    dane.toDraw.splice(dane.toDraw.indexOf(dane.numerek), 1);
    dane['data_losowania'] = now.getTime();

    if (!dane.history) dane.history = {}
    dane.history[dane['data_losowania']] = dane.numerek;

    console.log("(#" + requestNmbr + ") GENERATED NUMBER --> " + dane.numerek + " <--")

    fs.writeFile('settings.json', JSON.stringify(dane) , (err) => {
      if (err) return console.log("(#" + requestNmbr + ") Problem with saving file! " + err.toString());
    });
  }

  response.writeHead(200, {'Content-type':'application/json'});
  response.write( JSON.stringify(dane) );
  response.end( );
}).listen(port);

		console.log("Listening to connections on port " + port);

//-----GETTING RANDOM NUMBER-----
function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

//-----DATE CHECKING-----
function getNextDrawTime(czas) {
 var jutro = new Date(czas.getTime());
		console.log("Starting from " + jutro.toISOString());

	if (jutro.getDay() == 5){
		jutro.setDate(jutro.getDate() + 2);
	}
	else if (jutro.getDay() == 6) {
		jutro.setDate(jutro.getDate() + 1);
	}
	else if (jutro.getDay() == 4 && jutro.getHours() >= 18){
		jutro.setDate(jutro.getDate() + 3);
	}
	else if (jutro.getHours() < 18){
				//jutro = new Date();
	}
	else {
	  jutro.setDate(jutro.getDate() + 1);
	}

  // check if that day is prohibited
  // example: 20180901
  if (dane.freeDays && Array.isArray(dane.freeDays)) {
    if (dane.freeDays.indexOf(getStrRepresentative(jutro)) > -1) {
      console.log("Selected day in prohibited array. " + getStrRepresentative(jutro) + ", " + dane.freeDays.toString())
      jutro.setDate(jutro.getDate() + 1);
      jutro = getNextDrawTime(jutro);
    }
  }

  jutro.setHours(18);
  jutro.setMinutes(0);
  jutro.setSeconds(0);

  return jutro;
}

function getStrRepresentative(d) {
  return d.getFullYear().toString() + leadingZero((d.getMonth()+1).toString()) + leadingZero(d.getDate().toString());
}

function leadingZero(str) {
  if (str.length < 2) return leadingZero("0" + str);
  return str;
}
