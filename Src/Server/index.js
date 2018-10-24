const express = require("express");
const path = require("path");

const BASE_DIR = path.join(__dirname+"/../");

let app = express();

app.use("/static",express.static(BASE_DIR+"/Static"));

app.get("/",(req,res)=>{
   res.sendFile(BASE_DIR+"/UI/index.html");
});

app.listen(3000,()=>console.log("Server Online"));