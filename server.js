const express = require("express");
const cors = require("cors");
const app = express();
const mongoose = require("mongoose");
const router = require("./routes");
const PORT = process.env.PORT || 5000;
const { MONGOURI } = require("./config/mongodb.conf");

mongoose.connect(MONGOURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
});

mongoose.connection.on("connected", () => {
  console.log(`Connected to ${MONGOURI.substr(73, 11)} DB`);
});

mongoose.connection.on("error", (err) => {
  console.log("Error connecting, something went wrong :(", err);
});

let corsOptions = {
  origin: "http://localhost:5000",
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/v1", router);
app.listen(PORT, () => {
  console.log(`Connection established on port: ${PORT}`);
});
