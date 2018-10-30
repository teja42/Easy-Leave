const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");

process.$config = {
   baseDir : path.join(__dirname+"/../"),
   mongoUrl : "mongodb://server:server_confidential@localhost:27017/EasyLeave",
   jwtSecret: "lakfnoirnf23r19rj90"
};

const authHandler = require("./Modules/authHandler");
const users = require("./Schemas/user");

let app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
   extended: false
}));
app.use(cookieParser());

app.use("/static",express.static(process.$config.baseDir+"/Static"));

app.get("/",(req,res)=>{
   res.sendFile(process.$config.baseDir+"/UI/index.html");
});

app.use('/auth',authHandler);

app.use((req,res,next)=>{
   jwt.verify(req.cookies.auth,process.$config.jwtSecret,(err,decoded)=>{
      if(err) res.sendStatus(401);
      else{
         req.$token = decoded;
         next();
      }
   });
});

app.get("/home",(req,res)=>{
   res.sendFile(process.$config.baseDir+"/UI/home.html");
});

app.listen(3000,()=>console.log("Server Online"));