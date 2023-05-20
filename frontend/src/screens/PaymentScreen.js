import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { savePayment } from '../actions/cartActions';
import CheckoutSteps from '../components/CheckoutSteps';
import axios from 'axios';
import { initCheckout, buildStripe } from '../actions/paymentAction';

function PaymentScreen(props) {
  const [paymentMethod, setPaymentMethod] = useState('');
  const [hyperpayRet, setHyperpayRet] = useState('');
  const [isStripeLoaded, setIsStripeLoaded] = useState(false)

  const dispatch = useDispatch();
  axios.get("/api/config/server").then(response => {
        setHyperpayRet(response.data + 'api/hyperpay/payment');
  });

  const submitHandler = (e) => {
    e.preventDefault();
    dispatch(savePayment({ paymentMethod }));
    props.history.push('placeorder');
  };
  const paymentMethodChange = (event) => {
    if (event.target.value == 'stripe' && !isStripeLoaded){
        buildStripe();
        setIsStripeLoaded(true)
    }

    if (event.target.value == 'hyperpay'){
        initCheckout();
    }

    setPaymentMethod(event.target.value);
  };

  return (
    <div>
      <CheckoutSteps step1 step2 step3></CheckoutSteps>
      <div className="form">
          <ul className="form-container payment-method-list">
            <li className="bg-white no-border">
              <h2>Payment</h2>
            </li>

            <li>
              <div>
                <input
                  type="radio"
                  name="paymentMethod"
                  id="paymentMethod"
                  value="stripe"
                  onChange={paymentMethodChange}
                ></input>
                <label htmlFor="paymentMethod">Stripe</label>
                <div className={paymentMethod == 'stripe' ? 'form ': 'form d-none'}>
                    <form id="stripe_form" action="api/stripe/payment" method="POST">
                    </form>
                </div>
              </div>
            </li>
            <li>
              <div>
                <input
                  type="radio"
                  name="paymentMethod"
                  id="paymentMethod"
                  value="hyperpay"
                  onChange={paymentMethodChange}
                ></input>
                <label htmlFor="paymentMethod">HyperPay</label>
                <div className={paymentMethod == 'hyperpay' ? 'form': 'form d-none'}>
                    <form id="hyperpay_form" action={hyperpayRet} className='paymentWidgets' data-brands="VISA MASTER AMEX"></form>
                </div>
              </div>

            </li>
          </ul>
      </div>
    </div>
  );
}


export default PaymentScreen;
