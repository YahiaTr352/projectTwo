// const mongoose = require("mongoose");

// const ConnectDB = async () => {
//   try {
//     await mongoose.connect("mongodb://localhost:/PaymentGateWayTwo");
//     console.log("✅ Connected to MongoDB");

//   } catch (error) {
//     console.error("❌ Failed to connect to MongoDB:", error);
//   }
// };

// module.exports = ConnectDB;
const mongoose = require("mongoose");

const uri = "mongodb+srv://user1:yahiamo99@cluster0.sl0sxvf.mongodb.net/projectP?retryWrites=true&w=majority&appName=Cluster0";

const ConnectDB = async () => {
  try {
    await mongoose.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("✅ connected to MongoDB");
  } catch (error) {
    console.error("❌ failed to connect to MongoDB");
    console.error(error);
  }
};

module.exports = ConnectDB;
