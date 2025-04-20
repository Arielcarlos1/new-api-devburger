import { resolve } from 'path'; 
import express from 'express';
import cors from 'cors';
import routes from './routes'; 

import './database'; // Consistente com importação ES Module

class App {
    constructor() {
        this.app = express(); 

        this.app.use(cors());
        this.middlewares();
        this.routes();
    }

    middlewares() {
        this.app.use(express.json());
        
        // Modifiquei as rotas para refletir subpastas diferentes
        this.app.use('/product-file', express.static(resolve(__dirname, '..', 'uploads')));
        this.app.use('/category-file', express.static(resolve(__dirname, '..', 'uploads')));
    }

    routes() {
        this.app.use(routes);
    }
}

export default new App().app;
