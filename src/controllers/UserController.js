import UserModel from "../models/User.js";
import validate from "../utils/validate.js";
import mailer from "../core/mailer.js";
import {findByCredentials, generateAuthToken} from "../models/User.js";

class UserController {

    create = (req, res) => {
        const postData = {
            email: req.body.email,
            name: req.body.name,
            password: req.body.password,
        };

        let errors = validate(postData);
        if (errors.mail || errors.password || errors.name) {
            res.status(400)
                .json({
                    message: "Values didn't pass the validation",
                    errors: errors
                })
        } else {
            const user = new UserModel(postData);

            user.save()
                .then((user) => {
                    res.status(200).json({
                        message: "User created successfully",
                        user: user
                    });
                     mailer.sendMail(
                         {
                             from: process.env.NODEMAILER_USER,
                             to: postData.email,
                             subject: "Подтверждение почты для регистрации на Video Monkey",
                             html: `Для того, чтобы подтвердить почту, перейдите <a href="http://localhost:${process.env.PORT || 5000}/user/verify?hash=${user.confirmation_hash}">по этой ссылке</a>`,
                         },
                         (err, info) => {
                             if (err) {
                                 console.log("Error: " + err);
                             } else {
                                 console.log("Success: " + info);
                             }
                         }
                     );
                })
                .catch((err) => {
                    res.status(500)
                        .json({
                            message: "Some error occurred",
                            error: err
                        });
                });
        }
    }

    delete = (req, res) => {
        const id = req.user && req.user._id;
        UserModel.findOneAndRemove({_id: id}, {}, (err, user) => {
            if (!user) {
                return res.status(400)
                    .json({
                        message: `User with the id ${id} was not found`
                    });
            } else if (err) {
                res.status(500)
                    .json({
                        message: "Some error occurred",
                        error: err
                    });
            } else {
                res.status(200)
                    .json({message: `User with the id ${id} was deleted`});
            }
        });
    }

    verify = (req, res) => {
        const confirmationHash = req.query.hash;

        if (!confirmationHash) {
            return res.status(422)
                .json({
                    message: "Provided hash is invalid"
                })
        } else {
            UserModel.findOne({confirmation_hash: confirmationHash}, (err, user) => {
                if (err || !user) {
                    return res.status(404)
                        .json({
                            message: "User with this hash does not exist",
                            error: err
                        })
                }
                user.confirmed = true;
                user.save()
                    .then(() => {
                        return res.status(200)
                            .json({
                                message: "User confirmed successfully"
                            })
                    })
                    .catch((err) => {
                        return res.status(500)
                            .json({
                                message: "Some error occured",
                                error: err
                            })
                    })
            })
        }
    }

    authMe = (req, res) => {
        const id = req.user && req.user._id;

        UserModel.findById(id, {}, {}, (err, user) => {
            if (err || !user) {
                return res.status(500)
                    .json({
                        message: "Some error occurred"
                    })
            } else {
                return res.status(200)
                    .json({
                        message: "Successful authentication",
                        user: user
                    })
            }
        })
    }

    signin = (req, res) => {
        const postData = {
            email: req.body.email,
            password: req.body.password
        }

        findByCredentials(postData.email, postData.password)
            .then((user) => {
                let userToken = generateAuthToken(user);
                user.tokens.push(userToken);
                user.save()
                    .then(() => {
                        res.status(200)
                            .json({
                                message: "Logged in successfully",
                                user: user
                            })
                    })
                    .catch((err) => {
                        res.status(500)
                            .json({
                                message: "Some server error occurred",
                                error: err
                            })
                    })

            })
            .catch((err) => {
                res.status(403)
                    .json({
                        message: "Invalid login or password",
                        error: err
                    })
            })
    }

    logout = (req, res) => {
        req.user.tokens = req.user.tokens.filter((token) => {
            return token !== req.headers.token;
        })

        req.user.save()
            .then((user) => {
                res.status(200)
                    .json({
                        message: "Logged out successfully",
                        user: user
                    })
            })
            .catch((err) => {
                res.status(500)
                    .json({
                        message: "Some error occurred",
                        error: err
                    })
            })
    }

}

export default UserController;