const mongoose = require("mongoose");

mongoose.connect(process.$config.mongoUrl,{
   useNewUrlParser: true
});

let userSchema = new mongoose.Schema({
   id: {
      required: true,
      type: String,
      unique: true
   },
   password: {
      required: true,
      type: String
   },
   type: {
      type: Number,
      required: true
   }
});

/* type
0 - admin
1 - faculty
2 - student
*/

module.exports = mongoose.model("users",userSchema);