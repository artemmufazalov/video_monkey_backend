import nodemailer from 'nodemailer';

const options = {
    host: process.env.VM_NODEMAILER_HOST,
    port: process.env.VM_NODEMAILER_PORT,
    secure: true,
    requireTLS: true,
    auth: {
        user: process.env.VM_NODEMAILER_USER,
        pass: process.env.VM_NODEMAILER_PASS
    },
    logger: true
};

const transport = nodemailer.createTransport(options);

export default transport;