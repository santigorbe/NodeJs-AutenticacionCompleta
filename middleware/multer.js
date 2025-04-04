import multer from 'multer';
import path from 'path';

// Configuración de almacenamiento de Multer
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/'); // Donde se guardarán los archivos subidos
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname)); // Cómo se nombrarán los archivos
    }
});

const fileFilter = (req, file, cb) => {
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
        cb(null, true);
    } else {
        cb(null, false);
    }
};

export const upload = multer({
    storage: storage,
    limits: { fileSize: 1 * 1024 * 1024 }, // 1 MB
    fileFilter: fileFilter
});
