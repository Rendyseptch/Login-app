import { connectDB } from '../config/database.js';
import { User } from '../models/User.js';
import bcrypt from 'bcryptjs';

const setupDatabase = async () => {
  try {
    console.log(' Starting database setup...\n');
    
    // Step 1: Connect to database
    await connectDB();
    
    // Step 2: Seed data
    console.log(' Seeding data...');
    await seedUsers();
    console.log(' Seeding completed\n');
    
    console.log(' Database setup completed successfully!');
    console.log('\n You can now:');
    console.log('   - Run backend: npm run dev');
    console.log('   - Run frontend: cd frontend && npm run dev');
    console.log('   - Login with: admin@example.com / admin123');
    
    process.exit(0);
  } catch (error) {
    console.error(' Database setup failed:', error.message);
    process.exit(1);
  }
};

const seedUsers = async () => {
  const users = [
    {
      username: 'admin',
      email: 'admin@example.com',
      password: 'admin123'
    },
    {
      username: 'user1',
      email: 'user1@example.com',
      password: 'user1123'
    },
    {
      username: 'testuser',
      email: 'test@example.com',
      password: 'test123'
    }
  ];

  console.log(' Seeding users...');
  
  let createdCount = 0;
  let skippedCount = 0;
  
  for (const userData of users) {
    try {
      // Check if user exists
      const existingUser = await User.findByEmail(userData.email) || await User.findByUsername(userData.username);
      
      if (!existingUser) {
        await User.create(userData);
        console.log(` User ${userData.username} created`);
        createdCount++;
      } else {
        console.log(` User ${userData.username} already exists`);
        skippedCount++;
      }
    } catch (error) {
      console.error(` Error creating user ${userData.username}:`, error.message);
    }
  }
  
  console.log('\n Seeding Summary:');
  console.log(` Created: ${createdCount} users`);
  console.log(` Skipped: ${skippedCount} users`);
  console.log(' Seeding completed!');
};

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  setupDatabase();
}

export default setupDatabase;