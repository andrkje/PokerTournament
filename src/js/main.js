document.getElementById("tournamentContainer").style.display = 'none';

var TIMER_INTERVAL = 1000;
var MIN_CHIPS = 100;
var MAX_CHIPS = 100000;
var MIN_INTERVAL = 1;
var MAX_INTERVAL = 300;
var MAX_LEVEL = 20;
var BLIND_SCHEDULE = new Array(10, 15, 25, 50, 75, 100, 125, 150, 200, 300, 400, 500, 600, 800, 1000, 1500, 2000, 3000, 3500, 4000)
var blindList = null;
var interval = 0
var count = 0;
var level = 1;
var timer = null;
var running = false;

//var sound1 = "resources/sound.mp3";
//var sound2 = "resources/natas.wav";



// -------------------- Tournament --------------------
function btnClickstartTimer() {
    //document.getElementById("timerSpan").innerHTML = "test";
    toggle();
}

function btnClicksReset() {
    stop();
    document.getElementById("btnStart").textContent = "Start";
    level = 1;
    timer = null;
    running = false;
    count = interval*60;
    
    update();
}

function toggle() {
	if (running) {
		running = false;
		stop();
	}
	else {
		//pauseDifference += startTime - stopTime;
		running = true;
		start();
	}
}

function start() {
    timer = setInterval(function () { update() }, TIMER_INTERVAL);
    document.getElementById("btnStart").textContent = "Pause";
    document.getElementById("btnStart").className = "btn btn-primary btn-lg";
}

function stop() {
    clearInterval(timer);  
    document.getElementById("btnStart").textContent = "Continue";
    document.getElementById("btnStart").className = "btn btn-success btn-lg";
}

function update() {
    var min = Math.floor(count / 60);
    var sec = Math.floor(count % 60);
    if (running)
        count--;
    
    document.getElementById("timerSpan").innerHTML =
	    (min < 10 ? "0" : "") + min + ":" +
        (sec < 10 ? "0" : "") + sec;// + " count: "+ count + " level: " + level; // + " Level: " + level;
	document.getElementById("levelSpan").innerHTML = "Level: " + level;

    if (count < 0 && level < MAX_LEVEL) {
        count = interval*60;
        level++;
	    playSound();
       
    }
    else if (count < 0 && level == MAX_LEVEL) {
        window.clearInterval(timer);
    } 
    
    document.getElementById("blindSpan").innerHTML = "Blinds: <span class=\"large-text\">" + 
        blindList[level-1][1] + " / " + 
        blindList[level-1][2] + "</span>";
    document.getElementById("anteSpan").innerHTML = 
        (blindList[level-1][3] < 1 ? "" : 
         "<br>Ante: <span class=\"large-text\">" + blindList[level-1][3]) + "</span>"
}

function playSound() {
    if (document.getElementById("soundMenu").value != "none") {
        var audio = new Audio(document.getElementById("soundMenu").value);
        audio.play();
    }   
}


// -------------------- Setup --------------------

function btnSetupClick() {
    var interval = document.getElementById("interval").value;
    var error_msg = "";
    var i
    
    if (interval.length < 1)
        error_msg += "Both fields must be filled in. <br> ";
    else {
        if (!isValidInterval(interval)) {
            document.getElementById("interval").style.borderColor = "red";
            error_msg += "Blind interval must be a number between " + MIN_INTERVAL + " and " + MAX_INTERVAL + " minutes. ";
        }
        else {
            document.getElementById("interval").style.borderColor = "#cbcbcb"; 
            i = parseInt(interval);
        }
    } 
    // Error message
    if (error_msg.length > 0) {
        document.getElementById("error_message").innerHTML = '<div class="panel panel-default"><div class="panel-body"><span                style="color:red;font-size:12px;">' +
        error_msg + '</span></div></div>';
    }
    else  {

        c =  parseInt(document.getElementById("chipsMenu").value);
        document.getElementById("error_message").innerHTML = ""; 
 
       blindList = generateBlindSchedule(c, i);
       setUpTournament(i);
    }

}

function setUpTournament(iInterval) {
    interval = iInterval;
    document.getElementById("setupForm").style.display = "none";
    document.getElementById("tournamentContainer").style.display = 'block';
    count = interval*60;
    
    update();
}

function generateBlindSchedule(multiplier, interval, nLevels) {
    var blindList = new Array();
    
    for (var i=0; i < BLIND_SCHEDULE.length; i++) {
        blindList.push(new Array(""+(i+1), ""+(BLIND_SCHEDULE[i]*multiplier), ""+(BLIND_SCHEDULE[i]*multiplier*2), ""+BLIND_SCHEDULE[i]*multiplier));
    }
   
    var output = "<table class=\"table table-bordered\"><thead><tr><th>Level</th><th>Small blind</th><th>Big blind</th></th><th>Ante</th></tr></thead<tbody>";
    for (var i=0; i < blindList.length; i++) {
       output+= 
           "<tr><td>" + blindList[i][0] + "</td>" +
                "<td>" + blindList[i][1] + "</td>" +
                "<td>" + blindList[i][2] + "</td>" +
                "<td>" + blindList[i][3] + "</td></tr>"
    }
    output += "</tbody></table>";
    document.getElementById("blindListBody").innerHTML = output;
    return blindList;
}


// Validation
function isValidInterval(interval) {
    if (!isInteger(interval)) 
        return false;
    var i = parseInt(interval);
    return (i >= MIN_INTERVAL && i <= MAX_INTERVAL);
}

function isInteger(n) {
    if (n == parseInt(n, 10))
       return true;
    else
        return false;   
}