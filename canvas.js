/* NOTE: I enjoy digital illustration and really just wanted to take this opportunity to 
learn what HTML5 Canvas is all about. This clock drawn on HTML 5 canvas is based partially 
off of a tutorial on W3Schools: https://www.w3schools.com/graphics/canvas_clock_start.asp
and partially from concepts learned in this HTML 5 video tutorial series on YouTube: 
https://www.youtube.com/watch?v=EO6OkltgudE as well as several posts on StackOverflow.

After thoroughly taking apart the different methods in these tutorial, I adapted ideas 
useful for creating my sun-animation alarm clock. Every concept is explained in the 
comments of this code. */


// ======== FIND AND DISPLAY CURRENT TIME (DIGITAL) ========== //

// var now = new Date();
// var hour = now.getHours();
// var minute = now.getMinutes();
// var second = now.getSeconds();
// var am_pm, currentTime, alarmTime;

// console.log(hour);

// // ---------- Convert Military Time ---------- //

// if (hour == 00) {
// 	hour = 12;
// 	am_pm = 'AM';
// } else if (hour < 12) {
// 	hour = hour;
// 	am_pm = 'AM';
// } else if (hour == 12) {
// 	hour = hour;
// 	am_pm = 'PM';
// } else if (hour > 12) {
// 	hour = hour-12;
// 	am_pm = 'PM';
// }

// console.log(hour);
// console.log(am_pm);

// // ---------- Add Zero for Display --------- //

function addZero(num) {
	if (num < 10) {
		num = "0" + num;
	}
	else { 
		num = num;
	}
	return num;
}

// hour = addZero(hour);
// minute = addZero(minute);
// second = addZero(second);

//currentTime = hour + ":" + minute + ":" + second + am_pm;

// console.log(hour);
// console.log(currentTime);


// ---------- Display Current Time ---------- //

// Putting this whole thing into a function with a setInterval to refresh every second.

	// setInterval(displayCurrentTime, 1000);

setInterval(function displayCurrentTime() {
	var now = new Date();
	var hour = now.getHours();
	var minute = now.getMinutes();
	var second = now.getSeconds();
	var am_pm, currentTime;

	if (hour == 00) {
		hour = 12;
		am_pm = 'AM';
	} else if (hour < 12) {
		hour = hour;
		am_pm = 'AM';
	} else if (hour == 12) {
		hour = hour;
		am_pm = 'PM';
	} else if (hour > 12) {
		hour = hour-12;
		am_pm = 'PM';
	}

	function addZero(num) {
		if (num < 10) {
			num = "0" + num;
		}
		else { 
			num = num;
		}
		return num;
	}

	hour = addZero(hour);
	minute = addZero(minute);
	second = addZero(second);

	currentTime = hour + ":" + minute + ":" + second + am_pm;

	document.getElementById('currentTime').innerHTML = currentTime;
	}
, 1000);


// ========= SETTING UP THE ANALOG CLOCK CIRCLE ON HTML 5 CANVAS ========= //

var canvas = document.querySelector("canvas");

/* The size (radius) of the canvas is the size of the browser window. */
var width = canvas.width = window.innerWidth;
var height = canvas.height = (window.innerHeight)/2;

// Use variables to shorten the name of the context, width, height.
var c = canvas.getContext("2d");

/* The size (radius) of the sun is responsively 
determined by the width of the browser window. */
var radius = width / 10;

/*The canvas drawing resets once every 1000 milliseconds
A.K.A. every second, to draw the second hand of the clock.*/
setInterval(drawClock, 1000);



// ========== FUNCTION FOR DRAWING THE CLOCK IN THREE PARTS ========== //

function drawClock() {
/* By positioning a rectangle with an alpha value of 0.05
on top of the rays of the sun, it looks like the color is
degrading over time. */
	c.fillStyle = "rgb(126, 192, 238)";
	c.globalAlpha = 0.1;
	c.fillRect(0, 0, width, height);
	c.globalAlpha = 1;
/* Saving the state of the drawing after each second,
rotating, then restoring. */
	c.save();
	c.translate(width * 0.5, height * 0.5);
/* Here I call the three functions that draw the face,
numbers, and hands of the clock, and then restore the drawing
to the saved state above. */
	drawFace(c, radius);
	drawNumbers(c, radius);
	drawTime(c, radius);
	c.restore();
}


// ========== 1. FUNCTION FOR DRAWING THE FACE OF THE CLOCK ========== //

function drawFace(c, radius) {
/* This is a canvas gradient making the sun appear like it is
glowing from the middle outwards, from yellow to gold to orange. */
	var sun_gradient;
	sun_gradient = c.createRadialGradient(0,4,radius*0.05, 2,0, radius*0.9);
	sun_gradient.addColorStop(0, 'yellow');
	sun_gradient.addColorStop(0.65, 'gold');
	sun_gradient.addColorStop(1, 'orange');

	c.beginPath();
	c.arc(0,0,radius, 0, 2*Math.PI);
	c.fillStyle= sun_gradient;
	c.fill();

	c.strokeStyle = 'rgba(255, 153, 0, 0.9)';
	c.lineWidth = radius * 0.1;
	c.stroke();

	c.beginPath();
	c.arc(0,0,radius*0.1, 0, 2*Math.PI);
	c.fillStyle = 'rgba(255, 153, 0, 0.75)';
	c.fill();
}


// ========== 2. FUNCTION FOR DRAWING THE NUMBERS ON THE CLOCK ========== //

function drawNumbers(c, radius) {
	var ang;
	var num;
	c.font = radius*0.24 + "px Indie Flower";
	c.fillStyle = "#ee7600";

/* The textBaseline and textAlign methods serve to center the clock numbers so 
that they sit in the right positions on the clock face. */	
	c.textBaseline="middle";
	c.textAlign="center";

/* Using a loop, I am drawing each number on the face of the clock, rotating 
by an angle of 1/12 of 360 degrees, saving, and drawing the next line (sun ray), 
then restoring the numbers to the previous state before the rotation so that 
the numbers are not moving alongside the rays. */

	for (num = 1; num < 13; num++) {
		ang = num * Math.PI / 6 - Math.PI*0.5;
		c.save();
/* The numbers on the face of the clock are positioned 0.85 of the radius of the clock
so that they look like they are sitting on the inside of the rim of the clock. A new
number is drawn every 1/12 of 360 degrees as defined in "var ang" above. */
		c.translate(0.85*radius * Math.cos(ang), 0.85*radius * Math.sin(ang));
		c.fillText(num.toString(), 0 , 0);
		c.restore();
	}
}


// ========== 3. FUNCTION FOR GETTING THE TIME AND DRAWING THE HANDS OF THE CLOCK  ========== //

function drawTime(c, radius) {
	var now = new Date();
	var hour = now.getHours();
	var minute = now.getMinutes();
	var second = now.getSeconds();
	var am_pm = (now.getHours()) < 12 ? 'AM' : 'PM';

	var currentTime = hour + ":" + minute + am_pm;

// Figuring out where the hour hand should be positioned.
	hour = hour % 12; // 12 hours in one clock rotation.

	/* Math.PI is 1/2 the circumference of the circle, so Math.PI / 6 is the arc distance between 
	each number on the clock face. */

	/* Determining the position of the hour hand also requires adding up the fraction of movement
	added by each minute and second. There are 60 minutes in an hour and 3600 seconds in an hour. */
	
	hour = (hour * Math.PI / 6) + (minute * Math.PI / (6*60)) + (second * Math.PI / (3600*6));
	drawHand(c, hour, radius*0.5, radius*0.07); // The width and length of the hour hand (a rectangle).

// Figuring out where the minute hand should be positioned.
	minute = (minute * Math.PI / 30); // Half the circumference of the clock = 30 minutes.
	drawHand(c, minute, radius*0.7, radius*0.045); // The width and length of the longer, thinner minute hand.


// Figuring out where the second hand should be positioned.
	second = (second * Math.PI / 30); // Half the circumference of the clock = 30 seconds.
	drawHand(c, second, radius*2, radius*0.02); /* The narrow second hand extends twice the radius of the clock face
		to give the impression of rays of sunlight*/
}

// The drawHand function draws a line given its length, width, and position.
function drawHand(c, pos, length, width) {
	c.beginPath();
	c.lineWidth = width;
	c.moveTo(0,0);
	c.rotate(pos);
	c.lineTo(0,-length);
	c.stroke();
	c.rotate(-pos);
}


// ========= ALARM SETTINGS AND BUTTONS ========= //

function setHour(){
	var select = document.getElementById('alarm_hours');
	var hours = 12;

	for (i=1; i<=hours; i++) {
		select.options[select.options.length] 
		= new Option(i);
	}
}

setHour();

function setMinute(){
	var select = document.getElementById('alarm_minutes');
	var minutes = 60;

	for (i=1; i<=minutes; i++) {
		select.options[select.options.length] 
		= new Option(i);
	}
}

setMinute();

var alarmTime = alarmSet();


function alarmSet(){

	// Select the dropdown menu element
	var set_hour = document.getElementById('alarm_hours');
	var set_min = document.getElementById('alarm_minutes');
	var set_ap = document.getElementById('am_pm');

	// Get the value from the dropdown menu element
	var hour_picked = set_hour.options[set_hour.selectedIndex].value;
	var minute_picked = set_min.options[set_min.selectedIndex].value;
	var ampm_picked= set_ap.options[set_ap.selectedIndex].value;

	// Set alarmTime with these values
	alarmTime = addZero(hour_picked) + ":" + addZero(minute_picked) + ":" + "00" + ampm_picked;

	// Disable further editing of alarmTime
	document.getElementById('alarm_hours').disabled = true;
	document.getElementById('alarm_minutes').disabled = true;
	document.getElementById('am_pm').disabled = true;

	
	// console.log(alarmTime);
	document.getElementById('alarmTime').innerHTML = alarmTime;
	
	return alarmTime;	
}

// console.log(alarmTime);


function alarmClear() {
	document.getElementById('alarm_hours').disabled = false;
	document.getElementById('alarm_minutes').disabled = false;
	document.getElementById('am_pm').disabled = false;
	sound.pause();
	document.getElementById('rooster_image').style.display = "none";
}

// ---------- Compare Alarm and Current Time ---------- //

var sound = new Audio("Rooster.mp3");
		sound.loop = true;

setInterval(function() {
	if (alarmTime == currentTime.textContent) {
		// console.log("Is this damn thing working?")
		sound.play();
		document.getElementById('rooster_image').style.display = "block";
	}
}, 1000);