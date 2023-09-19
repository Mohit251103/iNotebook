const express=require('express')
const User = require('../models/User')
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const fetchuser=require('../middleware/fetchuser')

const router=express.Router()

const JWT_SECRET="IAMMOHITNEGI"

router.post('/createuser', [
    body('email').isEmail(),
    body('password').isLength({min:5}),
    body('name').isLength({min:3})
],async (req,res)=>{

    let success=true
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      success=false
      return res.status(400).json({ success,errors: errors.array() });
    }

    try{
    let user=await User.findOne({email:req.body.email})
    if(user){
      success=false
      return res.status(400).json({success,error:"Sorry a user with this email already exist "})
    }

    const salt = await bcrypt.genSaltSync(10);
    const secPass = await bcrypt.hashSync(req.body.password, salt);
    user = await User.create({
        email: req.body.email,
        password: secPass,
        name: req.body.name
      })

      const data={
        user:{
          id:user.id
        }
      }

      const authToken = jwt.sign(data,JWT_SECRET);
      
      res.json({success,authToken})
    }
    catch(error){
      console.log(error);
      res.status(500).send("Internal server error");
    }
})

//Authenticate a user using http://localhost:5000/api/auth/login

router.post('/login', [
  body('email','Enter a valid email').isEmail(),
  body('password','Password should be not blank').exists()
],async (req,res)=>{

  let success = true;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    success=false;
    return res.status(400).json({success, errors: errors.array() });
  }

  const {email,password} = req.body;

  try {
    let user = await User.findOne({email});
    if(!user){
      success=false;
      return res.status(400).json({success,error:"Please enter correct credentials"})
    }
    
    const passwordCompare = await bcrypt.compare(password,user.password);

    if(!passwordCompare){
      success=false;
      return res.status(400).json({success,error:"Please enter correct credentials"})
    }

    const data={
      user:{
        id:user.id
      }
    }

    const authToken = jwt.sign(data,JWT_SECRET);
    
    res.json({success,authToken})

  } catch(error){
    console.log(error.message);
    res.status(500).send("Internal server error");
  }

})

//Get logged in user details using POST "/api/auth/getuser".Login required
router.post('/getuser', fetchuser,async (req,res)=>{
try{
userId=req.user.id
const user=await User.findById(userId).select("-password");
res.send(user)
}
catch(error){
  console.log(error.message);
  res.status(500).send("Internal server error");
}
})

module.exports=router