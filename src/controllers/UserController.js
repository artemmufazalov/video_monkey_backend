import validate from "../utils/validate.js";
import mailer from "../core/mailer.js";

import UserModel from "../models/User.js";
import {findByCredentials, generateAuthToken} from "../models/User.js";

//TODO: add methods for changing password, email or userName

const createConfirmationEmailObject = (emailFrom, emailTo, userName, hash) => {

    return {
        from: emailFrom,
        to: emailTo,
        subject: "Подтверждение почты для регистрации на Video Monkey",
        html: `<p>Уважаемый <b>${userName}</b>,</p>
                    <p>Для того, чтобы подтвердить почту, использованную при регистрации, перейдите
                        <a href="${process.env.FRONTEND_ORIGIN}/#/register/verify/submit?hash=${hash}">по этой ссылке</a>.
                    </p>
                    <p>Если вы не регистрировались на сайте 
                        <a href="${process.env.FRONTEND_ORIGIN}">Video Monkey</a>,
                    или это письмо пришло вам по ошибке, перейдите
                        <a href="${process.env.FRONTEND_ORIGIN}/#/register/verify/reject?hash=${hash}">по этой ссылке</a>.
                    </p>
                    <p>С уважением,<br/>
                    Команда Video Monkey
                    </p>
                     <div style="background-color: #44C716; width: 100%; text-align: center">
                        <img src="cid:companyCardPng" style="width: 100%; max-width:600px" alt="Company card"/>
                     </div>`,
        attachments: [{
            filename: 'image.png',
            path: `${process.env.INIT_CWD}/src/assets/EmailFooter.png`,
            cid: 'companyCardPng'
        }]
    }
}

class UserController {

    create = (req, res) => {
        const postData = {
            email: req.body.email,
            name: req.body.name,
            password: req.body.password,
        };

        UserModel.findOne({email: postData.email}, {}, {}, (err, user) => {
            if (user) {
                return res.status(401)
                    .json({
                        message: "User with this email already exist",
                        resultCode: 1
                    });
            }
        })

        let errors = validate(postData);
        if (errors.mail || errors.password || errors.name) {
            return res.status(401)
                .json({
                    message: "Values didn't pass the validation",
                    errors: errors,
                    resultCode: 1
                })
        } else {
            const user = new UserModel(postData);

            user.save()
                .then((user) => {
                    mailer.sendMail(createConfirmationEmailObject(process.env.VM_NODEMAILER_USER, postData.email, user.name, user.confirmation_hash),
                        (err, info) => {
                            if (err) {
                                UserModel.findOneAndRemove({_id: user._id});
                                return res.status(500).json({
                                    message: "Some server error, email could not be sent",
                                    user: {...user._doc, _id: "", password: "", tokens: []},
                                    resultCode: 1,
                                });
                            } else {
                                return res.status(200).json({
                                    message: "User created successfully",
                                    nextMessage: "Email confirmation is required",
                                    user: {...user._doc, _id: "", password: "", tokens: []},
                                    resultCode: 0,
                                });
                            }
                        }
                    );
                })
                .catch((err) => {
                    return res.status(500)
                        .json({
                            message: "Some error occurred",
                            error: err,
                            resultCode: 1
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
                        message: `User with the id ${id} was not found`,
                        resultCode: 1
                    });
            } else if (err) {
                res.status(500)
                    .json({
                        message: "Some error occurred",
                        error: err,
                        resultCode: 1
                    });
            } else {
                res.status(200)
                    .json({
                        message: `User with the id ${id} was deleted`,
                        resultCode: 0
                    });
            }
        });
    }

    verify = (req, res) => {
        const confirmationHash = req.query.hash;

        if (!confirmationHash) {
            return res.status(403)
                .json({
                    message: "Confirmation hash was not provided",
                    resultCode: 1
                })
        } else {
            UserModel.findOne({confirmation_hash: confirmationHash}, (err, user) => {
                if (err || !user) {
                    return res.status(404)
                        .json({
                            message: "User with this hash does not exist",
                            error: err,
                            resultCode: 1
                        });
                }

                if (user.confirmed) {
                    return res.status(200)
                        .json({
                            message: "User with this hash have been already confirmed",
                            user: {...user._doc, _id: "", password: ""},
                            resultCode: 0
                        });
                }

                user.confirmed = true;
                let userToken = generateAuthToken(user);
                user.tokens.push(userToken);
                user.save()
                    .then((user) => {
                        return res.status(200)
                            .json({
                                message: "User confirmed successfully",
                                user: {...user._doc, _id: "", password: ""},
                                token: userToken,
                                resultCode: 0,
                            })
                    })
                    .catch((err) => {
                        return res.status(500)
                            .json({
                                message: "Some error occurred",
                                error: err,
                                resultCode: 1
                            })
                    })
            })
        }
    }

    cancelRegistration = (req, res) => {
        const confirmationHash = req.query.hash;

        if (!confirmationHash) {
            return res.status(403)
                .json({
                    message: "Confirmation hash was not provided",
                    resultCode: 1
                })
        } else {
            UserModel.findOneAndRemove({confirmation_hash: confirmationHash}, {}, (err, user) => {
                if (!user) {
                    return res.status(404)
                        .json({
                            message: "User with this hash does not exist",
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
                    return res.status(200)
                        .json({
                            message: "User registration was canceled",
                            user: {...user._doc, _id: "", password: "", tokens: []},
                            resultCode: 0
                        });
                }
            })
        }
    }

    resendEmail = (req, res) => {

        const postData = {
            email: req.body.email,
        };

        UserModel.findOne({email: postData.email}, {}, {}, (err, user) => {
            if (!user) {
                return res.status(401)
                    .json({
                        message: "User with this email does not exist",
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
                mailer.sendMail(createConfirmationEmailObject(process.env.VM_NODEMAILER_USER, postData.email, user.name, user.confirmation_hash),
                    (err, info) => {
                        if (err) {
                            res.status(500).json({
                                nextMessage: "Some server error, email was not sent",
                                user: {...user._doc, _id: "", password: "", tokens: []},
                                resultCode: 1,
                            });
                        } else {
                            res.status(200).json({
                                nextMessage: "Email confirmation was sent",
                                user: {...user._doc, _id: "", password: "", tokens: []},
                                resultCode: 0,
                            });
                        }
                    }
                );
            }
        })
    }

    authMe = (req, res) => {
        const id = req.user && req.user._id;

        UserModel.findById(id, {}, {}, (err, user) => {
            if (!user) {
                return res.status(404)
                    .json({
                        message: "User was not found",
                        error: err,
                        resultCode: 1
                    })
            } else if (err) {
                return res.status(500)
                    .json({
                        message: "Some error occurred",
                        error: err,
                        resultCode: 1
                    })
            } else {
                return res.status(200)
                    .json({
                        message: "Successful authentication",
                        user: {...user._doc, _id: "", password: ""},
                        resultCode: 0
                    })
            }
        })
    }

    login = (req, res) => {
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
                                user: {...user._doc, _id: "", password: ""},
                                token: userToken,
                                resultCode: 0
                            })
                    })
                    .catch((err) => {
                        res.status(500)
                            .json({
                                message: "Some server error occurred",
                                error: err,
                                resultCode: 1
                            })
                    })

            })
            .catch((err) => {
                res.status(403)
                    .json({
                        message: "Invalid login or password",
                        error: err,
                        resultCode: 1
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
                        user: {...user._doc, _id: "", password: ""},
                        resultCode: 0

                    })
            })
            .catch((err) => {
                res.status(500)
                    .json({
                        message: "Some error occurred",
                        error: err,
                        resultCode: 1
                    })
            })
    }

}

export default UserController;