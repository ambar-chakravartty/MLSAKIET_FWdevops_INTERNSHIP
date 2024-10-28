const express = require('express');
const User = require('../models/user');
const router = express.Router();
const bcrypt = require('bcrypt');
const bodyParser = require('body-parser');

router.use(bodyParser.urlencoded({extended: true}));  


function isAuthenticated(req, res, next){
  if (req.session.user) {
    return next();
  }
  res.redirect('/users/login');
}

router.get('/login',(req,res)=>{
    if(req.session.user){
      res.redirect('/')
    }
    res.render('login',{logout: false});
});

router.get('/register',(req,res)=>{
    res.render('register',{logout: false});
});

router.post('/register',async (req,res)=>{
    const {email,username,password} = req.body;
    console.log(req.body);

    try{
        let user = await User.findOne({ email: email });
        if(user){
            return res.status(400).json({msg: 'This user already exists. Try again.'});
        }  
        
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password,salt);

        user = new User({
            username: username,
            email: email,
            password: hashedPassword,
            score: 0
        });

        await user.save();

    }catch(err){
        console.log(err);
        res.status(400).send('Server error');
    }

    res.redirect('/users/login');


});

router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await User.findOne({ username });
    if (user && await bcrypt.compare(password,user.password)) {
      req.session.user = user._id;
      res.redirect('/');
    } else {
      res.status(400).send('Invalid credentials');
    }
  } catch (error) {
    console.log(error);
    res.status(400).send('Error logging in');
  }
});


router.get('/logout', (req, res) => {
  
  req.session.destroy(err => {
    if (err) {
      return res.status(500).send('Error logging out');
    }
    res.clearCookie('connect.sid'); 
    res.redirect('/users/login');
  });
});


  
module.exports = router;