const app = require("express").Router();

const users = require("../Schemas/user");
const leave = require("../Schemas/leave");

app.get("/userInfo",async (req,res)=>{
try{
   let date = new Date();
   let monthYear = `${date.getMonth()}_${date.getFullYear()}`;

   let user = await users.findOne({id: req.$token.id});
   let json = {
      type: req.$token.type,
      name: user.name
   }

   if(req.$token.type == 2){
      let numLeaves = await leave.countDocuments({
         status: 1,
         monthYear
      });
      json.numLeaves = numLeaves;
   } else if(req.$token.type == 1){
      let numLeavesProcessed = await leave.countDocuments({
         actionBy: req.$token.id,
         monthYear
      });
   }
   res.json(json);
} catch(e){
   console.debug(e);
   res.sendStatus(500);
}  
});

app.use("/s",(req,res,next)=>{
   if(req.$token.type!=2) res.sendStatus(400);
   else next();
});

app.post("/s/applyForLeave",(req,res)=>{
   if(!req.body.subject || !req.body.desc)
      return res.status(400);
   
   console.log(req.body);

   leave.create({
      subject: req.body.subject,
      desc: req.body.desc,
      id: req.$token.id,
      ts: Date.now(),
      monthYear: `${new Date().getMonth()}_${new Date().getFullYear()}`
   })
   .then((doc)=>{
      res.sendStatus(200);
   })
   .catch((err)=>{
      console.debug(err);
      res.sendStatus(500);
   });
});

app.use("/f",(req,res,next)=>{
   if(req.$token.type!=1) res.sendStatus(400);
   else next();
});

module.exports = app;