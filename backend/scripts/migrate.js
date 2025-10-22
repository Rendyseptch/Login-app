import { createUsersTable } from '../migrations/createUsersTable.js';
import { connectDB } from '../config/database.js';

const runMigrations = async () => {
  try {
    console.log(' Running migrations...');
    await connectDB();
    
    // Run migrations
    await createUsersTable();
    
    console.log(' All migrations completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error(' Migration failed:', error.message);
    process.exit(1);
  }
};

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  runMigrations();
}

export default runMigrations;