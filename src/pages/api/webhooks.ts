import { NextApiRequest, NextApiResponse } from "next";
import { Readable } from "stream";
import Stripe from "stripe";
import { stripe } from "../../services/stripe";

async function buffer(readable: Readable) {
  const chuncks = [];

  for await (const chunck of readable) {
    chuncks.push(typeof chunck === "string" ? Buffer.from(chunck) : chunck);
  }

  return Buffer.concat(chuncks);
}

export const config = {
  api: {
    bodyParser: false,
  },
};

const relevantEvents = new Set([
  'checkout.session.completed'
])

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === "POST") {
    const buf = await buffer(req);
    const secret = req.headers['stripe-signature'];

    let event: Stripe.Event;

    try {
      event = stripe.webhooks.constructEvent(buf, secret, process.env.STRIPE_WEBHOOK_SECRET)
    } catch (err) {
      return res.status(400).send(`Webhook error ${err.message}`);
    }

    const type = event.type;

    if (relevantEvents.has(type)) {

    }

    res.json({ received: true });
  } else {
    res.setHeader('Allow', 'POST')
    res.status(405).end('Method not allowed')
  }
};
