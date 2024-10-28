const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const User = require('./models/user');
const cors = require('cors')
const session = require('express-session')
const store = require('connect-mongo')

require('dotenv').config();

const app = express();
const userRoutes = require('./routes/users');
const ctfRoutes = require('./routes/ctf');

app.use(express.static("public"));

const uri = 'mongodb+srv://ctfx-amchk:5VjptBvNEaoU13vT@cluster0.jap7a.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';
mongoose.connect(uri);
process.on('SIGINT', async () => {
  await mongoose.connection.close();

  console.log('Mongoose connection is disconnected due to application termination');
  process.exit(0);
});


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(cors());

app.use(session({
    secret: 'hehe',
    resave: false,
    saveUninitialized: false,
    store: store.create({
      mongoUrl: uri,
      collectionName: 'sessions'
    }),
    cookie: {
      maxAge: 1000 * 60 * 60 * 24 
    }
  }));
  

function isAuthenticated(req, res, next){
    if (req.session.user) {
      return next();
    }
    res.redirect('/users/login');
}

app.set('view engine','ejs');

app.use('/users',userRoutes);
app.use('/ctf',ctfRoutes);

app.get('/',(req,res)=>{
    let logout = false;

    if(req.session.user){
        logout=true;
    }
    res.render('home',{logout: logout});
})


app.get("/profile",isAuthenticated,async(req,res)=>{
    
    let user = await User.findById(req.session.user);
    res.render('profile',{user: user,logout:true});
})

app.listen(process.env.PORT || 80,()=>{
    console.log("Serving");
})