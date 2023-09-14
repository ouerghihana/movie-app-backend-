const mongoose = require('mongoose');



const movieSchema=new mongoose.Schema({
    title:{
        type:String,
        required:true
    },
    description:{
        type:String,
        required:true
    },
    actors:[{type:String,
        required:true}],

    releaseDate:{
        type:String,
        required:true,
    },
    posterUrl:{
        type:String,
        required:true,
    },
    featured:{
        type:Boolean,
        required:true,
    },
    trailer: {
        type:String,
        required:true,
    },
    bookings:[{type:mongoose.Types.ObjectId,
        ref:'booking'}],

   
    admin:{
        type:mongoose.Types.ObjectId,
        ref:'Admin',
        required:true,

    }


})
module.exports = mongoose.model('Movie',movieSchema)