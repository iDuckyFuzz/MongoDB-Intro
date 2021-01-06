const express = require('express');
const mongoose = require('mongoose');
const app = express();
const port = 5000;
const path = require('path');
const hbs = require('hbs');
require('dotenv').config();
const User = require('./models/user');
const Blog = require('./models/blog');
const auth = require('./middlewares/auth');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');

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
app.use(cookieParser());

//setting the views from hbs to come from our views path variable
app.set('views', viewsPath);
//set the view engine to hbs
app.set('view engine', 'hbs');
//set express to use the static files
app.use(express.static(publicDirectory));

app.get('/', async (req, res) => {

    const users = await User.find();
    res.render("index", {
        users: users
    });
});

app.get('/register', (req, res) => {
    res.render("register");
});

//we can add a middleware function
app.get('/profile/:id', auth.isLoggedIn, async (req, res) => {

    console.log(req.user.name);
    //could use a try catch here 
    const user = await User.findById(req.params.id);
    // we can get extra details using populate
    const name = await Blog.find({ user: req.params.id }).populate('user', 'name email password');
    const allPosts = await Blog.find({ user: req.params.id });
    res.render("profile", {
        id: user._id,
        name: user.name,
        email: user.email,
        password: user.password,
        allPosts: allPosts
    });
});

app.get('/profile/update/:id', async (req, res) => {
    //could use a try catch if the user doesn't exist
    const userName = "Jill";
    const userEmail = "Jill@gmail.com";

    await User.findByIdAndUpdate(req.params.id, {
        name: userName,
        email: userEmail
    })

    res.send("Update Succesful!");
});


app.post('/delete/:id', async (req, res) => {
    //could use a try catch if the user doesn't exist
    await User.findByIdAndDelete(req.params.id)
    res.send("Delete Succesful!");
});


app.get('/blogpost/:id', (req, res) => {
    res.render("blogPost", {
        id: req.params.id
    });
});

app.post('/blogpost/:id', async (req, res) => {
    await Blog.create({
        user: req.params.id,
        title: req.body.title,
        body: req.body.body,
    })

    res.send("Post Succesful")
});



app.get('/login', (req, res) => {
    res.render("login");
});

app.post('/login', async (req, res) => {
    //add bycrypt compare of provided user & password
    try {
        const user = await User.findOne({ name: req.body.userName })
        const isMatch = await bcrypt.compare(req.body.pword, user.password)

        if (isMatch) {
            // create a token to sign to authenticate
            const token = jwt.sign({id: user._id}, process.env.JWT_SECRET, {
                expiresIn: process.env.JWT_EXPIRES_IN,
            });
            const cookieOptions = {
                expires: new Date(
                    Date.now() + process.env.JWT_COOKIE_EXPIRES * 24 * 60 * 60 * 1000
                ),
                httpOnly:true
            }
            res.cookie('jwt', token, cookieOptions);
            res.render("index", {
                message: "Succesfully Logged in!"
            })
        } else {
            const error = "login failed";
            res.render("login", {
                error: error
            });
        }
    } catch (err) {
        const error = "login failed";
        res.render("login", {
            error: error
        });
    }
});

app.post('/register', async (req, res) => {

    //hash the password
    let hashedPassword = await bcrypt.hash(req.body.pword, 8);
    await User.create({
        name: req.body.userName,
        email: req.body.userEmail,
        password: hashedPassword
    })

    res.send("User registered");
});

app.get('*', (req, res) => {
    res.render("pageNotFound");
});

app.listen(port, () => {
    console.log(`Listening to port ${port}`);
});