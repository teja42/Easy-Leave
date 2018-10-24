const app = require("express").Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const users = require("../Schemas/user");

app.use((req,res,next)=>{
   if(!req.body.id || !req.body.password ) return res.sendStatus(400);
   req.body.id = req.body.id.toLowerCase();
   next();
})

app.get("/register",(req,res)=>{

   bcrypt.hash(req.body.password,14)
   .then((hash)=>{
      return users.create({
         id: req.body.id,
         password: hash,
         type: 2
      });
   })
   .then((err)=>{
      res.sendStatus(200);
   })
   .catch((err)=>{
      res.sendStatus(500);
   });
});

app.get("/login",(req,res)=>{
   let userDoc;

   users.findOne({id: req.body.id})
   .then((doc)=>{
      userDoc = doc;
      if(!doc) return res.sendStatus(401);
      return bcrypt.compare(req.body.password,doc.password)
   })
   .then((valid)=>{
      let payload = {
         id: userDoc.id
      };
      payload = JSON.stringify(payload);
      jwt.sign(payload,process.$config.jwtSecret,{
         expiresIn: "2h"
      },(err,token)=>{
         if(err) return res.sendStatus(500);
         res.cookie("auth",token);
         res.redirect('/home');
      });
   })
   .catch((err)=>{
      console.debug(err);
      res.sendStatus(500);
   });
});

module.exports = app;