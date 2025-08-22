import app from './app';
import { databaseConfig } from "./config/database/database.config";
import { initializeDatabase } from "./config/database/initialize-database.config";

initializeDatabase().then(() => {
  console.log(`Connected to postgres database ${databaseConfig.database.database}`);
  const PORT = databaseConfig.port || 4000;
  
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
});
