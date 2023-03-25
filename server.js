// requiring all modules
const express = require("express");
const app = express();
const routes = require("./routes/formRoutes");
const userRoutes = require("./routes/userRoutes");
const mongoose = require("mongoose");

require("dotenv").config();

// set view engine
app.set("view engine", "ejs");

app.use(express.static("public"));

mongoose.set("strictQuery", false);
mongoose.connect("mongodb://127.0.0.1:27017/patientlistDB");

app.use(userRoutes);
app.use(routes);



const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT} .....`);
});
