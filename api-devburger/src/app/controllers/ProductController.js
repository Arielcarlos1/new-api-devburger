import * as Yup from 'yup';
import Product from '../models/Product';
import Category from '../models/Category';
import User from '../models/User';


class ProductController {

    async store(req, res) {

        const schema = Yup.object({
            name: Yup.string().required(),
            price: Yup.number().required(),
            category_id: Yup.number().required(),
            offer: Yup.boolean(),


        });

        try {

            schema.validateSync(req.body, { abortEarly: false });

        } catch (err) {

            return res.status(400).json({ error: err.errors });
        }
        const { admin: isAdmin } = await User.findByPk(req.userId);

        if (!isAdmin) {
            return res.status(401).json({ error: 'User is not an admin.' });

        }



        const { filename: path } = req.file;
        const { name, price, category_id, offer } = req.body;

        const product = await Product.create({

            name,
            price,
            category_id,
            path,
            offer,

        });

        return res.status(201).json(product);

    }

    //Essa parte deixa um opcional 


    async update(req, res) {
        const schema = Yup.object({
            name: Yup.string(),
            price: Yup.number(),
            category_id: Yup.number(),
            offer: Yup.boolean(),

        });
        //essa parte faz a validacao 

        try {
            schema.validateSync(req.body, { abortEarly: false });
        } catch (err) {

            return res.status(400).json({ error: err.errors });

        }

        //verifica se e um ADM 
        const { admin: isAdmin } = await User.findByPk(req.userId);
        if (!isAdmin) {
            return res.status(401).json({ error: 'User is not an admin.' });

        }

        //Verifica se o produto existe 

        const { id } = req.params;

        const findProduct = await Product.findByPk(id);



        if (!findProduct) {

            return res.status(400).json({ error: 'Make sure you are sending the correct id.' });

        }

        //Deixa o path (arquivo) opcional 

        let path;

        if (req.file) {


            path = req.file.filename;

        }



        //Atualiza o produto 

        const { name, price, category_id, offer } = req.body;





        // 

        await Product.update({

            name,
            price,
            category_id,
            path,
            offer,




        }, {

            where: { id },

        });



        return res.status(200).json();

    }



    async index(req, res) {

        const products = await Product.findAll({

            include: [

                {

                    model: Category,

                    as: 'category',

                    attributes: ['id', 'name'],

                },

            ],

            attributes: ['id', 'name', 'price', 'offer', 'path', 'created_at', 'updated_at'],

        });



        console.log({ userId: req.userId });



        return res.json(products);

    }

}

export default new ProductController(); 