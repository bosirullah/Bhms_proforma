const express = require("express");
const _ = require("lodash");
const app = express();

app.set("view engine","ejs");

app.use(express.static("public"));

app.get("/",(req,res)=>{
    res.render("login");
});

app.get("/:customRouteName",(req,res)=>{
    const customRouteName = _.capitalize(req.params.customRouteName);
    res.render(customRouteName);
});

app.get("/*", (req, res) => {
    res.render("errorPage");
})


const PORT = process.env.PORT || 3000;
app.listen(PORT,()=>{
    console.log(`Server is running on port ${PORT} .....`);
});