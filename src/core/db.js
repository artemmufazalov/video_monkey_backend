import mongoose from "mongoose";

const mongoURI = process.env.NODE_ENV === "production" ? process.env.MONGODB_URI : "mongodb://localhost:27017/video_monkey";

mongoose.connect(mongoURI,
    {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true,
        useFindAndModify: false
    })
    .then(() => {
        console.log("Database connection was established successfully: " + mongoURI)
    })
    .catch((error) => {
        console.log("Cannot connect to the database, " + error);
    });