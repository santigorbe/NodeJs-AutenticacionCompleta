import { BDQuery } from "../utils/database.js";
import { generarToken } from "../middleware/jsonwebtoken.js";
import bcrypt from "bcrypt";

const saltRounds = 10;

export const hashPassword = async (password) => {
  try {
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    return hashedPassword;
  } catch (error) {
    console.error("Error al hashear la contraseña:", error);
    throw error;
  }
};

export const verifyPassword = async (password, hashedPassword) => {
  try {
    const match = await bcrypt.compare(password, hashedPassword);
    return match; // Retorna true si las contraseñas coinciden, false en caso contrario
  } catch (error) {
    console.error("Error al verificar la contraseña:", error);
    throw error;
  }
};

export const login = async (req, res) => {
  const { username, password } = req.body;

  try {
    
      const hashedPassword = await this.hashPassword(password);
      const { response } = await BDQuery( "SELECT * FROM usuarios WHERE username = ?", [username]);
    
      if (response.length === 0) {
        res.status(404).json({ error: "Credenciales incorrectas" });
        return;
      } else {
        const match = await this.verifyPassword(hashedPassword, response[0].password);
        if (!match) {
          res.status(401).json({ error: "Credenciales incorrectas" });
          return;
        }
        // Si las credenciales son correctas, se actualiza el campo last_login
        const { code } = await BDQuery(
          "UPDATE usuarios SET last_login = CURRENT_TIMESTAMP WHERE username = ?",
          [username]
        );
    
        res.status(code).json({
          nombre: response[0].nombre,
          apellido: response[0].apellido,
          email: response[0].email,
          token: generarToken({
            id_usuario: response[0].id,
            email: response[0].email,
          }),
        });
      }
  } catch (error) {
    res.status(500).json({ error: "Error al iniciar sesión" });
  }
};

export const register = async (req, res) => {
  const { password, nombre, apellido, email } = req.body;
    try {
        const { response } = await BDQuery( "SELECT email FROM usuarios WHERE email = ?", [email]);
        if (response.length != 0) {
          res.status(400).json({ error: "El usuario ya existe" });
          return;
        }
        const hashedPassword = await this.hashPassword(password);
        const { code } = await BDQuery('INSERT INTO usuarios (nombre, apellido, password, email) VALUES (?, ?, ?, ?)', 
          [ nombre, apellido, hashedPassword, email ]);
        res.status(code).json({ response: "Se creo un nuevo usuario con exito" });
    } catch (error) {
        res.status(500).json({ error: "Error al crear el usuario" });
    }
};
