//jshint esversion:6

const express = require("express");
const mongoose = require("mongoose");
const app = express();

app.set('view engine', 'ejs');

app.use(express.urlencoded({extended: true}));
app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/todolistDB", {useNewUrlParser: true});

const itemSchema = new mongoose.Schema({
  name: String,
});

const Item = mongoose.model("Item", itemSchema);

const item1 = new Item({
  name: "haha"
});
const item2 = new Item({
  name: "hehe"
});
const item3 = new Item({
  name: "hoho"
});

const defaultItems = [item1, item2, item3];

Item.insertMany(defaultItems, function(err) {
  if (err) {
    console.log(err);
  } else {
    console.log("Successfully inserted");
  }
});

app.get("/", function(req, res) {

  Item.find({}, function(err, foundItems) {
    if (err) {
      console.log(err);
    } else {
      res.render("list", {listTitle: "Today", newListItems: foundItems});
    }
  });

});

app.post("/", function(req, res){

  const item = req.body.newItem;

  if (req.body.list === "Work") {
    workItems.push(item);
    res.redirect("/work");
  } else {
    items.push(item);
    res.redirect("/");
  }
});

app.get("/work", function(req,res){
  res.render("list", {listTitle: "Work List", newListItems: workItems});
});

app.get("/about", function(req, res){
  res.render("about");
});

app.listen(3000, function() {
  console.log("Server started on port 3000");
});
