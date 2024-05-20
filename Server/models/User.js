const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const userSchema = new Schema({
    username: { type: String, required: true },

    roles: [{
        type:String, 
        default:"Employee",
      }],

    password:{
      type:String, 
      required:true
    },

    active: {
        type:Boolean,
        default:true
    }

});


const User = mongoose.model('User', userSchema);

module.exports = User