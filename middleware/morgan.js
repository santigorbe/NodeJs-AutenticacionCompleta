import morgan from "morgan";
import path from "path"
import fs from "fs"

import { fileURLToPath } from "url"
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
/*                                                   Inicializo los archivos                                             */
// Verifica si el archivo ya existe
const filePathError = path.join(__dirname, "/logs/error.log");
if (!fs.existsSync(filePathError)) {
    // Si el archivo no existe, créalo
    fs.writeFile(filePathError, '', (err) => {
        if (err) {
            console.error('Error al crear el archivo de registro:', err);
        } else {
            console.log('Archivo de registro creado con éxito.');
        }
    });
}
const errorFile = fs.createWriteStream(filePathError, { flags: 'a' });

/*                                                     Hago dos tokens propios                                            */

morgan.token("fecha", () => {
  let f = new Date();
  //Esta funcion tiene un error de hasta un minuto
  return (
    f.getDate() +
    "/" +
    (f.getMonth() + 1) +
    "/" +
    f.getFullYear() +
    "  " +
    f.getHours() +
    ":" +
    f.getMinutes() +
    ":" +
    f.getSeconds()
  );
});
morgan.token("ip", (req) => {
  let clientIP = req.headers["x-forwarded-for"] || req.connection.remoteAddress;
  if (clientIP.startsWith("::ffff:")) {
    clientIP = clientIP.replace("::ffff:", "");
  }
  return clientIP;
});

/*                                              Creo los middleware que usan archivos                                            */

export const morganMiddlewareError = () =>
  morgan(
    ":fecha  :ip  :method :status :url  :response-time ms - :res[content-length]",
    {
      skip: function (req, res) {
        return res.statusCode < 499;
      },
      stream: errorFile,
    }
  );

// Mandar a consola
export const morganMiddleware = () =>
  morgan(
    ":fecha  :ip  :method :status :url  :response-time ms - :res[content-length]"
  );
