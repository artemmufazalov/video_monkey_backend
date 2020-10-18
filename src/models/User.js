import mongoose from "mongoose";
import validator from "validator";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

const UserSchema = new mongoose.Schema({
        email: {
            type: String,
            required: [true, "Email is required"],
            validate: [validator.isEmail, "Invalid email address"],
            unique: true,
            lowercase: true
        },
        name: {
            type: String,
            required: [true, "Name is required"]
        },
        password: {
            type: String,
            required: [true, "Password is required"]
        },
        confirmed: {
            type: Boolean,
            default: false
        },
        confirmation_hash: {
            type: String
        },
        tokens: [{type: String}]
    },
    {
        timestamps: true
    });

UserSchema.pre('save', async function (next) {
    // Hash the password before saving the user model
    const user = this

    if (!user.isModified("password")) {
        return next();
    }
    if (!user.confirmation_hash) {
        user.confirmation_hash = await bcrypt.hash(user.email + new Date().toString(), 10);
    }
    user.password = await bcrypt.hash(user.password, 8);
    next();
})

export const generateAuthToken = (user) => {
    // Generate an auth token for the user
    const token = jwt.sign({_id: user._id}, process.env.VM_JWT_KEY, {
        expiresIn: process.env.VM_JWT_MAX_AGE,
        algorithm: 'HS256'
    })
    return token
}

export const findByCredentials = async (email, password) => {
    // Search for a user by email and password.
    const user = await UserModel.findOne({email});
    if (!user) {
        throw new Error('Invalid login credentials');
    }
    const isPasswordMatch = await bcrypt.compare(password, user.password)
    if (!isPasswordMatch) {
        throw new Error('Invalid login credentials');
    }
    return user;
}

const UserModel = mongoose.model("User", UserSchema);

export default UserModel;


