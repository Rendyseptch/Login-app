import { connectDB } from '../config/database.js';
import { User } from '../models/User.js';
import bcrypt from 'bcryptjs';

const runSeeder = async () => {
  try {
    console.log(' Starting seeder...');
    await connectDB();
    await seedUsers();
    process.exit(0);
  } catch (error) {
    console.error(' Seeding failed:', error.message);
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

  let createdCount = 0;
  let skippedCount = 0;
  
  for (const userData of users) {
    try {
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
};

if (import.meta.url === `file://${process.argv[1]}`) {
  runSeeder();
}

export default runSeeder;