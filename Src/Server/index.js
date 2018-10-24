const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");

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

app.use("/static",express.static(process.$config.baseDir+"/Static"));

app.get("/",(req,res)=>{
   res.sendFile(process.$config.baseDir+"/UI/index.html");
});

app.get('/auth',authHandler);

app.listen(3000,()=>console.log("Server Online"));