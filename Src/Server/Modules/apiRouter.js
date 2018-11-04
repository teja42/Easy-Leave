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
   }
   res.json(json);
} catch(e){
   console.debug(e);
   res.sendStatus(500);
}  
});

app.use("/s",(req,res,next)=>{
   if(req.$token.type!=2) res.sendStatus(401);
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

app.post("/s/leaveHistory",(req,res)=>{
   if(!req.body.numResults)
      return res.sendStatus(400);

   leave
   .find({id: req.$token.id})
   .limit(parseInt(req.body.numResults))
   .then((docs)=>{
      res.json(docs);
   })
   .catch((err)=>{
      console.debug(err);
      res.sendStatus(500);
   });
});

app.use("/f",(req,res,next)=>{
   if(req.$token.type!=1) res.sendStatus(401);
   else next();
});

app.post('/f/pendingApproval',async (req,res)=>{
   let pages;
   try{
      pages = await leave.countDocuments({status: 0});
   }catch(e){
      return res.sendStatus(500);
   }

   leave
   .find({status: 0})
   .limit(10)
   .skip(10*(req.body.page-1))
   .then((docs)=>{
      let obj = {
         pages,
         docs
      };
      res.json(obj);
   })
   .catch((err)=>{
      console.debug(err);
      res.sendStatus(500);
   });
});

app.post('/f/updateLeaveRequest',(req,res)=>{
   if(!req.body.approve || !req.body._id)
      return res.sendStatus(400);

   leave
   .updateOne({_id: req.body._id},{status: req.body.approve?1:-1})
   .then((resp)=>{
      res.sendStatus(200);
   })
   .catch((err)=>{
      console.debug(err);
      res.sendStatus(500);
   });
});

module.exports = app;