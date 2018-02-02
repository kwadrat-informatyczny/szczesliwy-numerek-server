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
