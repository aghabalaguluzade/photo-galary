import User from "../models/userModel.js";
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken";

const createUser = async (req,res) => {
     try {
          const user = await User.create(req.body);
          res.status(201).json({ user : user._id });
     } catch (error) {

          let errors = {}

          if(error.code === 11000) {
               errors.email = "The Email is already registered";
          }

          if(error.name === "ValidationError") {
               Object.keys(error.errors).forEach((key) => {
                    errors[key] = error.errors[key].message;
               });
          };
          res.status(400).json(errors);
     };
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

          const token = createToken(user._id);

          res.cookie("jsonwebtoken",token,{
               httpOnly : true,
               maxAge : 1000 * 60 * 60 * 24
          });

          res.redirect("/users/dashboard");
     }else {
          res.status(401).json({
               succeded : false,
               error : "Password are not matched"
          });
     }
};

const createToken = (userId) => {
     return jwt.sign({userId},process.env.JWT_SECRET,{
          expiresIn : "1d"
     });
};

const getDashboardPage = (req,res) => {
     res.render("dashboard",{
          link : "dashboard"
     });
}

export {
     createUser,
     loginUser,
     getDashboardPage
}