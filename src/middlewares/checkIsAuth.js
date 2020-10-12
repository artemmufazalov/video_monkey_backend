import jwt from "jsonwebtoken";

import UserModel from "../models/User.js";
import developmentConfigs from "../../configs/developmentConfigs.js";

const configs = process.env.NODE_ENV === "production" ? {} : developmentConfigs;

const checkIsAuth = async (req, res, next) => {
    if (
        req.path === "/user/login" ||
        req.path === "/user/register" ||
        req.path.toString().includes("/user/verify")
    ) {
        return next();
    }

    const token = req.headers.token;

    if (!token) {
        return res.status(403)
            .json({
                message: "Authorization is required to access this resource",
                resultCode: 1,
            });
    }

    console.log("Provided token: " + token);

    let jwtKey = process.env.NODE_ENV === "production" ? process.env.VM_JWT_KEY : configs.VM_JWT_KEY;
    let jwtMaxAge = process.env.NODE_ENV === "production" ? process.env.VM_JWT_MAX_AGE : configs.VM_JWT_MAX_AGE;

    jwt.verify(token, jwtKey, {
        maxAge: jwtMaxAge
    }, (err, decodedData) => {
        if (err) {
            return res.status(401)
                .json({
                    message: "Token is invalid or expired",
                    error: err,
                    resultCode: 1,
                })
        } else {
            UserModel.findOne({_id: decodedData._id}, {}, (err, user) => {
                if (!user) {
                    return res.status(404)
                        .json({
                            message: "User associated with this token does not exist",
                            error: err,
                            resultCode: 1
                        });
                } else if (err) {
                    return res.status(500)
                        .json({
                            message: "Some error occurred",
                            error: err,
                            resultCode: 1
                        });
                } else {
                    req.user = user;
                    req.token = token;
                    console.log("Authorized request");
                    next();
                }
            })
        }
    })

}

export default checkIsAuth;