const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');
const connectDB = require('./config/db');

dotenv.config();

const seedUsers = async () => {
  await connectDB();
  
  try {
    await User.deleteMany(); // Clear existing users
    console.log('Existing users deleted.');

    // Seed mock data
    const users = [
      {
        name: 'Admin User',
        email: 'admin@clinic.com',
        password: 'password123',
        role: 'Admin'
      },
      {
        name: 'Doctor John Doe',
        email: 'doctor@clinic.com',
        password: 'password123',
        role: 'Doctor'
      },
      {
        name: 'Receptionist Jane',
        email: 'receptionist@clinic.com',
        password: 'password123',
        role: 'Receptionist'
      }
    ];

    await User.create(users);
    console.log('Data Imported - Seeding successful');
    process.exit();
  } catch (error) {
    console.error(`Error with data import: ${error}`);
    process.exit(1);
  }
};

seedUsers();
