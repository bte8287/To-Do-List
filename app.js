//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const date = require(__dirname + "/date.js");
const mongoose = require("mongoose");
const _ = require("lodash");

//local mongodb connection
//"mongodb://localhost:27017/todolistDB"

//atlas connection
mongoose.connect("mongodb+srv://admin-brandon:Hello123@cluster0.ibykm.mongodb.net/todoListDB", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false
});

const itemsSchema = new mongoose.Schema({
  name: String
});

const Item = mongoose.model("Item", itemsSchema);

const bread = new Item({
  name: "Bread"
});

const water = new Item({
  name: "Water"
});

const beer = new Item({
  name: "Beer"
});

const defaultItems = [bread, water, beer];

const listSchema = new mongoose.Schema({
  name: String,
  items: [itemsSchema]
});

const List = mongoose.model("List", listSchema);


//console.log(date());
const app = express();
//const port = 3000;
//const workItems = [];
//const items = ["Buy Food", "Cook Food", "Eat Food"];

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static("public"));

app.get("/", function(req, res) {
  //using the 'const date = require(__dirname + "/date.js");' in this module, we can use dotnotation to call the specific function to pull back either the day or the date
  //let day = date.getDate();
  const day = date.getDay();

  Item.find({}, function(err, foundItems) {
    if (foundItems.length === 0) {
      Item.insertMany(defaultItems, function(err) {
        if (err) {
          console.log(err);
        } else {
          console.log("Items have been added to collection.");
        }
      });
      res.redirect("/");
    } else {
      res.render("list", {
        listTitle: day,
        newListItems: foundItems
      });
    }
  });
});

app.post("/", function(req, res) {
  const day = date.getDay();
  const itemName = req.body.newItem;
  const listName = req.body.list;

  const item = new Item({
    name: itemName
  });

  if (listName === day) {
    item.save();
    res.redirect("/");
  } else {
    List.findOne({name: listName}, function(err, foundList) {
      if (err) {
        console.log(err);
      } else {
        foundList.items.push(item);
        foundList.save();
        res.redirect("/" + listName);
      }
    });
  }
});

app.post("/delete", function(req, res) {
  const day = date.getDay();
  const checkedItemID = req.body.checkbox;
  const listName = req.body.listName;

  if (listName === day) {
    Item.findByIdAndDelete(checkedItemID, function(err) {
      if (err) {
        console.log(err);
      } else {
        console.log("Checked item has been deleted!");
        res.redirect("/");
      }
    });
  } else {
    List.findOneAndUpdate({name: listName}, {$pull: {items: {_id: checkedItemID}}}, function(err, foundList) {
      if (err) {
        console.log(err);
      } else {
        res.redirect("/" + listName);
      }
    });
  }
});

app.get("/:customListName", function(req, res) {
  const customListName = _.capitalize(req.params.customListName);

  // if (customListName === "Favicon.ico") {
  //   return;
  // }

  List.findOne({name: customListName}, function(err, foundList) {
    if (err) {
      console.log(err);
    }

    if (!foundList) {
      //create a new list
      const list = new List({
        name: customListName,
        items: defaultItems
      });
      list.save();
      res.redirect("/" + customListName);

    } else {
      //show an existing list
      res.render("list", {
        listTitle: foundList.name,
        newListItems: foundList.items
      });
    }
  });
});


app.get("/about", function(req, res) {
  res.render("about");
});

let port = process.env.PORT;
if (port == null || port == "") {
  port = 3000;
}

app.listen(port, function() {
  console.log(`Server started on port: ${port}`);
});
