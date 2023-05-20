import axios from 'axios';
import express from 'express';
import config from '../config';
//var queryString = require('query-string');


const router = express.Router();

router.post('/init', async (req, res) => {
  try {
    const url = 'https://eu-test.oppwa.com/v1/checkouts';

    const data = {
      entityId: config.hyper_entity,
      amount: '5000.00',
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

const PAYMENT_STATUS_MAPPING = {
  pending: [
    /^(000\.200)/,
    /^(800\.400\.5|100\.400\.500)/,
  ],
  done: [
    /^(000\.000\.|000\.100\.1|000\.[36])/,
    /^(000\.400\.0[^3]|000\.400\.[0-1]{2}0)/,
  ],
  cancel: [
    /^(000\.400\.[1][0-9][1-9]|000\.400\.2)/,
    /^(800\.[17]00|800\.800\.[123])/,
    /^(900\.[1234]00|000\.400\.030)/,
    /^(800\.[56]|999\.|600\.1|800\.800\.[84])/,
    /^(100\.39[765])/,
    /^(300\.100\.100)/,
    /^(100\.400\.[0-3]|100\.38|100\.370\.100|100\.370\.11)/,
    /^(800\.400\.1)/,
    /^(800\.400\.2|100\.380\.4|100\.390)/,
    /^(100\.100\.701|800\.[32])/,
    /^(800\.1[123456]0)/,
    /^(600\.[23]|500\.[12]|800\.121)/,
    /^(100\.[13]50)/,
    /^(100\.250|100\.360)/,
    /^(700\.[1345][05]0)/,
    /^(200\.[123]|100\.[53][07]|800\.900|100\.[69]00\.500)/,
    /^(100\.800)/,
    /^(100\.[97]00)/,
    /^(100\.100|100.2[01])/,
    /^(100\.55)/,
    /^(100\.380\.[23]|100\.380\.101)/,
    /^(000\.100\.2)/,
  ],
};

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
//        res.send(response.data);
      } catch (error) {
        console.error(error);
        res.status(500).send('Proxy request failed');
      }
});



export default router;