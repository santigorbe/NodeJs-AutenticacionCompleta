import { BDQuery } from "../utils/database.js";
import { hashPassword, verifyPassword } from "./controller.login.js";

export const getUsuarios = async (req, res) => {
  try {
    const { code, response: usuarios } = await BDQuery(
      "select * from usuarios;"
    );
    res.status(code).json(usuarios);
  } catch (error) {
    res.status(500).json({ error: "Error al buscar los usuarios" });
  }
};

export const getUsuario = async (req, res) => {
  try {
    const { code, response: usuario } = await BDQuery(
      "select * from usuarios where id = ?;",
      [req.params.id]
    );
    if (usuario.length == 0) {
      res.status(404).json({ error: "Usuario no encontrado" });
    }
    res.status(code).json(usuario[0]);
  } catch (error) {
    res.status(500).json({ error: "Error al buscar el usuario" });
  }
};

export const updateUsuario = async (req, res) => {
  const { nombre, apellido, email } = req.body;
  const { id } = req.params;

  try {
    const { code, response } = await BDQuery(
      "update usuarios set nombre=?, apellido=?, email=? where id = ?;",
      [nombre, apellido, email, id]
    );
    if (response.affectedRows == 0) {
      res.status(400).json({ error: "Usuario no encontrado" });
    } else {
      res.status(200).json({ response: "Usuario actualizado con exito" });
    }
  } catch (error) {
    res.status(500).json({ error: "Error al actualizar el usuario" });
  }
};

export const deleteUsuario = async (req, res) => {
  const { id } = req.params;
  try {
    const { code, response } = await BDQuery(
      "delete from usuarios where id = ?;",
      [id]
    );
    if (response.affectedRows == 0) {
      res.status(400).json({ error: "Usuario no encontrado" });
    } else {
      res.status(200).json({ response: "Usuario eliminado con exito" });
    }
  } catch (error) {
    res.status(500).json({ error: "Error al eliminar el usuario" });
  }
};

export const setPassword = async (req, res) => {
  const {id} = req.params;
  const {oldPassword, newPassword} = req.body;
  const hashedOldPassword = await hashPassword(oldPassword);
  const hashedNewPassword = await hashPassword(newPassword);
  
  try {
    const { code: codePass, response: resPass } = await BDQuery(
      "select password from usuarios where id = ?;",
      [id]
    )
    if(resPass.length > 0){
        const match = await verifyPassword(oldPassword, resPass[0].password);
        if(match){
            await BDQuery( "update usuarios set password=? where id = ?;", [hashedNewPassword, id])
            res.status(200).json({response: "Contraseña cambiada con exito"});
        }else{
            res.status(401).json({error: "Contraseña incorrecta"});
        }
    }else{
        res.status(404).json({error: "Usuario no encontrado"});
    }
  } catch (error) {
    res.status(500).json({ error: "Error al cambiar la contraseña" });
  }

};
