const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const userSchema = new Schema({
    username: { type: String, required: true },

    roles: {
      User: {type:Number, default:2001},
      Editor:Number,
      Admin:Number
    },

    password:{
      type:String, 
      required:true
    },

    active: {
        type:Boolean,
        default:true
    },
    refreshToken:String

}, {timestamps:true});


const User = mongoose.model('User', userSchema);

module.exports = User