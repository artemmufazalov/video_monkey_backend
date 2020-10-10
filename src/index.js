import express from "express";
import bodyParser from "body-parser";
import dotenv from "dotenv";

import checkIsAuth from "./middlewares/checkIsAuth.js";
import UserController from "./controllers/UserController.js"

import "./core/db.js";

const app = express();

dotenv.config();

app.use(bodyParser.json());
app.use(checkIsAuth);

const User = new UserController();

app.delete("/user", User.delete);

app.get("/user/me", User.authMe);
app.post("/user/signin", User.signin);
app.delete("/user/logout", User.logout);
app.post("/user/signup", User.create);
app.get("/user/verify", User.verify);

app.listen(process.env.PORT || 5000, () => {
    console.log("Server started at port " + process.env.PORT || 5000);
});
