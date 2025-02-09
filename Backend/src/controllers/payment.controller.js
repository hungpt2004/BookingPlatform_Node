require("dotenv").config();
const PayOs = require("@payos/node");
const asyncWrapper = require("../middlewares/asyncHandler");
const user = require("../models/user");

const payOs = new PayOs(
  process.env.CLIENT_ID,
  process.env.API_KEY,
  process.env.CHECKSUM_KEY
);

exports.createPaymentLink = asyncWrapper(async (req, res) => {
  //user

  const { orderCode, amount, items } = req.body;

  const newOrder = {
    orderCode: orderCode,
    amount: amount,
    items: items,
    buyerName: user.name,
    buyerEmail: user.email,
    buyerAddress: user.address,
    buyerPhone: user.phone,
    returnUrl: `${process.env.DOMAIN_URL}/success`,
    cancelUrl: `${process.env.DOMAIN_URL}/cancel`,
  };

  const paymentLink = await payOs.createPaymentLink(newOrder);

  res.redirect(303, paymentLink.checkoutUrl);
});
