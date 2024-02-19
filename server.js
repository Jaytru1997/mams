"use strict";
require("dotenv").config();
const connectDB = require("./db/connect");

const app = require("./app.js");

//Server setup
const port = process.env.PORT || 3000;

//db connect
const start = async () => {
  try {
    await connectDB(process.env.MONGODB_URI);
    console.log("DB Connected");
    app.listen(port, () => {
      console.log(`server is running on port ${port}`);
      console.log(`http://localhost:${port}`);
    });
  } catch (err) {
    console.log(err);
  }
};

//start server
start();
