const axios = require('axios');

const PUBLIC_TOKEN = process.env.FLOUCI_APP_ID;
const APP_TOKEN = process.env.FLOUCI_APP_SECRET;

const headers = {
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${APP_TOKEN}`, 
};

const createFlouciPayment = async (bookingId, amount) => {
  const response = await axios.post('https://dev.flouci.com/api/generate_payment', {
    app_token: PUBLIC_TOKEN, 
    amount,
    success_link: `http://localhost:5000/api/payment/flouci/success?bookingId=${bookingId}`,
    fail_link: `http://localhost:5000/api/payment/flouci/fail?bookingId=${bookingId}`,
    accept_card: "true",
  }, { headers });

  return response.data.result.link;
};

module.exports = { createFlouciPayment };
