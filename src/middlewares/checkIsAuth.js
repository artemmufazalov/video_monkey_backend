import jwt from "jsonwebtoken";

import UserModel from "../models/User.js";


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

    jwt.verify(token, process.env.VM_JWT_KEY, {
        maxAge: process.env.VM_JWT_MAX_AGE
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