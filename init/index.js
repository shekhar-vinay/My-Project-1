const mongoose = require("mongoose");
const initData = require("./data.js");
const listing = require("../models/listing.js");

// Connecting with the DB
main().then(() => {
    console.log("Connected to DB");
    return initDB();
  })
.catch( err => console.log(err) );

async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/wanderLust');
}

async function initDB () {
  try {
      await listing.deleteMany({});
      const updtData = initData.data.map((obj) => ({...obj, owner: '69719f116ec9dbf1de08556f'}));
      await listing.insertMany(updtData);
      console.log("data was initialised");
  }catch(err) {
      console.log("Error initialising the db:",err)
  }
    
}

initDB();