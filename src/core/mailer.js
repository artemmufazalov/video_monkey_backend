import nodemailer from 'nodemailer';
import developmentConfigs from "../../configs/developmentConfigs.js";

const configs = process.env.NODE_ENV === "production" ? {} : developmentConfigs;

const options = {
    host: process.env.NODE_ENV === "production" ? process.env.VM_NODEMAILER_HOST : configs.VM_NODEMAILER_HOST,
    port: process.env.NODE_ENV === "production" ? process.env.VM_NODEMAILER_PORT : configs.VM_NODEMAILER_PORT,
    secure: true,
    requireTLS: true,
    auth: {
        user: process.env.NODE_ENV === "production" ? process.env.VM_NODEMAILER_USER : configs.VM_NODEMAILER_USER,
        pass: process.env.NODE_ENV === "production" ? process.env.VM_NODEMAILER_PASS : configs.VM_NODEMAILER_PASS,
    },
    logger: true
};

const transport = nodemailer.createTransport(options);

export default transport;