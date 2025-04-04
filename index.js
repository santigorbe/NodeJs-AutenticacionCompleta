import express from 'express';

import cors from 'cors';
import multer from 'multer';

import path from 'path';

import { testConnection } from './utils/database.js';
import {login, register} from './controllers/controller.login.js'
import { usuarioRouter } from './routes/router.usuarios.js';

// Middlewares
import { morganMiddlewareError, morganMiddleware} from "./middleware/morgan.js";
import { upload } from './middleware/multer.js';


import { fileURLToPath } from 'url';
import { dirname } from 'path';
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();

app.use(express.json({ limit: '50mb' })); // Para analizar JSON
app.use(express.urlencoded({ limit: '50mb', extended: true })); // Para analizar datos URL encoded

app.use(express.static(path.join(__dirname, 'public')));

app.disable("x-powered-by");

testConnection()

app.use(morganMiddleware());
app.use(morganMiddlewareError());

app.use(cors());


app.post('/upload', upload.single('file'), (req, res) => {
    // 'file' es el campo que usa en el formulario HTML
    if (!req.file) {
        return res.status(400).json({error: 'No se subio el archivo. Solo se permite archivos JPG y PNG.'});
    }

    res.send(`Se subio el archivo exitosamente: ${req.file.filename}`);
});
  
app.post('/multiple-upload', upload.array('files', 5), (req, res) => {
    // 'files' es el campo de los archivos y el número 5 es el máximo de archivos
    if (!req.files) {
        return res.status(400).json({error: 'No se subio el archivo. Solo se permite archivos JPG y PNG.'});
    }

    res.send(`Se subieron los archivos exitosamente: ${req.files.map(file => file.filename).join(', ')}`);
});

app.post('/login', login);
app.post('/register', register);

app.use('/usuarios', usuarioRouter);


const PORT = process.env.APP_PORT;

app.listen(PORT, () => {
    console.log(`Servidor Express escuchando en http://localhost:${PORT}`);
});

