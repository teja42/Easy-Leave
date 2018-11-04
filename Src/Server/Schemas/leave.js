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
   monthYear: {
      type: String,
      required: true
   },
   subject: {
      type: String,
      required: true
   },
   fromDate: {
      required: true,
      type: String
   },
   toDate: {
      type: String,
      required: true
   },
   desc: {
      type: String,
      required: true
   },
   actionBy: {
      type: String
   },
   status: {
      type: Number,
      required: true,
      default: 0
   }
});

/* status
-1 - rejected
0  - pending
1  - approved
*/

module.exports = mongoose.model("leave",userSchema);