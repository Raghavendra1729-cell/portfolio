import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error('Please define the MONGODB_URI environment variable inside .env.local');
}

const MAX_CONNECT_RETRIES = 3;
const INITIAL_RETRY_DELAY_MS = 1_500;

mongoose.set('bufferCommands', false);

interface MongooseCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

declare global {
  var mongoose: MongooseCache | undefined;
}

const cached = global.mongoose ?? (global.mongoose = { conn: null, promise: null });

const connectionOptions: mongoose.ConnectOptions = {
  appName: 'portfolio',
  autoIndex: false,
  bufferCommands: false,
  connectTimeoutMS: 10_000,
  family: 4,
  heartbeatFrequencyMS: 10_000,
  maxIdleTimeMS: 30_000,
  maxPoolSize: 10,
  minPoolSize: 0,
  serverSelectionTimeoutMS: 5_000,
  socketTimeoutMS: 45_000,
};

function wait(delayMs: number) {
  return new Promise((resolve) => setTimeout(resolve, delayMs));
}

function isRetryableConnectionError(error: unknown) {
  if (!(error instanceof Error)) {
    return false;
  }

  const message = error.message.toLowerCase();

  return [
    'server selection timed out',
    'timed out',
    'econnreset',
    'econnrefused',
    'connection closed',
    'topology was destroyed',
    'failed to connect',
    'querysrv',
  ].some((fragment) => message.includes(fragment));
}

async function createConnection() {
  let lastError: unknown;

  for (let attempt = 1; attempt <= MAX_CONNECT_RETRIES; attempt += 1) {
    try {
      return await mongoose.connect(MONGODB_URI, connectionOptions);
    } catch (error) {
      lastError = error;
      cached.promise = null;

      if (!isRetryableConnectionError(error) || attempt === MAX_CONNECT_RETRIES) {
        break;
      }

      await wait(INITIAL_RETRY_DELAY_MS * attempt);
    }
  }

  throw new Error(
    lastError instanceof Error
      ? `MongoDB connection failed after ${MAX_CONNECT_RETRIES} attempts: ${lastError.message}`
      : `MongoDB connection failed after ${MAX_CONNECT_RETRIES} attempts.`,
  );
}

export default async function dbConnect() {
  if (cached.conn && mongoose.connection.readyState === 1) {
    return cached.conn;
  }

  if (!cached.promise) {
    cached.promise = createConnection();
  }

  try {
    cached.conn = await cached.promise;
    return cached.conn;
  } catch (error) {
    cached.promise = null;
    cached.conn = null;
    throw error;
  }
}
