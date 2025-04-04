import jwt from 'jsonwebtoken';

const secretKey = process.env.JWT_SECRET;

export function verificarToken(req, res, next) {
  const token = req.headers['authorization']?.split(' ')[1]; // Extraer token del header "Authorization"
  
  if (!token) {
    console.log("Token no proporcionado")
    return res.status(403).send('Token no proporcionado');
  }

  jwt.verify(token, secretKey, (err, decoded) => {
    if (err) {
      console.log("Token no valido")
      return res.status(401).send('Token no válido');
    }
    req.userDecoded = decoded; 
    next();
  });
}
export function generarToken(user) {
  const token = jwt.sign(user, secretKey, { expiresIn: '24h' }); // Expira en 1 hora
  return token;
}
