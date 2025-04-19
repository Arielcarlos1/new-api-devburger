import { v4 } from 'uuid';
import * as Yup from 'yup';
import bcrypt from 'bcrypt';  // Importar bcrypt para gerar o hash

import User from '../models/User';

class UserController {            
     async store(req, res) {
        const schema = Yup.object({
            name: Yup.string().required(),
            email: Yup.string().email().required(),
            password: Yup.string().required().min(6),
            admin: Yup.boolean(),
        });

        try {
            schema.validateSync(req.body, { abortEarly: false });
        } catch (err) {
            return res.status(400).json({ error: err.errors });
        }
            
        const { name, email, password, admin } = req.body;
    
        const userExists = await User.findOne({ where: { email } });

        if (userExists) {
            return res.status(400).json({ error: 'User already exists.' });
        }

        // Gerando o hash da senha antes de salvar no banco
        const password_hash = await bcrypt.hash(password, 8);

        const user = await User.create({
            id: v4(),
            name,
            email,
            password_hash,  // Salvar a senha já criptografada
            admin,
        });
    
        return res.status(201).json({
            id: user.id,
            name,
            email,
            admin,
        });
    }  
}

export default new UserController();
