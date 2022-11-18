const mongoose = require('mongoose');

const connectToDatabase = async () => {
    await mongoose.connect(`mongodb+srv://${process.env.MONGODB_USERNAME}:${process.env.MONGODB_PASSWORD}@nodejs.lsz9tck.mongodb.net/database?retryWrites=true&w=majority`, (error) => {
        if (error) {
            return console.log('There was an error when connecting to the database');
        }
        return console.log('Connected to the database sucessfilly');
    });
}

module.exports = connectToDatabase;