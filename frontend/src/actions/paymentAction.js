import axios from 'axios';
const queryString = require('query-string');
const stripe = require('stripe');

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

function buildStripe(props){
     axios.post('/api/stripe/key')
      .then(response => {
        const script = document.createElement('script');
        script.type = 'text/javascript';
        script.src = `https://checkout.stripe.com/v2/checkout.js`;
        script.async = true;
         script.setAttribute('class', 'stripe-button');
        script.setAttribute('data-key', response.data);
        script.setAttribute('data-amount', '500000');
        script.setAttribute('data-currency', 'EUR');
        script.setAttribute('data-name', 'Crafty Gourav');
        script.setAttribute('data-description', 'Handmade Art and Craft Products');
        script.setAttribute('data-locale', 'auto');
        script.onload = () => {
        };
        document.getElementById('stripe_form').appendChild(script);
      })
      .catch(error => {
        console.error(error);
      });
}
export { initCheckout,buildStripe };