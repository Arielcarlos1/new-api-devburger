import jwt from 'jsonwebtoken';
import authConfig from '../config/auth';

async function authMiddleware(req, res, next) {
  const authToken = req.headers.authorization;

  if (!authToken) {
    return res.status(401).json({ error: 'Token not provided' });
  }

  const token = authToken.split(' ').at(1);

  try {
    // Usando a versão assíncrona com Promise
    const decoded = await new Promise((resolve, reject) => {
      jwt.verify(token, authConfig.secret, (err, decoded) => {
        if (err) {
          return reject(new Error('Token invalid'));  // Rejeitando diretamente o erro
        }
        resolve(decoded);
      });
    });

    req.userId = decoded.id;  // Passando o ID do usuário para o req
    req.userName = decoded.name;  // Passando o nome do usuário para o req

    return next();
  } catch (err) {
    return res.status(401).json({ error: err.message });
  }
}

export default authMiddleware;
