import { Router } from 'express';
import multer from 'multer';
import multerConfig from './config/multer';

import SessionController from './app/controllers/SessionController';
import UserController from './app/controllers/UserController';
import authMiddleware from './middlewares/auth';
import ProductController from './app/controllers/ProductController';
import CategoryController from './app/controllers/CategoryController';  
import OrderController from './app/controllers/OrderController';
import CreatePaymentIntentController from './app/controllers/stripe/CreatePaymentIntentController';

const routes = new Router();
const upload = multer(multerConfig);

// Rotas públicas
routes.post('/users', UserController.store);

routes.post('/session', SessionController.store);


// Middleware de autenticação

routes.use(authMiddleware);
// Rotas de produtos
routes.post('/products', upload.single('file'), ProductController.store);
routes.get('/products', ProductController.index);
routes.put('/products/:id', upload.single('file'), ProductController.update);

// Rotas de categorias
routes.post('/categories', upload.single('file'), CategoryController.store);
routes.get('/categories', CategoryController.index); //  Corrigido: Removido o multer
routes.put('/categories/:id', upload.single('file'), CategoryController.update);

// Rotas de pedidos
routes.post('/orders', OrderController.store);
routes.get('/orders', OrderController.index);
routes.put('/orders/:id', OrderController.update); //  Corrigido: Adicionado `:id`

routes.post('/create-payment-intent', CreatePaymentIntentController.store);

export default routes;
