import * as dotenv from 'dotenv';

dotenv.config();

const process = require("process");

export const JWT_SECRET = process.env.JWT_SECRET;