const express= require('express')
const passport = require('passport');
const session = require('express-session');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
require('dotenv').config();
const app = express();
const cors = require('cors');
const cookieParser = require('cookie-parser');
const path = require('path');

app.use(express.json());

//Connect to db
mongoose.connect(process.env.MONGO_URI,{ useNewUrlParser: true, useUnifiedTopology: true })
.then(()=>console.log("Connected to MongoDB..."))
.catch(err=>console.log(err));

// Passort Config
require('./config/passport')(passport);

// Cookie parser
app.use(cookieParser());
app.use(
    cors({
      origin: "http://localhost:3000", // <-- location of the react app were connecting to
      credentials: true,
    })
  );

// Body Parser middleware - parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
// parse application/json
app.use(bodyParser.json())
// Express Session
app.use(session({
    secret: 'keyboard cat',
    resave: true,
    saveUninitialized: true
  }));

//   Passport middle ware, should be placed after session
app.use(passport.initialize());
app.use(passport.session());


// Routes
const users = require('./routes/users');
app.use('/api/users',users);

const workouts = require('./routes/workouts');
app.use('/api/workouts', workouts);


if(process.env.NODE_ENV==='production'){
  app.use(express.static('client/build'));
  app.get('*',(req,res)=>{
    res.sendFile(path.join(__dirname,'client','build','index.html'));
  });
}
// Listen

const PORT = process.env.PORT||5000;
app.listen(PORT,console.log(`Server started on PORT ${PORT}`))