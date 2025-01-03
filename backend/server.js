// server.js
const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const PORT = 3000;
const { DB } = require("./database/firebaseConfig");
const { getDocs, collection } = require("firebase/firestore");
// Middleware
app.use(bodyParser.json());

// Routes

const stripe = require("stripe")(
  "sk_test_51QEIiGCRwZ65hD9OQXlpO0fVv30YNMnibAFUlVJXogAgAHVRpMhP9CToRmo3WMLfA3uDyaZwZ2RbBLaWFVZIVlbQ00eNaXpQPq"
);
// This example sets up an endpoint using the Express framework.
// Watch this video to get started: https://youtu.be/rPR2aJ6XnAc.
app.get("/pubkey", async (req, res) => {
  console.log("Publisher Key");
  res.json({
    key: "pk_test_51QEIiGCRwZ65hD9Onm8DbIIWq0L7dU4nY9tA2UiGz02kkFEVQC8QxGdYUHXKvurk1uApOjCYZtIFrSBUt1cMV8DH00XzShCn9k",
  });
});

app.get("/transactions", async (req, res) => {
  console.log("HIT");

  try {
    // Fetch Stripe transactions
    const transactions = await stripe.paymentIntents.list({
      limit: 100, // Adjust as needed
    });

    // res.status(200).json(transactions);
    // res.setHeader('Content-Type', 'application/json');
    // console.log(response.json());

    res.status(200).json(transactions);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post("/payment-sheet", async (req, res) => {
  const { total, metadata } = req.body;
  console.log("🔴 ~ file: server.js:45 ~ app.post ~ total:" + total);

  try {
    // Convert total to paisa and ensure it's an integer
    const amountInPaisa = Math.round(total * 100);
    console.log(
      "🔴 ~ file: server.js:51 ~ app.post ~ amountInPaisa:",
      amountInPaisa
    );

    const paymentIntent = await stripe.paymentIntents.create({
      amount: amountInPaisa,
      currency: "pkr",
      metadata: {
        jobId: metadata.jobId,
        userId: metadata.userId,
      },
      automatic_payment_methods: {
        enabled: true,
      },
    });

    const customer = await stripe.customers.create();
    const ephemeralKey = await stripe.ephemeralKeys.create(
      { customer: customer.id },
      { apiVersion: "2023-10-16" }
    );

    res.json({
      paymentIntent: paymentIntent.client_secret,
      ephemeralKey: ephemeralKey.secret,
      customer: customer.id,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
});

app.listen(3000, () => {
  console.log("Listening on http://localhost:3000");
});
