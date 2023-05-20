# Simple E-Commerce with HyperPay & Stripe

Building an e-commerce system with a checkout page for testing some payment gateways like HyperPay and Stripe.

## Demo Website

👉 Demo: [Watch Demo Video](https://youtu.be/79GErZ24ytM)

## About the Project

This project is an e-commerce website built with Node.js and React, and it utilizes MongoDB for data storage. The main features of the project include:

1. Shop page for displaying products to customers, with an admin panel for product management.
2. Cart functionality to save user purchases.
3. Checkout page for the payment process.
4. Support for two payment gateways: HyperPay and Stripe.

## Run Locally

### 1. Install MongoDB

Download MongoDB from the official website: [MongoDB Installation Guide](https://docs.mongodb.com/manual/administration/install-community/)

### 2. Run Backend

```
$ npm install
$ npm start
```

### 3. Run Frontend

```
# open new terminal
$ cd frontend
$ npm install
$ npm start
```

### 4. Create Admin User

- Run this on chrome: http://localhost:5000/api/users/createadmin
- It returns admin email and password

### 5. Login

- Run http://localhost:3000/signin
- Enter admin email and password and click signin

### 6. Create Products

- Run http://localhost:3000/products
- Click create product and enter product info

## 7. Start shopping
- Add product to cart
- Go to checkout page
- Select payment gateway
- Fill payment form 

## Payment With Hyperpay
Hyperpay supports various integration methods to link your API with their service. In this guide, we will focus on the CopyAndPay method. COPYandPAY is a SAQ-A compliant payment-form solution that is both secure and simple to integrate. The integration process involves three simple steps:
- Prepare the checkout:
To prepare the checkout, you need to perform a server-to-server POST request with the required data, including the order type, amount, and currency. Upon a successful request, you will receive a JSON string with an id, which is required in the second step to create the payment form.
```
router.post('/init', async (req, res) => {
  order = await getUserOrder(req);
  try {
    const url = 'https://eu-test.oppwa.com/v1/checkouts';

    const data = {
      entityId: config.hyper_entity,
      amount: order.totalPrice,
      currency: 'EUR',
      paymentType: 'DB',
    };

    const response = await axios.post(url, data, {
      headers: {
        Authorization: `Bearer ${ config.hyper_access_token}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });

    res.send(response.data);
  } catch (error) {
    console.error(error);
    res.status(500).send('Proxy request failed');
  }
});
```
- Create the payment form:
To create the payment form, you need to add the following lines of HTML/JavaScript to your page and populate the necessary variables.
```
<form id="hyperpay_form" action={hyperpayRet} className='paymentWidgets' data-brands="VISA MASTER AMEX"></form>
```
In paymentAction.js file, call the initCheckout function to retrieve the checkout id and build the script.
```
function initCheckout(props) {
  axios.post('/api/hyperpay/init')
      .then(response => {
        console.log(response.data);
        const script = document.createElement('script');
        script.type = 'text/javascript';
        script.src = `https://eu-test.oppwa.com/v1/paymentWidgets.js?checkoutId=${response.data['id']}`;
        script.async = true;
        script.onload = () => {

        }
        document.body.appendChild(script);
      })
      .catch(error => {
        console.error(error);
      });
}
```
- Get the payment status:
Once the payment has been processed, the customer will be redirected to the hyperpayRet URL along with a GET parameter called resourcePath. To retrieve the payment status, implement the following logic:
```
router.get('/payment', async (req, res) => {
    try {
        console.log(req.query);
        var url = req.query.resourcePath;
        url = url.replace('/v1', '');
        url += '?entityId='+config.hyper_entity
        url = 'https://eu-test.oppwa.com/v1' + url
        const response = await axios.get(url, {
          headers: {
            Authorization: `Bearer ${ config.hyper_access_token}`,
          },
        });
        const status = paymentStatus(response.data);
        res.redirect(config.domain+'status/?st='+status);
      } catch (error) {
        console.error(error);
        res.status(500).send('Proxy request failed');
      }
});
```
The paymentStatus function processes the response to determine the payment status.
```
function isPending(code) {
  for (const exp of PAYMENT_STATUS_MAPPING.pending) {
    if (exp.test(code)) {
      return true;
    }
  }
  return false;
}

function isDone(code) {
  for (const exp of PAYMENT_STATUS_MAPPING.done) {
    if (exp.test(code)) {
      return true;
    }
  }
  return false;
}

function isCancel(code) {
  for (const exp of PAYMENT_STATUS_MAPPING.cancel) {
    if (exp.test(code)) {
      return true;
    }
  }
  return false;
}

const paymentStatus = (data) => {
        const payment_status = data['result']
        const payment_cod = payment_status['code']

      if (isPending(payment_cod)) {
        return 3;
      } else if (isDone(payment_cod)) {
        return 1;
      } else if (isCancel(ppayment_cod)) {
        return 2;
      } else {
        console.log(`HyperPay: Received data with invalid payment status: ${payment_cod} - ${payment_status['description']}`);
      }
      return -1;
  };
```

##  Payment with stripe
Stripe is a premier option for online credit card processing and is the most popular premium payment gateway. This guide will walk you through the two steps required for integrating Stripe into your application.
- build payment button:
To create the payment button, add the following HTML code to payment page.
```
<form id="stripe_form" action="api/stripe/payment" method="POST">
                    </form>
```
In paymentAction.js file, implement the buildStripe function to dynamically generate and append the Stripe script:
```
function buildStripe(props){
     axios.post('/api/stripe/key')
      .then(response => {
        const script = document.createElement('script');
        script.type = 'text/javascript';
        script.src = `https://checkout.stripe.com/v2/checkout.js`;
        script.async = true;
         script.setAttribute('class', 'stripe-button');
        script.setAttribute('data-key', response.data.key);
        script.setAttribute('data-amount', response.data.order.totalPrice);
        script.setAttribute('data-currency', 'EUR');
        script.setAttribute('data-name', response.data.order.user.name);
        script.setAttribute('data-description', 'any');
        script.setAttribute('data-locale', 'auto');
        script.onload = () => {
        };
        document.getElementById('stripe_form').appendChild(script);
      })
      .catch(error => {
        console.error(error);
      });
}
```
- Get payment status
Once the payment has been processed, the customer will be redirected to the specified form action link. Implement the following logic in your server code to handle the payment and retrieve the payment status.
```
router.post('/payment',async (req,res)=>{
    order = await getUserOrder(req);
    stripe.customers.create({
        email: req.body.stripeEmail,
        source: req.body.stripeToken, //'tok_mastercard'
        name: order.user.name,
        address: {
            line1: 'TC 9/4 Old MES colony',
            postal_code: '452331',
            city: 'Pares',
            state: 'Any ',
            country: 'France',
        }
    })
    .then((customer) => {
        return stripe.charges.create({
            amount: order.totalPrice,          
            description: 'any',
            currency: 'EUR',
            customer: customer.id
        });
    })
    .then((charge) => {
        console.log("response: "+ charge);
        res.redirect(config.domain+'status/?st='+1);
    })
    .catch((err) => {
        console.log(err);
        res.redirect(config.domain+'status/?st='+0);
    });
});
```
## Summary
The Simple E-Commerce with HyperPay & Stripe project is a Node.js and React-based e-commerce system with a checkout page for testing payment gateways like HyperPay and Stripe. The project utilizes MongoDB for data storage and offers various features, including product display, cart functionality, and payment processing.