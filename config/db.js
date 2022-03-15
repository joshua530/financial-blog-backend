const mongoose = require('mongoose');

const connection = async () => {
  try {
    const conn = await mongoose.connect(process.env.DB_URI, {
      autoIndex: false
    });
    console.log(
      `Database successfully connected: ${conn.connection.host}`.green
    );
  } catch (e) {
    console.log(e);
    process.exit(1);
  }
};

module.exports = connection;
