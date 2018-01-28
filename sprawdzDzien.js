//zakładamy, że na serwerze non-stop działa pętla 24/7, która o godzinie 20:00 aktywuje ten skrypt
//jeśli funkcja "sprawdzDzien" zwraca wartosc true(czyli od niedzieli do czwartku), wtedy otrzymujemy numerek na kolejny dzień(czyli w niedziele o 20 otrzymujemy numerek na poniedziałek)

var dzien = new Date(); //ta zmienna pobiera date urządzenia, ale skoro robi to serwer to raczej nie powinno być błędów jeśli użytkownik aplikacji ma inną datę niż aktualna

if(sprawdzDzien(dzien){
	//tu powinien znajdować się skrypt losujący numerek
}
else{
	console.log("Na jutro nie ma żadnego numerka.")
	//w piątek i sobotę o godzinie 20, otrzymujemy informację że na kolejny dzień nie ma numerka
}

function sprawdzDzien(dzien){
	if((dzien.getDay()>=0)&&(dzien.getDay()<=4)){
		return true;
	}
	else{
		return false;
	}
}