import express from "express";
import dotenv from "dotenv";
import conn from './db.js';
import pageRoute from "./routes/pageRouter.js";
import photoRoute from "./routes/photoRouter.js";

dotenv.config();

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

//routes
app.use("/",pageRoute);
app.use("/photos",photoRoute);

app.listen(port, () => {
     console.log(`Application running on port: ${port}`);
});