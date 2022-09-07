import mongoose from "mongoose";
import bcrypt, { hash } from "bcrypt";

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

userSchema.pre("save", function(next) {
     const user = this;
     bcrypt.hash(user.password, 10, (err,hash) => {
          user.password = hash;
          next();
     });
});

const  User = mongoose.model("User", userSchema);

export default User;