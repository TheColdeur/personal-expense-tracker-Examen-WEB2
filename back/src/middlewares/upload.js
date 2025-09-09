import multer from "multer";
import fs from "fs";
import path from "path";

const storage = multer.diskStorage({
    destination: (req, res, cb) => {
        const dir = './uploads';

        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir);
        }

        cb(null, dir);
    },
    filename: (req, file, cb) => {
        cb(null,"receipt-" + Date.now() + path.extname(file.originalname));
    }
});

const fileFilter = (req, file, cb) => {
    if(file.mimetype == 'image/jpg' || file.mimetype == 'image/png' || file.mimetype == 'application/pdf'){
        cb(null, true);
    } else{
        req.errorMessage = "This file is not valid";
        cb(null, false);
    }
}

export const upload = multer({ storage: storage,
    fileFilter: fileFilter,
    limits: {
        fileSize: 5 * 1024 * 1024
    }
 });