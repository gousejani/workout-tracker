const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    date:{type:Date,default:Date.now},
    email:{type:String,required:true},
    Name:{type:String,required:true},
    password:{type:String,required:true},
    age:{type:String},
    weight:{type:Object},
    height:{type:String},
    activity:{type:Object}
});

let User = mongoose.model('User',userSchema);

module.exports = User;