import * as cron from 'node-cron';
import { MongoClient } from 'mongodb';
import { env } from 'process';

const uri: string = `mongodb://${env.DB_USER}:${env.DB_PASSWORD}@${env.DB_HOST}:${env.DB_PORT}`;
const client = new MongoClient(uri);

const weekMilliseconds: number = 7 * 24 * 60 * 60 * 1000;

const main = async () => {
  try {
    // Connect to the MongoDB cluster
    await client.connect();
    console.info("Cron carts cleaner task started");
    runCron();
  } catch (e) {
    console.error(e);
  } finally {
    await client.close();
  }
};

const runCron = () => {
  cron.schedule('0 0 * * *', function () {
    client.db().collection('carts')
      .deleteMany(
        {
          created_at:
          {
            $lt: new Date(new Date().getTime() - weekMilliseconds)
          }
        });
  });
};

main();