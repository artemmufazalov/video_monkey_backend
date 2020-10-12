import express from "express";
import bodyParser from "body-parser";
import dotenv from "dotenv";

import checkIsAuth from "./middlewares/checkIsAuth.js";
import UserController from "./controllers/UserController.js"

import "./core/db.js";

const app = express();

if (process.env.NODE_ENV !== 'production') {
    dotenv.config({path: './configs/.env'});
}

app.use(bodyParser.json());
app.use(checkIsAuth);

const User = new UserController();

app.post("/user/register", User.create);
app.delete("/user", User.delete);

app.get("/user/me", User.authMe);
app.post("/user/login", User.login);
app.delete("/user/logout", User.logout);

app.get("/user/verify", User.verify);
app.delete("/user/verify", User.cancelRegistration);
app.post("/user/verify/email", User.resendEmail)

app.listen(process.env.PORT || 6000, () => {
    console.log("Server started at port " + process.env.VM_PORT || 6000);
});