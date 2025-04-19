import * as Yup from 'yup';
import jwt from 'jsonwebtoken';
import User from '../models/User';
import authConfig from '../../config/auth';

class SessionController {
  async store(req, res) {
    const schema = Yup.object({
      email: Yup.string().email().required(),
      password: Yup.string().min(6).required(),
    });

    try {
      schema.validateSync(req.body, { abortEarly: false });
    } catch (err) {
      return res.status(400).json({ error: err.errors });
    }

    const { email, password } = req.body;

    const user = await User.findOne({ where: { email } });

    if (!user) {
      console.log('Usuário não encontrado!');
      return res.status(401).json({ error: 'Email ou senha inválidos' });
    }
    
    const isSamePassword = await user.checkPassword(password);
    
    if (!isSamePassword) {
      console.log('Senha incorreta!');
      return res.status(401).json({ error: 'Email ou senha inválidos' });
    }
    

    const { id, name, admin } = user;

    return res.status(201).json({
      id,
      name,
      email,
      admin,
      token: jwt.sign({ id: user.id, name: user.name }, authConfig.secret, {
        expiresIn: authConfig.expiresIn,
      }),
    });
  }
}

export default new SessionController();
