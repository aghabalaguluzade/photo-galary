import User from "../models/userModel.js";
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken";
import Photo from "../models/photoModel.js";

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

const getDashboardPage = async (req,res) => {
     const photos = await Photo.find({ user : res.locals.user._id });
     const user = await User.findById({ _id : res.locals.user._id }).populate(["followers","followings"]);

     res.render("dashboard",{
          photos,
          user,
          link : "dashboard",
     });
};

const getAllUsers = async (req,res) => {
     try {
          const users = await User.find({ _id : { $ne : res.locals.user._id } });
          res.status(200).render("users",{
               users,
               link : "users"
          });
     } catch (error) {
          res.status(500).json({
               succeded : false,
               error
          });
     };
}

const getUser = async (req,res) => {
     try {
          const user = await User.findById({ _id : req.params.id });
          const photos = await Photo.find({ user : user._id });
          const inFollowers = user.followers.some((follower) => {
               return follower.equals(res.locals.user._id)
          });
          res.status(200).render("user", {
               user,
               photos,
               inFollowers,
               link : "users"
          });
     } catch (error) {
          res.status(500).json({
               succeded : false,
               error
          });  
     };
};

const follow = async (req,res) => {
     try {
          let user = await User.findByIdAndUpdate(
               { _id : req.params.id },
               { $push : { followers : res.locals.user._id } },
               { new : true }
               );

               user = await User.findByIdAndUpdate(
                    { _id : res.locals.user._id },
                    { $push : { followings : req.params.id } },
                    { new : true }
               );

               res.status(200).redirect("back");

     } catch (error) {
          res.status(500).json({
               succeded : false,
               error
          });
     };
};

const unfollow = async (req,res) => {
     try {
          let user = await User.findByIdAndUpdate(
               { _id : req.params.id },
               { $pull : { followers : res.locals.user._id } },
               { new : true }
          );
     
          user = await User.findByIdAndUpdate(
               { _id : res.locals.user._id },
               { $pull : { followings : req.params.id } },
               { new : true }
          );

          res.status(200).redirect("back");

     } catch (error) {
          res.status(500).json({
               succeded : false,
               error
          });
     }
};

export {
     createUser,
     loginUser,
     getDashboardPage,
     getAllUsers,
     getUser,
     follow,
     unfollow
};