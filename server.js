const express = require('express');
const mongoose = require('mongoose');
const app = express();
const port = 5000;
const path = require('path');
const hbs = require('hbs');

//get the folder directory
const viewsPath = path.join(__dirname, '/views');
const publicDirectory = path.join(__dirname, '/public');

// set the path for the inc files (partials)
const partialPath = path.join(__dirname, '/views/inc');
hbs.registerPartials(partialPath);

//set express to use the static files
app.use(express.static(publicDirectory));

//set the view engine to hbs
app.set('view engine', 'hbs');

//setting the views from hbs to come from our views path variable
app.set('views', viewsPath);

//body parser?
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

//set express to use the static files
app.use(express.static(publicDirectory));

//set the view engine to hbs
app.set('view engine', 'hbs');

//setting the views from hbs to come from our views path variable
app.set('views', viewsPath);

app.get('/', function (req, res) {
    res.send("Home Page");
});

app.get('*', function (req, res) {
    res.send("Page not found.");
});

app.listen(port, () => {
    console.log(`Listening to port ${port}`);
});