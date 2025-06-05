const mongoose=require('mongoose')

const AdminSchema= new mongoose.Schema({
    username:{type:String,required: true,unique:true},
    email:{type:String,required: true,unique:true},
    password:{type:String,required: true},
    role:{type:String,enum:['cook','admin'],default:'admin'}
})
module.exports=mongoose.model('Admin',AdminSchema,'admin')