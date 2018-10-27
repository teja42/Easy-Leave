const app = require("express").Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const users = require("../Schemas/user");

app.use((req,res,next)=>{
   if(!req.body.id || !req.body.password ) return res.sendStatus(400);
   req.body.id = req.body.id.toLowerCase();
   next();
})

app.post("/register",(req,res)=>{

   if(!req.body.name) return res.sendStatus(400);

   bcrypt.hash(req.body.password,14)
   .then((hash)=>{
      return users.create({
         id: req.body.id,
         password: hash,
         name: req.body.name,
         type: 2
      });
   })
   .then((err)=>{
      res.sendStatus(200);
   })
   .catch((err)=>{
      console.log(err);
      if(err.code == 11000) res.status(400).send("This id is already registered.");
      else res.sendStatus(500);
   });
});

app.post("/login",(req,res)=>{
   let userDoc;

   users.findOne({id: req.body.id})
   .then((doc)=>{
      userDoc = doc;
      if(!doc) return res.sendStatus(401);
      return bcrypt.compare(req.body.password,doc.password);
   })
   .then((valid)=>{

      if(!valid) return new Promise.reject();

      let payload = {
         id: userDoc.id,
         exp: Math.floor(Date.now() / 1000) + (2* 60 * 60)
      };
      payload = JSON.stringify(payload);
      jwt.sign(payload,process.$config.jwtSecret,
         (err,token)=>{
            if(err){
               console.debug(err);
               return res.sendStatus(500);
            }
            res.cookie("auth",token);
            res.redirect('/home');
      });
   })
   .catch((err)=>{
      res.sendStatus(401);
   });
});

module.exports = app;