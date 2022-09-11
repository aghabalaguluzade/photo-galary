import User from "../models/userModel.js";
import jwt from "jsonwebtoken";

const checkUser = async (req,res,next) => {
     
     const token = req.cookies.jsonwebtoken;

     if(token) {
          jwt.verify(token, process.env.JWT_SECRET, async (err,decodeToken) => {
               if(err) {
                    res.locals.user = null;
                    next();
               }else {
                    const user = await User.findById(decodeToken.userId);
                    res.locals.user = user;
                    next();
               };
          });
     }else {
          res.locals.user = null;
          next();
     };
}

const authenticateToken = async (req,res,next) => {
     
     try {

          const token = req.cookies.jsonwebtoken;
          
          if(token) {
               jwt.verify(token, process.env.JWT_SECRET, (err) => {
                    if(err) {
                         res.redirect("/login");
                    }else {
                         next();
                    }
               });
          }else {
               res.redirect("/login");
          };
     } catch (error) {
          res.status(401).json({
               succeded : false,
               error : "Not authorized"
          });
     };
};

export {
     authenticateToken,
     checkUser
}