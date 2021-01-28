const express = require('express');
const router = express.Router();
const Workout = require('../models/Workout');
const { body, validationResult } = require('express-validator');
const querystring = require('querystring');

router.post('/new',
    // validate user input
    body('activity').notEmpty(),
    (req,res)=>{
        // if (!req.cookies.token) return res.status(401).send("not authenticated");
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({errors: errors.array()});
        }else{
            const newWorkout = new Workout({
                activity:req.body.activity,
                email:req.body.email
            });
            newWorkout.save((err,workout)=>{
                res.status(200).json(workout);
            });
        }
});

// router.get('/',(req,res)=>{
//     var d = new Date(req.query.date);
//     const query = {"date" : 
//         {
//             "$gte" : new Date(d), 
//             "$lt" : new Date(d.setDate(d.getDate() + 1)) 
//         }
//     } 
//     Workout.find(query,(err,data)=>{
//         res.json(data)
//     });
// });


router.get('/',(req,res)=>{
    if (!req.cookies.token) return res.status(401).send("not valid");
    var d = new Date(req.query.date);
    const query = {$and:[
        {"date" : 
            {
                "$gte" : new Date(d), 
                "$lt" : new Date(d.setDate(d.getDate() + 1)) 
            }
        },
        {"email":req.cookies.user.email}
        ]
    }
    Workout.find(query,(err,data)=>{
        res.json(data)
    });
});

module.exports = router;
