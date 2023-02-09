const mongoose = require("mongoose");
const connection = require("../utils/database");

const pageSchema = new mongoose.Schema({
    page: Object
})

const Page = connection.model("Page",pageSchema);

module.exports = Page;