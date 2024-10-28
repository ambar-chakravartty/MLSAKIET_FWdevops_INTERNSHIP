const express = require('express');
const bodyParser = require('body-parser');
const router = express.Router();
const Level = require('../models/level');
const User = require('../models/user');

function isAuthenticated(req, res, next){
    if (req.session.user) {
      return next();
    }
    res.redirect('/users/login');
}

router.get('/challenges',isAuthenticated,async (req,res)=>{
    const challs = await Level.find();
    const user = await User.findOne({_id: req.session.user});
    let list = [];

    challs.forEach(chall => {
        if(!user.solved.includes(chall._id)){
            list.push(chall);
        }
    })
    res.render('challs',{rows: list,logout: true});
});

router.get('/chall/:id',isAuthenticated,async (req,res)=>{
    const chall = await Level.findOne({_id: req.params.id});

    res.render('chall',{chall: chall,logout: true});
});

router.post('/chall/:id',isAuthenticated,async (req,res)=>{
    const flag = req.body.ans;
    const chall = await Level.findOne({_id: req.params.id});

    

    if(flag == chall.flag){
        let user = await User.findById(req.session.user);
        user.score += 10;
        user.solved.push(req.params.id);
        await user.save();      

    }

    res.redirect('/ctf/challenges');
})

router.get('/add-chall',isAuthenticated,(req,res)=>{
    
    res.render('add-chall',{logout: true});
})

router.post('/add-chall',isAuthenticated,async (req,res)=>{
    const {name,question,flag} = req.body;

    try{
        const chall = new Level({
            name: name,
            question: question,
            flag: flag
        });
        await chall.save();

    }catch(err){
        console.log(err);
        res.status(400).send('Error adding challenge');
    }

    res.redirect('/ctf/challenges');
})

router.get('/leaderboard',async(req,res)=>{
    try {
        const users = await User.find().sort({'score' : 'desc'}).exec();
        res.render('leaderboard',{rows: users,logout:true});

    }catch(e){
        console.log(e);
        res.status(400).send('error fetching users');
    }

    
});

module.exports = router;