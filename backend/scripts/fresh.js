import { dropUsersTable, createUsersTable } from '../migrations/createUsersTable.js';
import seedUsers from '../seeders/userSeeder.js';
import { connectDB } from '../config/database.js';

const freshMigration = async () => {
  try {
    console.log(' Starting fresh migration...\n');
    
    // Connect to database
    await connectDB();
    
    // Drop and recreate tables
    console.log(' Step 1: Dropping tables...');
    await dropUsersTable();
    console.log(' Tables dropped\n');
    
    // Create tables
    console.log(' Step 2: Creating tables...');
    await createUsersTable();
    console.log(' Tables created\n');
    
    // Seed data
    console.log(' Step 3: Seeding data...');
    await seedUsers();
    console.log(' Data seeded\n');
    
    console.log(' Fresh migration completed successfully!');
    console.log('\n Database has been reset and fresh data has been seeded.');
    
    process.exit(0);
  } catch (error) {
    console.error(' Fresh migration failed:', error.message);
    process.exit(1);
  }
};

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  freshMigration();
}

export default freshMigration;