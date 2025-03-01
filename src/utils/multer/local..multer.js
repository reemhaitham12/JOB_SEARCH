import multer from 'multer';
import path from 'path';


export const uploadDiskFile = () => {
    const storage = multer.diskStorage({
        destination: (req, file, cb) => {
            cb(null, 'uploads'); 
        },
        filename: (req, file, cb) => {
            const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9) + path.extname(file.originalname);
            cb(null, uniqueSuffix);
        }
    });

    return multer({ storage });
};
