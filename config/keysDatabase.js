// config/keysDatabase.js
const mongoose = require('mongoose');

let keysConnection;

const connectKeysDB = () => {
  if (keysConnection) return keysConnection;

  keysConnection = mongoose.createConnection("mongodb+srv://user1:yahiamo99@cluster0.0gd385v.mongodb.net/keysProject?retryWrites=true&w=majority&appName=Cluster0", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  keysConnection.on('connected', () => {
    console.log('✅ Connected to Keys DB');
  });

  keysConnection.on('error', (err) => {
    console.error('❌ Error in Keys DB connection:', err);
  });

  return keysConnection;
};

module.exports = connectKeysDB;
