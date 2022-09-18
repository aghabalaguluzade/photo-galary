import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import methodOverride from "method-override";
import fileUpload from "express-fileupload";
import { v2 as cloudinary } from "cloudinary";
import conn from './db.js';
import pageRoute from "./routes/pageRouter.js";
import photoRoute from "./routes/photoRouter.js";
import userRoute from "./routes/userRouter.js";
import { checkUser } from "./middleware/authMiddleware.js";

dotenv.config();

cloudinary.config({
     cloud_name : process.env.CLOUD_NAME,
     api_key : process.env.API_KEY,
     api_secret : process.env.API_SECRET,
     secure : true
});

//connection to the DB
conn();

//PORT
const port = process.env.PORT;

const app = express();

//ejs template engine
app.set("view engine","ejs");

//static files middleware
app.use(express.static("public"));

//express json
app.use(express.json());
app.use(express.urlencoded({ extended : true }));
app.use(cookieParser());
app.use(fileUpload({ useTempFiles : true }));
app.use(methodOverride("_method", {
     methods : ["POST","GET"]
}));

//routes
app.use("*", checkUser);
app.use("/", pageRoute);
app.use("/photos", photoRoute);
app.use("/users", userRoute);


app.listen(port, () => {
     console.log(`Application running on port: ${port}`);
});
