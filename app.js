const express = require('express');
const bodyParser = require('body-parser');
const ejs = require('ejs');
const _ = require('lodash');
const date = require(__dirname+'/date.js');
// console.log(date());
const mongoose = require('mongoose');
mongoose.set('strictQuery', false);

// mongoose.connect('mongodb://127.0.0.1:27017/todoDB', (err)=>{
mongoose.connect('mongodb+srv://todo:pro@cluster0.uie3nbq.mongodb.net/todoDB', (err)=>{
  if(err) {
    console.log(err);
  } else {
    console.log("Database connected Successfully");
  }
});
const itemSchema = {
  name: String
};
const custSchema = {
  name: String,
  items: [itemSchema]
};
const custList = mongoose.model("custList", custSchema);
const itemDB = mongoose.model("Item", itemSchema);
const workDB = mongoose.model("Work", itemSchema);

const itemdef = [
  {
    name: "Apple"
  },
  {
    name: "Banana"
  },
  {
    name: "Kiwi"
  },
  {
    name: "Orange"
  }
];

const app = express();
app.set('view engine', "ejs");
// we can still push in const array but can't change it completely i.e. items = ['shbf']
const items = ["Apple", "Pizza", "Orange", "Banana"];
const workitems = [];

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));


// getting date from another js file and sending the output to the webpage
app.get('/',(req, res)=>{
  itemDB.find((err, got)=>{
    // console.log(got.name);
    if(got.length == 0) {
      itemDB.insertMany(itemdef);
    }
    res.render('index', {day: date.getDate(), newi: got});
  });
});


app.get("/work", (req, res)=>{
  workDB.find((err, got)=>{
    res.render('index', {day: "Work List", newi: got})
  });
});


// get the post from both work and root also as only one ejs file is their, therefore handling them aaccordingly
app.post('/', (req, res)=>{
  // console.log(req.body.newItem);
  // console.log(req.body);
  // everything posting to here therefore using button to judge from which page the the post is coming
  var item = req.body.newItem;
  const iteminsch = {
    name: item
  };
  if(req.body.button == 'Work List')
  {
    // workitems.push(item);
    workDB(iteminsch).save();
    res.redirect('/work');
  }
  else if(req.body.button == date.getDate()) {
    // items.push(item);
    itemDB(iteminsch).save();
    res.redirect('/');
  } else {
    custList.findOne({name: req.body.button}, (er, got)=>{
      // console.log(got.items);
      got.items.push(iteminsch);
      got.save();
      // console.log(got.items);
      // custList.updateOne({name: got.name}, {items: got.items});
      res.redirect('/'+got.name);
    });
  }

});


app.post('/delete', (req, res)=>{
  // console.log(req.body.checkbox);
  // const cb = req.body.checkbox;
  // const cbarr = cb.split(',');
  // const checkedItemId = cbarr[cbarr.length - 1];
  // console.log(checkedItemId);

  const checkedItemId = req.body.checkbox;
  const title = req.body.title;

  if(title == 'Work List') {
    workDB.findByIdAndRemove(checkedItemId, (er)=>{
      console.log("Deleted Successfully");
      res.redirect('/work');
    });
  } else if(title == date.getDate()) {
    itemDB.findByIdAndRemove(checkedItemId, (er)=>{
      console.log("Deleted Successfully");
      res.redirect('/');
    });
  } else {
    custList.findOneAndUpdate({name: title}, {$pull: {items: {_id: checkedItemId}}}, (err, got)=>{
      if(!err){
        res.redirect('/'+title);
      }
    });
  }
  // workDB.deleteOne({_id: checkedItemId}, (er)=>{
});

// render is used to open ejs file
app.get('/about', (req, res)=>{
  res.render('about');
});

// creating dynamic route
app.get("/:parName", (req, res)=>{
  // console.log(req.params.parName);
  const custListName = _.capitalize(req.params.parName);
  custList.findOne({name: custListName}, (err, got)=>{
    if(err) {
      console.log(err);
    } else {
      if(got) {
        // got.items.push({});
        // custList.updateOne({name: got.name}, {items: got.items});
        res.render('index', {day: got.name, newi: got.items})
      } else {
        const difList = custList({
          name: custListName,
          items: [{name: "Hi"}, {name: "Hello"}]
        });
        difList.save();
        res.redirect("/"+custListName);
      }
    }
  });

});


// process.env.PORT is used while hosting the server online
var port = process.env.PORT;
if(port == null || port == "") {
  port = 7000;
}
app.listen(port, ()=>{
  console.log("Server Established");
});
