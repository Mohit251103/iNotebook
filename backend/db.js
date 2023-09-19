const mongoose=require('mongoose')
const mongoURI='mongodb://127.0.0.1/inotebook'

const connectToMongoose=()=>{
    mongoose.connect(mongoURI)
}

module.exports=connectToMongoose