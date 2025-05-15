const { Kafka } = require('kafkajs');
const express = require('express');

const KAFKA_BOOTSTRAP_SERVER = process.env.KAFKA_BOOTSTRAP_SERVER || 'localhost:9080';

const app = express();
app.use(express.json());

const kafka = new Kafka({
  clientId: 'event-service',
  brokers: [KAFKA_BOOTSTRAP_SERVER],
});

const producer = kafka.producer();
const consumer = kafka.consumer({ groupId: 'event-group' });

app.post('/events', async (req, res) => {
  const { eventType, payload } = req.body;
  try {
    await producer.connect();
    await producer.send({
      topic: 'user-events',
      messages: [
        { value: JSON.stringify({ eventType, payload, timestamp: new Date() }) },
      ],
    });
    res.status(200).send({ message: 'Event published successfully' });
  } catch (error) {
    console.error('Error publishing event', error);
    res.status(500).send({ error: 'Error publishing event' });
  }
});

(async function runConsumer() {
  await consumer.connect();
  await consumer.subscribe({ topic: 'user-events', fromBeginning: true });

  await consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      console.log(`Received message in ${topic}: `, message.value.toString());
    },
  });
})();

app.listen(4002, () => {
  console.log('Event service listening on port 4002');
});