import connect from '@/config/db.config';
import environment from '@/config/env.config';

const startServer = async () => {
  try {
    console.log('🚀 Starting Express server on port:', process.env.PORT || environment.port);
    const connected = await connect();
    if (!connected) {
      throw new Error('Failed to connect to MongoDB');
    }

    // Dynamically import app.config AFTER database connection is established
    // This ensures Better Auth's mongodbAdapter has access to active mongoDb and mongoClient
    const { default: app } = await import('@/config/app.config');

    const port = process.env.PORT ? Number(process.env.PORT) : environment.port;

    app.listen(port, () => {
      console.log(
        `🌍 [${environment.packageName}:${environment.env}] is listening on port ${port}`
      );
    });
  } catch (error) {
    console.error('unable to start the Express API', error);
    process.exit(1);
  }
};

startServer();
