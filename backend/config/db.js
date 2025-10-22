import mogoose from 'mongoose';

const connectDatabase = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI || 'your_connection_string');
        console.log('Database connected successfully');

    } catch (error){
        console.error('Database connection failed:', error);
        process.exit(1);
    }

};

export default connectDatabase;