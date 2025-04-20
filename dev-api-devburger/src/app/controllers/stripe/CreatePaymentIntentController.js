import Stripe from 'stripe';
import * as Yup from 'yup';
import dotenv from 'dotenv';

dotenv.config();

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

const calculateOrderAmount = (items) => {
  const total = items.reduce((acc, current) => {
    return acc + current.price * current.quantity;
  }, 0);

  return total; // Stripe espera em centavos
};

class CreatePaymentIntentController {
  async store(req, res) {
    const schema = Yup.object({
      products: Yup.array()
        .required()
        .of(
          Yup.object({
            id: Yup.number().required(),
            quantity: Yup.number().required(),
            price: Yup.number().required(),
          })
        ),
    });

    try {
      schema.validateSync(req.body, { abortEarly: false });
    } catch (err) {
      return res.status(400).json({ error: err.errors });
    }

    const { products } = req.body;
    const amount = calculateOrderAmount(products);

    try {
      const paymentIntent = await stripe.paymentIntents.create({
        amount,
        currency: 'brl',
        payment_method_types: ['card'],
      });

      const isProduction = process.env.NODE_ENV === 'production';
      const dpmCheckerLink = isProduction
      

      return res.status(201).json({
        clientSecret: paymentIntent.client_secret,
        dpmCheckerLink,
      });
    } catch (error) {
      console.error('Stripe error:', error);
      return res.status(500).json({ error: 'Erro ao criar pagamento.' });
    }
  }
}

export default new CreatePaymentIntentController();
