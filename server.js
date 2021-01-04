const express = require('express');
const mongoose = require('mongoose');
const app = express();
const port = 5000;
const path = require('path');
const hbs = require('hbs');
require('dotenv').config();

//connect to mongodb database
mongoose.connect(process.env.DB_URL, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true
}).then(() => console.log("MongoDB is connected!"))

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

app.use(express.urlencoded({ extended: false }));
app.use(express.json({ extended: false }));

//setting the views from hbs to come from our views path variable
app.set('views', viewsPath);
//set the view engine to hbs
app.set('view engine', 'hbs');
//set express to use the static files
app.use(express.static(publicDirectory));

app.get('/', (req, res) => {
    res.render("index");
});

app.get('/register', (req, res) => {
    res.render("register");
});

app.post('/register', (req, res)=>  {
    console.log(req.body)
    res.render("register");
});

app.get('*', (req, res) => {
    res.render("pageNotFound");
});

app.listen(port, () => {
    console.log(`Listening to port ${port}`);
});