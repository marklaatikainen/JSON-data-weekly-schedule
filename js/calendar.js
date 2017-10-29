var taken = {};

function showTable(data) {
	var days = ["","Monday","Tuesday","Wednesday","Thursday","Friday"];
	var times = ["8:00","9:00","10:00","11:00","12:00","13:00","14:00","15:00","16:00","17:00","18:00","19:00","20:00"];

	var doc = document.getElementById("showData");
	
	// creates a <table> element and a <tbody> element
	var tbl = document.createElement("table");
		tbl.className = "calendar table table-bordered";
	var tblHead = document.createElement("thead");
	var tblBody = document.createElement("tbody");
	
	// create table header
	for (var d = 0; d < days.length; d++) {
		var th = document.createElement("th");
		var thText = document.createTextNode(days[d]);
		th.appendChild(thText);
		tbl.appendChild(th);		
	}

	for (var i = 0; i < 13; i++) {
    	// creates a table row
    	var row = document.createElement("tr");


    	for (var j = 0; j < 6; j++) {
    		if(taken.hasOwnProperty(j)) {
    			taken[j]--;
    			if(taken[j] == 0) delete taken[j];
    		} else {
				var cell = document.createElement("td");
			    //Loop data
    			for(var d = 0; d < data.length; d++) {
			    	var stmz = [];
			    	var etmz = [];
    				// Loop schedule
                    for (var s = 0; s < data[d].Time.length; s++) {
                        var c = document.createElement('td');
						var day = getDay(data[d].Time[s].substring(1,4));
						// get start time
						var start = getPosition(data[d].Time[s].substring(5,10));
						stmz[s] = data[d].Time[s].substring(5,10);
						etmz[s] = data[d].Time[s].substring(11,16);
						// set event
                        if (cell.className != "event") {
                            cell.className = "cell";
                            row.appendChild(cell);
                        } else {
                            for (var y = 0; y < data[d].Time.length; y++) {
                                row.appendChild(cell);
                            }
                        }
                        if (j == 0) {
                            cell.innerHTML = times[i];
                            cell.className = "time";
                            row.appendChild(cell);
                            tblHead.appendChild(row);
                        }
                        var cont = data[d].Id + "<br>" + data[d].Name + "<br>" + data[d].Time[s].substring(5, 10) + " - " + data[d].Time[s].substring(11, 16);
                        setSpan(cell, cont, day, start, etmz[s], stmz[s], i, j);
				    }
				}
			}
    	} 
        tblBody.appendChild(row);
	}
	// put the <tbody> in the <table>
	tbl.appendChild(tblHead);
	tbl.appendChild(tblBody);
	// appends <table> into <body>
	doc.appendChild(tbl);
}


function getDay(day) {
	if (day == "Mon") {
		return 1;
	} else if (day == "Tue") {
		return 2;
	} else if (day == "Wed") {
		return 3;
	} else if (day == "Thu") {
		return 4;
	} else if (day == "Fri") {
		return 5;
	} else {
		return;
	}
}

function getPosition(startTime) {

	var jsonTime = ["08:00","09:00","10:00","11:00","12:00","13:00","14:00","15:00","16:00","17:00","18:00","19:00","20:00"];
	var tableTime = ["0","1","2","3","4","5","6","7","8","9","10","11","12"];

    for (var i = 0; i < jsonTime.length; i++) {
        var s = startTime.split(':');
        if (s[1] > 00 && s[i] < 30) {
            startTime = s[0] + ":" + "00";
        } else if (s[1] >= 30 && s[i] <= 59) {
            startTime = (s[0] + 1) + ":" + "00";
        }
		if(startTime == jsonTime[i]) {
			var result = tableTime[i];
			return result;
		}
	}
	return;
}

function setSpan(cell,cont,day,position,endTime,startTime,row,col) {
	var dur = getDuration(startTime, endTime);

	if((col == day && row == position)) {
		cell.rowSpan = dur;
        cell.className = "event";
        cell.innerHTML = cont;
		taken[day] = dur - 1;
	}
}

function getDuration(startTime, endTime) {
    // start time
    var sDate = new Date();
    var s = startTime.split(':');
    sDate.setHours(s[0]);
    sDate.setMinutes(s[1]);
    // end time
    var eDate = new Date();
    var e = endTime.split(':');
    eDate.setHours(e[0]);
    eDate.setMinutes(e[1]);

    var elapsed = eDate - sDate; // time in milliseconds
    var difference = new Date(elapsed);
    var diff_hours = difference.getHours();
    var diff_mins = difference.getMinutes();

    var duration = diff_hours;
    if (e[1] == "45" || e[1] == "40") {
        duration -= 1;
    }
    return duration;
}
