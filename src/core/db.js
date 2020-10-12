import mongoose from "mongoose";

mongoose.connect(process.env.NODE_ENV === "production" ? process.env.MONGODB_URI : "mongodb://localhost:27017/video_monkey",
    {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true,
        useFindAndModify: false
    })
    .then(() => {
        console.log("Database connection was established successfully")
    })
    .catch((error) => {
        console.log("Cannot connect to the database, " + error);
    });