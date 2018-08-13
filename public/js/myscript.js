// creating a global object, to keep track of each individual "start" for each
// timer. Needed so the corresponding "stop" can be matched with it, and to
// avoid cluttering global namespace
window.MyLib = {};

$(document).ready(function(){

// i will count number of timers (and be added to each clock className)
var i = 0;

$("#plus").click(function() {

      // takes taskname from html
      var taskname = document.getElementById('taskname').value;

      // creates list item and appends task to item
      var entry = document.createElement('p');
      var list = document.getElementById('tasklist');
      entry.appendChild(document.createTextNode(taskname));
      list.appendChild(entry);

      // clear task input field
      document.getElementById('taskname').value = "";

      // increases id count
      i++;
      
      // creates stopwatch timer and appends to taskname
      var watch = document.createElement('div');
      watch.className = "clock " + i;
      var time = document.createElement('time');
      time.id = "timer";
      var zeroCount = document.createTextNode("00:00:00");
      time.appendChild(zeroCount);
      watch.appendChild(time);
      list.appendChild(watch);

      // creates buttons and button ids
      var start = document.createElement('button');
      start.id = "start";
      start.appendChild(document.createTextNode("start"));
      var stop = document.createElement('button');
      stop.id = "stop";
      stop.appendChild(document.createTextNode("stop"));
      var clear = document.createElement('button');
      clear.id = "clear";
      clear.appendChild(document.createTextNode("clear"));
      var trash = document.createElement('img');
      trash.id = "delete";
      trash.src = "/images/garbage.svg";

      // append buttons to timer
      watch.appendChild(start);
      watch.appendChild(stop);
      watch.appendChild(clear);
      watch.appendChild(trash);

  });

// starting the timer
//as the buttons are dynamically generated, need to reference document object first
$(document).on("click", "#start", function(){

    //  let seconds = 0, minutes = 0, hours = 0;

    // takes the current time from what's showing on the timer
    // Math.round needed to remove extraneous zeros
    let counterTime = this.previousSibling.textContent;
    let seconds = Math.round(counterTime.split(":")[2]);
    let minutes = Math.round(counterTime.split(":")[1]);
    let hours = Math.round(counterTime.split(":")[0]);

    // the timer is the start button's previousSibling.
    let counter = this.previousSibling;

    // function to add seconds, turn seconds to minutes, then minutes to hours
    function add() {
    seconds++;
      if (seconds >= 60) {
        seconds = 0;
        minutes++;
        if (minutes >= 60) {
            minutes = 0;
            hours++;
        }
      }

    // adds digit to tenths' position in timer after 10 is counted
    counter.textContent = (hours ? (hours > 9 ? hours : "0" + hours) : "00") +
    ":" + (minutes ? (minutes > 9 ? minutes : "0" + minutes) : "00") +
    ":" + (seconds > 9 ? seconds : "0" + seconds);
    }

    // get integer from className, to save start button instance against
    let j = this.parentNode.className.split(" ")[1];

    /*
    window["begin" + j] = setInterval(add,1000);
    window["begin" + j];
    */

    // start the timer, and add this particular start instance to the global object
    MyLib["begin" + j] = setInterval(add,1000);
    MyLib["begin" + j];

  });

// stopping an individual timer
$(document).on("click", "#stop", function(){
    // get the integer from the clock's className, to match the corresponding start
    // intance
    let j = this.parentNode.className.split(" ")[1];
    /*
    clearInterval(window["begin" + j]);
    */
    // stops the corresponding timer
    clearInterval(MyLib["begin" + j]);

  });

// resetting an individual timer to zero
$(document).on("click", "#clear", function(){
  // resets timer to zero
  this.parentNode.firstChild.textContent = "00:00:00";

  // seconds = 0; minutes = 0; hours = 0;
  });

// deleting an individual timer to zero
$(document).on("click", "#delete", function(){

  // deletes task name
  this.parentNode.previousSibling.remove();

  // deletes parent node (i.e. entire div)
  this.parentNode.remove();
  });

});
