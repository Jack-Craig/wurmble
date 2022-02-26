require('dotenv').config()
const express = require('express')
const { engine } = require('express-handlebars')

const port = process.env.PORT || '8080'

const app = express()

app.use((req, res, next) => {
    // The 'x-forwarded-proto' check is for Heroku
    if (!req.secure && req.get('x-forwarded-proto') !== 'https' && process.env.NODE_ENV !== "development") {
        return res.redirect('https://' + req.get('host') + req.url);
    }
    next();
});

app.use(express.static(__dirname + '/public', { maxAge: process.env.NODE_ENV === "development" ? '0' : '60000' }))

app.engine('hbs', engine({
    layoutsDir: __dirname + '/views/layouts',
    partialsDir: __dirname + '/views/partials/',
    extname: '.hbs',
    defaultLayout: 'index',
    helpers: {
        range: (a) => {
            b = []
            for (let i = 0; i < a; i++) {
                b.push(i)
            }
            return b
        }
    }
}));

app.set('view engine', 'hbs')

app.use('/', require('./routes/home'))

app.listen(port, () => console.log('App listening on port ' + port))