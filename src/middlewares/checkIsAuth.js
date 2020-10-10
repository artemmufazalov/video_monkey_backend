import jwt from "jsonwebtoken";

import config from "../../configs/JWTConfig.js";
import UserModel from "../models/User.js";


const checkIsAuth = async (req, res, next) => {
    if (
        req.path === "/user/signin" ||
        req.path === "/user/signup" ||
        req.path === "/user/verify"
    ) {
        return next();
    }

    const token = req.headers.token;
    console.log("Provided token: " + token);
    jwt.verify(token, config.JWT_KEY, {
        maxAge: "7d"
    }, (err, decodedData) => {
        if (err) {
            return res.status(400)
                .json({
                    message: "Token is invalid or expired",
                    error: err
                })
        } else {
            try {
                UserModel.findOne({_id: decodedData._id}, {}, (err, user) => {
                    if (!user) {
                        return res.status(400)
                            .json({
                                message: "Provided invalid token",
                                error: err
                            });
                    } else if (err) {
                        return res.status(400)
                            .json({
                                message: "Some error occurred",
                                error: err
                            });
                    } else {
                        req.user = user;
                        req.token = token;
                        console.log("Authorized request");
                        next();
                    }
                })
            } catch (err) {
                res.status(401)
                    .json({
                        message: 'Not authorized to access this resource',
                        error: err
                    });
            }
        }
    })

}

export default checkIsAuth;