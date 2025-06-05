const express=require('express');
const app=express();
const cors=require('cors');
const jwt=require('jsonwebtoken')
const SECRET_KEY = 'your_secret_key';
const User = require('../model/adminmodel')
const bcrypt=require('bcrypt')

app.use(express.json());
app.use(cors())












exports.register= async(req,res)=>{
    try{
      console.log('hi')
    const {email,password,username,role}=req.body;
    const exist=await User.findOne({email})
    if(exist){return res.status(400).json({Message:'Already Exist'})}
    const hashpassword =await bcrypt.hash(password,10) 
    const registered= new User({email,username,role,password:hashpassword})
    await registered.save()
    res.status(200).json({Message:'Sucessfully Register'})
    }
    catch(err){res.status(503).json({Message:'Server error',err})

    }
}








exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Invalid email ' });
    }

    // Compare password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid  password' });
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: user._id },
      SECRET_KEY,
      { expiresIn: '1h' }
    );

    // Respond with token and user info
    return res.status(200).json({
      token,
      user: {
        userId: user._id,
        username: user.username,
        email: user.email,
        roll: user.role
      }
    });
  } catch (err) {
    console.error('Login error:', err);
    return res.status(500).json({ message: 'Server error. Please try again.' });
  }
};
