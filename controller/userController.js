import User from "../models/userModel.js";
import bcrypt from "bcrypt"

const createUser = async (req,res) => {
     try {
          const user = await User.create(req.body);
          res.status(201).json({
               succeded : true,
               user
          });
     } catch (error) {
          res.status(500).json({
               succeded : false,
               error
          });
     }
};

const loginUser = async (req,res) => {
     
     const { email, password } = req.body;
     const user = await User.findOne({email});
     let same = false;

     if(user) {
          same = await bcrypt.compare(password, user.password);
     }else {
          return res.status(401).json({
               succeded : false,
               error : "There is no such user"
          });
     };

     if(same) {
          res.status(200).send("You are logged in");
     }else {
          res.status(401).json({
               succeded : false,
               error : "Password are not matched"
          });
     }
};

export {
     createUser,
     loginUser
}