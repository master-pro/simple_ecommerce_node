import axios from 'axios';
import express from 'express';
import config from '../config';
//var queryString = require('query-string');
const stripe = require('stripe')(config.stripe_secret_key)



const router = express.Router();
router.post('/key', async (req, res) => {
    res.send(config.stripe_public_key);
}
);

router.post('/payment',async (req,res)=>{
    // Moreover you can take more details from user
    // like Address, Name, etc from form
    stripe.customers.create({
        email: req.body.stripeEmail,
        source: req.body.stripeToken, //'tok_mastercard'
        name: 'Gourav Hammad',
        address: {
            line1: 'TC 9/4 Old MES colony',
            postal_code: '452331',
            city: 'Indore',
            state: 'Madhya Pradesh',
            country: 'India',
        }
    })
    .then((customer) => {
        return stripe.charges.create({
            amount: 500000,          // Charing Rs 25
            description: 'Web Development Product',
            currency: 'EUR',
            customer: customer.id
        });
    })
    .then((charge) => {
        console.log("response: "+ charge);
        //res.send("Success")  // If no error occurs
        res.redirect(config.domain+'status/?st='+1);
    })
    .catch((err) => {
        console.log(err);
        res.redirect(config.domain+'status/?st='+0);
//        res.send(err)       // If some error occurs
    });
});

export default router;