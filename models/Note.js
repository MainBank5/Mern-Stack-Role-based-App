const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const AutoIncrement = require('mongoose-sequence')(mongoose)

const noteSchema = new Schema({
    user: { 
        type: mongoose.Schema.Types.ObjectId,  //datatype is an objectid from a schema 
        required: true,
        ref: 'User'
    },

    text: {
        type:String, 
        required:true
      },

    title:{
      type:String, 
      required:true
    },

    completed: {
        type:Boolean,
        default:false
    }

}, {timestamps:true});

noteSchema.plugin(AutoIncrement, {
    inc_field:'ticket',
    id:'ticketNumber',
    start_seq:500
})

const Note = mongoose.model('Note', noteSchema);

module.exports = Note