import dotenv from 'dotenv';

dotenv.config();

export default {
  PORT: process.env.PORT || 5000,
  MONGODB_URL: process.env.MONGODB_URL || 'mongodb://localhost/ecommerce',
  JWT_SECRET: process.env.JWT_SECRET || 'somethingsecret',
  PAYPAL_CLIENT_ID: process.env.PAYPAL_CLIENT_ID || 'sb',
  accessKeyId: process.env.accessKeyId || 'accessKeyId',
  secretAccessKey: process.env.secretAccessKey || 'secretAccessKey',
  hyper_access_token: process.env.HYPER_ACCESS_TOKEN || 'hyperaccesstoken',
  hyper_entity: process.env.HYPER_ENTITY || 'hyperentity',
  stripe_public_key :process.env.PUBLIC_KEY,
  stripe_secret_key :process.env.SECRET_KEY,
  domain: process.env.DOMAIN || 'http://localhost:3000/',
  server: process.env.SERVER || 'http://localhost:5000/',
};
