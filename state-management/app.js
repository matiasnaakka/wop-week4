'use strict';
const express = require('express');
const expressSession = require('express-session');
const cookieParser = require('cookie-parser');

const port = 3000;

const loggedIn = (req, res, next) => {
    if (req.user) {
        next();
    } else {
        res.redirect('/form');
    }
};

const username = 'foo';
const password = 'bar';
const oneDay = 24 * 60 * 60 * 1000;
const secret = "asdasdasd-a-sdasdasd--asdasdasd-asd";


const app = express();
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(cookieParser());
app.use(expressSession({
    secret,
    saveUninitialized: true,
    cookie: {maxAge: oneDay},
    resave: false
}));


app.set('views', './views');
app.set('view engine', 'pug');

app.get('/form', (req, res) => {
    res.render('form.pug');
});

app.get('/secret', (req, res) => {
    if (req.session.logged !== true) {
        res.redirect("/form");
    } else {
        res.render('secret.pug');
    }
})

app.post('/login', (req, res) => {
    const body = req.body
    if (body.username === username && body.password === password) {
        req.session.logged = true;
        res.redirect("/secret");
    } else {
        req.session.logged = false;
        res.redirect("/form");
    }
})


app.get('/logout', (req, res) => {
    req.logout(() => {
        res.redirect('/');
    });
});

app.get('/', (req, res) => {
    res.render('home');
});

app.get("/setCookie/:clr", (req, res) => {
    res.cookie("color", req.params.clr).send("eväste asetettu");
});

app.get("/getCookie", (req, res) => {
    res.send("color evästeessä lukee " + req.cookies.color);
});

app.get("/deleteCookie", (req, res) => {
    res.clearCookie("color");
    res.send("eväste poistettu");
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
