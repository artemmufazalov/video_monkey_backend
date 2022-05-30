import mongoose from "mongoose";
import validator from "validator";

const ComplaintSchema = new mongoose.Schema({
        email: {
            type: String,
            required: [true, "Email is required"],
            validate: [validator.isEmail, "Invalid email address"],
            lowercase: true
        },
        title: {
            type: String,
            required: [true, "Title is required"]
        },
        description: {
            type: String,
        },
        screens: [{type: String}]
    },
    {
        timestamps: true
    });


const ComplaintModel = mongoose.model("Complaint", ComplaintSchema);

export default ComplaintModel;