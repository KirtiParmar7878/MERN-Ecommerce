import braintree from "braintree";

const gateway = new braintree.BraintreeGateway({
  environment: braintree.Environment.Sandbox,
  merchantId: process.env.Braintree_Merchant_ID,
  publicKey: process.env.Braintree_Public_Key,
  privateKey: process.env.Braintree_Private_Key,
});

// Generate client token for the client SDK
export const generateTokenController = async (req, res) => {
  try {
    const response = await gateway.clientToken.generate({});
    res.status(200).send({ success: true, clientToken: response.clientToken });
  } catch (error) {
    console.log(error);
    res.status(500).send({ success: false, message: "Failed to generate client token", error });
  }
};

// Process a transaction using a payment method nonce from the client
export const processPaymentController = async (req, res) => {
  try {
    const { paymentMethodNonce, amount } = req.body;
    if (!paymentMethodNonce || !amount) {
      return res.status(400).send({ success: false, message: "paymentMethodNonce and amount are required" });
    }

    const result = await gateway.transaction.sale({
      amount: String(amount),
      paymentMethodNonce,
      options: { submitForSettlement: true },
    });

    if (result && result.success) {
      res.status(200).send({ success: true, transaction: result.transaction });
    } else {
      res.status(400).send({ success: false, error: result });
    }
  } catch (error) {
    console.log(error);
    res.status(500).send({ success: false, message: "Payment processing failed", error });
  }
};
