import { User } from '../models/User.js';
import { connectDB } from '../config/database.js';
import bcrypt from 'bcryptjs';

const seedUsers = async () => {
  try {
    console.log(' Connecting to database...');
    await connectDB();
    
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
          console.log(`⏭ User ${userData.username} already exists`);
          skippedCount++;
        }
      } catch (error) {
        console.error(` Error creating user ${userData.username}:`, error.message);
      }
    }
    
    console.log('\n Seeding Summary:');
    console.log(` Created: ${createdCount} users`);
    console.log(`⏭ Skipped: ${skippedCount} users`);
    console.log(' Seeding completed!');
    
  } catch (error) {
    console.error(' Seeding error:', error.message);
    process.exit(1);
  }
};

// Run seeder if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  seedUsers().then(() => {
    process.exit(0);
  }).catch(() => {
    process.exit(1);
  });
}

export default seedUsers;