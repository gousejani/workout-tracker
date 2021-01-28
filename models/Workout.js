const mongoose = require('mongoose');

const workoutSchema = mongoose.Schema({
    date:{type:Date,default:Date.now},
    email:{type:String,required:true},
    activity:{type:String,required:true},
    category:{type:String},
    type:{type:String},
    weight:{type:String},
    reps:{type:String},
    duration:{type:String},
    distance:{type:String}
});

let Workout = mongoose.model('Workout',workoutSchema);

module.exports = Workout;