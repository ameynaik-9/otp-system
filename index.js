require("dotenv").config();
const express = require('express');
const bodyParser = require('body-parser');
const exphbs = require('express-handlebars');
const path = require('path');
const nodemailer = require('nodemailer')

// const gmail=process.env.E_MAIL;
// const pass=process.env.PASS_WORD;

const app = express();
// View Engine Setup
app.engine('handlebars', exphbs.engine());
app.set('view engine', 'handlebars');
app.set('views', './views')
 
var otp;
// Static Folder
app.use(express.static('./public'))

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.get('/', (req, res) => {
    res.render('contact');
    // {
    //     remail:req.body.email
    // }

})

//Routes
app.post('/send', (req, res) => {
    otp = Math.floor(Math.random() * 1000000);
    console.log(otp)
    // Nodemailer Driver Code
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.E_MAIL,
            pass: process.env.PASS_WORD
        }
    });

    const mailOptions = {
        from: process.env.E_MAIL,
        to: req.body.email,
        subject: 'Node Mailer Testing',
        html: `
        <p>You Have a new contact request</p>
        <h3>Contact Details</h3>
        <ul>
        <li>Name: ${req.body.name}</li>
        <li>Company: ${req.body.company}</li>
        <li>Email: ${req.body.email}</li>
        <li>Phone: ${req.body.phone}</li>
        </ul>
        <h2>Here's your Otp!!!!!</h2>
        <h1>${otp}</h1>
        `
    };
    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            console.log(error);
        } else {
            console.log('Email sent');
            res.render('verotp')
        }
    });

})
app.post('/otp', (req, res) => {
    res.render("verotp");
    if (req.body.otp === otp.toString()) {
        res.redirect('https://github.com/ameynaik-9')
    }
    else {
        res.send("Sorry")
    }
})
app.listen(process.env.PORT, () => console.log("Server Started")) 
