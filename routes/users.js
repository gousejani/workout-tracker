const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const { body, validationResult } = require('express-validator');
const passport = require('passport');
const jwt = require('jsonwebtoken')


router.post('/login',passport.authenticate('local'),(req,res)=>{
    jwt.sign({user:req.user},'secretKey',(err,token)=>{
        res.cookie('token', token, { httpOnly: true })
        res.cookie('user',req.user, { httpOnly: true })
        res.status(200).json(req.user);
    });
});

router.get('/loggedin',(req,res)=>{
    if (!req.cookies.token) return res.status(401).send("not valid");
    res.status(200).json({
      login:true,
      user:req.cookies.user
    });
  });

router.get('/logout', (req, res)=>{ 
    //it will clear the userData cookie 
    res.clearCookie('token');
    res.clearCookie('user'); 
    res.send('user logout successfully');
}); 
router.post('/register',
    // validate user input
    body('email').isEmail(),
    // body('username').isAlphanumeric(),
    body('name').isLength({ min: 1}),
    body('password').isLength({ min: 5}),
    // body('password2').custom((value,{req})=>{
    //     if(value!==req.body.password){
    //         throw new Error('Passwords do not match');
    //     }
    //     return true;
    // }),
    body('email').custom(value=>{
        return User.findOne({email:value}).then(user => {
            if (user) {
              return Promise.reject('E-mail already in use');
            }
        });
    }),
    (req,res)=>{
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({errors: errors.array()});
        }else{
            bcrypt.genSalt(10, (err, salt)=> {
                bcrypt.hash(req.body.password, salt, (err, hash)=> {
                    const newUser = new User({
                        email:req.body.email,
                        name:req.body.name,
                        password:hash
                    });
                    newUser.save((err,createdUser)=>{
                        if(err) throw err;
                        res.status(200).json(createdUser);
                    });
                });
            });
        }
});


module.exports = router;