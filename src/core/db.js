import mongoose from "mongoose";

mongoose.connect("mongodb://localhost:27017/video_monkey",
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