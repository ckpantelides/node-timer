const express = require('express');
const bodyParser = require('body-parser');
const request = require('request');
const app = express();

// make static files available i.e. css
app.use(express.static('public'));

// serves all requests which includes /images in the url from the images folder
app.use('/images', express.static(__dirname + '/Images'));

app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'ejs');

// respond with "hello world" when a GET request is made to the homepage
app.get('/', function (req, res) {
  res.render('index');
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
