import nodemailer from 'nodemailer';
import config from "../../configs/nodemailerConfig.js";

const options = {
    host: config.NODEMAILER_HOST,
    port: config.NODEMAILER_PORT,
    secure: true,
    requireTLS: true,
    auth: {
        user: config.NODEMAILER_USER,
        pass: config.NODEMAILER_PASS
    },
    logger: true
};

const transport = nodemailer.createTransport(options);

export default transport;