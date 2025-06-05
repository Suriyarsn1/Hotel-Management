const express=require('express');
const app=express();
const cors=require('cors');
const path =require('path')
const mongoose=require('mongoose')
const roots=require('./roots/root')
const dotenv =require ('dotenv');

dotenv.config();


const allowedOrigins = [
  'http://localhost:3000',
  process.env.CLIENT_URL
].filter(Boolean);

const corsOptions = {
  origin: allowedOrigins,
  methods: "GET,PATCH,PUT,DELETE,POST,HEAD"
};

app.use(express.json());
app.use(cors())
app.use('/productlist/uploads',express.static(path.join(__dirname,'/productlist/uploads')))



    
app.use('/api',roots)    
    console.log(process.env.MONGODB_URI)
mongoose.connect(
    process.env.MONGODB_URI
).then(()=>{console.log('db Connected')}).catch(()=>{console.log('not connected')})

app.listen(5000,()=>console.log(`Server has started`))