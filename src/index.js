import express from "express";
import bodyParser from "body-parser";
import cors from "cors";

import checkIsAuth from "./middlewares/checkIsAuth.js";
import UserController from "./controllers/UserController.js"

import "./core/db.js";

const app = express();

app.use(bodyParser.json());
app.use(checkIsAuth);

const corsOptions = {
    origin: true,
    methods: ["OPTIONS", "GET", "PUT", "POST", "DELETE"],
    allowedHeaders: ["Content-Type","Access-Control-Allow-Origin","token"]
};

app.use(cors(corsOptions));

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
    console.log("Server started at port " + process.env.PORT || 6000);
});