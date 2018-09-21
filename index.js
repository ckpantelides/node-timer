const express = require('express');
const bodyParser = require('body-parser');
const request = require('request');
const app = express();
const util = require('util');
var groupBy = require('lodash.groupby');

const sqlite3 = require('sqlite3').verbose();

// make static files available i.e. css
app.use(express.static('public'));

// serves all requests which includes /images in the url from the images folder
app.use('/images', express.static(__dirname + '/Images'));

// app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.set('view engine', 'ejs');

// serve the task timer homepage
app.get('/', function (req, res) {
  res.render('index');
})

app.post('/save', function (req, res) {

  // open database
  let db = new sqlite3.Database('data.db', (err) => {
    if (err) {
      return console.error(err.message);
    }
  //  console.log('Connected to the data.db SQlite database.');
  });

  var i, n = req.body.length;

  for (i = 0; i < n; i++) {
    var date = req.body[i].fullDate;
    var name = req.body[i].parentName;
    var timeSpent = req.body[i].clock;

    db.run("INSERT INTO tasks (date, name, time) VALUES (?,?,?)", date, name, timeSpent);
  }

  // close the database connection
  db.close((err) => {
    if (err) {
      return console.error(err.message);
    }
  //  console.log('Close the database connection.');
  });
})

// serve the user history
// shows the time spent on each task per day
app.get('/history', function (req, res) {
  // open database
  let db = new sqlite3.Database('data.db', 'OPEN_READONLY', (err) => {
    if (err) {
      return console.error(err.message);

    }
  });

  db.all("SELECT name,time,date FROM tasks ORDER BY name", function(err, rows) {
    if (err) {
      return console.log(err.message);
    }
    else {
      // create new object grouping all tasks with same name using 'lospace groupBy'
      var grouped = groupBy(rows, 'name');

        // loop through each grouped-task object
        for (var key in grouped) {

          let taskTotal = 0;

          // loop through the values in each object, split the time instance hh:mm:ss
          // into 3 parts.
          for (var value of grouped[key]) {
            let splitTime = (value.time).split(":");
            // Multiply hours & minutes appropriately to find total seconds spent on task
            let taskSeconds = parseInt((splitTime[0] * 3600)) + parseInt((splitTime[1] * 60)) +
            parseInt(splitTime[2]);
            taskTotal += parseInt(taskSeconds);
          }

          // Turn total seconds in total hours spent, append to grouped task-name object
          let totalHours = ((taskTotal / 3600).toFixed(2));
          let hoursSplit = totalHours.split(".");
          let totalTime = hoursSplit[0] + "h " + Math.round((hoursSplit[1]/100) * 60) + "m";
          Object.assign(grouped[key], {total: totalTime});

        }
        // console.log(util.inspect(grouped));

      res.render('history',  { grouped: grouped });
      db.close();

    }

  });

})

/*
app.listen(3000, function () {
  console.log('Example app listening on port 3000!')
})
*/
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Our app is running on port ${ PORT }`);
});
