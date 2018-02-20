var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var session = void 0; // session Timer object instance
var btimer = void 0; // break Timer object instance

var s_min = void 0; // prevents s_timer display from jumping straight to session.min upon +/-
var s_timer = void 0; // reference to session timer HTML display
var s_increase = void 0; // reference to session + button
var s_decrease = void 0; // reference to session - button

// same variables as above for break timer
var b_min = void 0;
var b_timer = void 0;
var b_increase = void 0;
var b_decrease = void 0;

var buttonhtml = void 0; // reference to the big button HTML
var button = void 0; // reference to the entire button surface area

var audioarray = [// array of sounds upon timer finishing
"http://audiosoundclips.com/wp-content/uploads/2012/01/Bird.mp3", "http://audiosoundclips.com/wp-content/uploads/2012/01/Bird2.mp3", "http://audiosoundclips.com/wp-content/uploads/2012/01/Bird3.mp3"];
var audioplay = document.createElement("audio");

$(document).ready(function () {
  s_min = 25; // default minute value for session
  s_decrease = $("#sdecrease"); // session -
  s_timer = $("#stimer"); // session HTML
  s_increase = $("#sincrease"); // session +
  b_min = 5; // default minute value for break
  b_decrease = $("#bdecrease"); // break -
  b_timer = $("#btimer"); // break HTML
  b_increase = $("#bincrease"); // break +

  button = $("#button");
  buttonhtml = $("#buttonhtml");

  session = new Timer(s_min, buttonhtml, "Session");
  btimer = new Timer(b_min, buttonhtml, "Break");

  // increase session minutes
  $(s_increase).on("click", function () {
    if (session.off) {
      // only adjust session time on pause or when btimer is running
      s_min++;
      session.min = s_min;
      session.minsSet = s_min;
      session.sec = 0;

      s_timer.html(s_min);
    }
  });

  // decrease session minutes
  $(s_decrease).on("click", function () {
    if (session.off) {
      if (s_min > 1) {
        s_min--;
        session.min = s_min;
        session.minsSet = s_min;
      }
      session.sec = 0;

      s_timer.html(s_min);
    }
  });

  // increase break minutes
  $(b_increase).on("click", function () {
    if (btimer.off) {
      b_min++;
      btimer.min = b_min;
      btimer.minsSet = b_min;
      btimer.sec = 0;

      b_timer.html(b_min);
    }
  });

  // decrease break minutes
  $(b_decrease).on("click", function () {
    if (btimer.off) {
      if (b_min > 1) {
        b_min--;
        btimer.min = b_min;
        btimer.minsSet = b_min;
      }
      btimer.sec = 0;

      b_timer.html(b_min);
    }
  });

  // begin/pause session timer by clicking on the main button
  $(button).on("click", function () {
    if (btimer.active) {
      // var active ensures correct timer is restarted upon pause 
      if (!btimer.off) {
        // if btimer is running, pause it
        btimer.stopClock(session.intervalFunction);
      } else if (btimer.off) {
        // if btimer is paused, restart it
        btimer.time();
      }
    } else if (session.off && btimer.off) {
      // first click of button, launch session
      session.time();
    } else if (!session.off) {
      // if session is running, pause it
      session.stopClock(session.intervalFunction);
    }
  });
});

var Timer = function () {
  function Timer(min, mainhtml, type) {
    _classCallCheck(this, Timer);

    this.min = min; // minutes
    this.minsSet = min; // minutes again, this will be used to reset the timer
    this.sec = 0;
    this.off = true; // boolean saying whether timer is off or not
    this.active = false; // used for pause/restart quality assurance so each timer must finish before the other starts
    this.disp = mainhtml; // big button HTML
    this.func;
    this.type = type; // "session" or "btimer"
  }

  _createClass(Timer, [{
    key: "time",
    value: function time() {
      // function fired when the timer is clicked
      this.off = false;
      this.active = true;
      this.intervalFunc();
      // }
    }
  }, {
    key: "intervalFunc",
    value: function intervalFunc() {
      // set the interval of the timer
      var this2 = this;
      this.func = setInterval(function () {
        this2.countdown();
      }, 1000);
    }
  }, {
    key: "countdown",
    value: function countdown() {
      // interval to complete for duration of timer
      // check if clock reaches zero
      // if clock is not at 0:00, display new time
      var m = this.min.toString();
      var s = void 0;
      if (this.sec < 10) {
        s = "0" + this.sec.toString();
      } else {
        s = this.sec.toString();
      }
      this.disp.html(this.type + "<br/> " + m + ":" + s);

      this.sec--;

      if (this.sec < 0) {
        this.min--;
        this.sec = 59;
        if (this.min < 0) {
          this.min = this.minsSet;
          this.sec = 0;
          this.off = true;
          this.active = false;
          var randomsound = audioarray[Math.floor(Math.random() * audioarray.length)];
          audioplay.setAttribute("src", randomsound);
          audioplay.play();
          if (this.type == "Session") {
            btimer.time();
          } else {
            session.time();
          }
          this.stopClock(this.func); // clearInterval() function below
        }
      }
    }
  }, {
    key: "stopClock",
    value: function stopClock() {
      this.off = true;
      clearInterval(this.func);
    }
  }]);

  return Timer;
}();