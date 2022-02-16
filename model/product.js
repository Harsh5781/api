const mongoose = require('mongoose')
const {Schema} = mongoose

const productSchema = new Schema({
    name:{
        type:String,
        required:true
    },
    description:{
        type:String,
        required:true
    },
    price:{
        type:Number,
        required:true
    }, 
    image:{
        type:String,
        required:true
    },
    user:{
        type:Schema.Types.ObjectId,
        ref:'User'
    }
})

module.exports= mongoose.model('Product', productSchema)