import DataURIParser from "datauri/parser.js";
import path from "path";

import ComplaintModel from "../models/Complaint.js";
import cloudinary from "../core/cloudinary.js";

const dataURIParser = new DataURIParser();

class ComplaintController {

    create = (req, res) => {

        if (req.files.length > 0) {
            req.files64 = [];
            for (let i = 0; i < req.files.length; i++) {
                let newFile = dataURIParser.format(path.extname(req.files[i].originalname).toString() || "", req.files[i].buffer);
                req.files64.push(newFile);
            }
        }

        console.log(req.files64)
        console.log(req.body);
        console.log('req.files: ', req.files);

        return res
            .json({
                message: "Success"
            })
    }

}


export default ComplaintController;