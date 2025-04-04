import { Router } from "express";

import { getUsuarios, getUsuario, updateUsuario, deleteUsuario, setPassword } from "../controllers/controller.usuarios.js";

import { verificarToken } from "../middleware/jsonwebtoken.js";

export const usuarioRouter = Router();

usuarioRouter.get("/", verificarToken, getUsuarios);

usuarioRouter.get("/:id", verificarToken, getUsuario);

usuarioRouter.put("/update/:id", verificarToken, updateUsuario);

usuarioRouter.delete("/delete/:id", verificarToken, deleteUsuario);

usuarioRouter.patch("/setPassword/:id", verificarToken, setPassword);
