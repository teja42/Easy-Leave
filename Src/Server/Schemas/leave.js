const mongoose = require("mongoose");

mongoose.connect(process.$config.mongoUrl,{
   useNewUrlParser: true
});

let userSchema = new mongoose.Schema({
   id: {
      required: true,
      type: String
   },
   ts: {
      required: true,
      type: Number
   },
   title: {
      type: String,
      required: true
   },
   desc: {
      type: String,
      required: true
   }
});

/* type
0 - admin
1 - faculty
2 - student
*/

module.exports = mongoose.model("leave",userSchema);