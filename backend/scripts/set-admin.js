import dotenv from 'dotenv';
import mongoose from 'mongoose';
import User from '../models/userModel.js';

dotenv.config();

async function main() {
  const args = process.argv.slice(2);
  if (args.length < 2) {
    console.log('Usage: node set-admin.js <email> <true|false>');
    process.exit(1);
  }
  const [email, flag] = args;
  const value = flag === 'true' || flag === '1';

  if (!process.env.MONGODB_URI) {
    console.error('MONGODB_URI not set in .env');
    process.exit(1);
  }

  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    const user = await User.findOne({ email });
    if (!user) {
      console.error('User not found:', email);
      process.exit(2);
    }

    user.admin = value;
    await user.save();

    console.log(`User ${email} admin set to ${value}`);
    console.log(user);
    process.exit(0);
  } catch (err) {
    console.error('Error:', err);
    process.exit(3);
  }
}

main();
