import mongoose from "mongoose";

const { Schema } = mongoose;

const userSchema = new Schema({
     username : {
          type : String,
          required : true,
          trim : true,
          minLength : 3
     },
     email : {
          type : String,
          required : true,
          unique : true,
          trim : true
     },
     password : {
          type : String,
          required : true,
          trim : true
     }
}, { timestamps : true });

const  User = mongoose.model("User", userSchema);

export default User;