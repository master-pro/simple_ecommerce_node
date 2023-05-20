import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { savePayment } from '../actions/cartActions';
import CheckoutSteps from '../components/CheckoutSteps';
import axios from 'axios';

function PaymentStatusScreen(props) {
     const query = new URLSearchParams(props.location.search);
      return (
    <div>
      <CheckoutSteps step1 step2 step3 step4></CheckoutSteps>
      <div className="form">
          <ul className="form-container">
            <li>
              <h2>Payment Status</h2>
            </li>

            <li>
              <div className="pg-primary">
                   {query.get("st") =="1" && (
                        <div> Successful Payment </div>
                  )}
                  {query.get("st") !=="1" && (
                        <div> Failed Payment </div>
                  )}
              </div>
            </li>
            <li>
              <div className="button primary">
                <Link to="/">Back to shop</Link>
              </div>
            </li>
          </ul>
      </div>
    </div>
  );
}
export default PaymentStatusScreen;