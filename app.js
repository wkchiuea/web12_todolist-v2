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

const listSchema = new mongoose.Schema({
  name: String,
  items: [itemSchema]
});
const List = mongoose.model("List", listSchema);



app.get("/", function(req, res) {

  Item.find({}, function(err, foundItems) {

    if (foundItems.length === 0) {
      Item.insertMany(defaultItems, function(err) {
        if (err) {
          console.log(err);
        } else {
          console.log("Successfully inserted");
        }
      });
      res.redirect("/");
    } else {
      res.render("list", {listTitle: "Today", newListItems: foundItems});
    }

  });

});

app.post("/", function(req, res){

  const itemName = req.body.newItem;
  const listName = req.body.list;

  const newItem = new Item({
    name: itemName
  });

  if (listName === "Today") {
    newItem.save();
    res.redirect("/");
  } else {
    List.findOne({name: listName}, function(err, foundList) {
      foundList.items.push(newItem);
      foundList.save();
      res.redirect("/" + listName);
    });
  }

});

app.post("/delete", function(req, res) {
  const checkedItemId = req.body.checkbox;

  Item.findByIdAndRemove(checkedItemId, function(err) {
    if (err) {
      console.log(err);
    } else {
      res.redirect("/");
    }
  });

  // Item.deleteOne({_id: checkItemId}, function(err) {
  //   if (err) {
  //     console.log(err);
  //   } else {
  //     console.log("Successfully deleted one item.");
  //   }
  // });

});

app.get("/:customListName", function(req, res) {
  const customListName = req.params.paramName;

  List.findOne({name: customListName}, function(err, foundList) {
    if (err) {
      console.log(err);
    } else if (!foundList) {
      const list = new List({
        name: customListName,
        items: defaultItems
      });
    
      list.save();
      res.redirect("/" + customListName);
    } else {
      res.render("list", {listTitle: foundList.name, newListItems: foundList.items});
    }
  });

});

app.listen(3000, function() {
  console.log("Server started on port 3000");
});
