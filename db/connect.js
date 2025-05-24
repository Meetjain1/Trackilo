import mongoose from 'mongoose'

let isConnected = false;
let connectionRetries = 0;
const MAX_RETRIES = 5;

const connectDB = async (url, options = {}) => {
  if (!url) {
    throw new Error('MongoDB connection URL is required');
  }

  if (isConnected) {
    console.log('Using existing database connection');
    return;
  }

  mongoose.set('strictQuery', true);
  
  // Enhanced options for better performance and reliability
  const defaultOptions = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    maxPoolSize: 50,
    minPoolSize: 10,
    serverSelectionTimeoutMS: 10000,
    socketTimeoutMS: 45000,
    family: 4,
    keepAlive: true,
    keepAliveInitialDelay: 300000,
    autoIndex: false,
    connectTimeoutMS: 10000,
    heartbeatFrequencyMS: 30000,
    retryWrites: true,
    w: 'majority'
  };

  try {
    const db = await mongoose.connect(url, { ...defaultOptions, ...options });
    isConnected = true;
    connectionRetries = 0; // Reset retries on successful connection
    console.log(`MongoDB Connected: ${db.connection.host}`);
    
    // Handle connection errors
    mongoose.connection.on('error', async (err) => {
      console.error('MongoDB connection error:', err);
      isConnected = false;
      
      if (connectionRetries < MAX_RETRIES) {
        connectionRetries++;
        console.log(`Attempting to reconnect (${connectionRetries}/${MAX_RETRIES})...`);
        
        try {
          await mongoose.disconnect();
          await connectDB(url, options);
        } catch (reconnectError) {
          console.error('Reconnection failed:', reconnectError);
        }
      } else {
        console.error('Max reconnection attempts reached');
        process.exit(1);
      }
    });

    mongoose.connection.on('disconnected', () => {
      console.log('MongoDB disconnected');
      isConnected = false;
    });

    mongoose.connection.on('connected', () => {
      console.log('MongoDB connected');
      isConnected = true;
    });

    mongoose.connection.on('reconnected', () => {
      console.log('MongoDB reconnected');
      isConnected = true;
    });

    // Graceful shutdown
    process.on('SIGINT', async () => {
      try {
        await mongoose.connection.close();
        console.log('MongoDB connection closed through app termination');
        process.exit(0);
      } catch (err) {
        console.error('Error closing MongoDB connection:', err);
        process.exit(1);
      }
    });

    return db;
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
    isConnected = false;
    
    if (connectionRetries < MAX_RETRIES) {
      connectionRetries++;
      console.log(`Retrying connection (${connectionRetries}/${MAX_RETRIES})...`);
      await new Promise(resolve => setTimeout(resolve, 5000));
      return connectDB(url, options);
    } else {
      console.error('Max connection attempts reached');
      throw error;
    }
  }
}

export default connectDB