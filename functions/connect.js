const { MongoClient } = require("mongodb");
const connectionString = process.env.CONNECTION_STR;

const client = new MongoClient(connectionString, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

let db;

module.exports = {
  connectToServer: function (callback) {
    client.connect(function (err, dbi) {
      if (err || !dbi) {
        return callback(err);
      } 

      db = dbi.db("ClimbGrader");
      console.log("Successfully connected to MongoDB. 'ClimbGrader' ");

      return callback();
    });
  },

  getDb: function () {
    return db;
  },
  
};