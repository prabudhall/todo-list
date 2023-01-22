const express = require('express');
const bodyParser = require('body-parser');
const ejs = require('ejs');
const date = require(__dirname+'/date.js');
// console.log(date());

const app = express();
app.set('view engine', "ejs");
// we can still push in const array but can't change it completely i.e. items = ['shbf']
const items = ["Apple", "Pizza", "Orange", "Banana"];
const workitems = [];

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

// getting date from another js file and sending the output to the webpage
app.get('/',(req, res)=>{
  res.render('index', {day: date.getDate(), newi: items});
});

app.get("/work", (req, res)=>{
  res.render('index', {day: "Work List", newi: workitems})
});

// get the post from both work and root also as only one ejs file is their, therefore handling them aaccordingly
app.post('/', (req, res)=>{
  // console.log(req.body.newItem);
  // console.log(req.body);
  // everything posting to here therefore using button to judge from which page the the post is coming
  var item = req.body.newItem;
  if(req.body.button == 'Work')
  {
    workitems.push(item);
    res.redirect('/work');
  } else {
    items.push(item);
    res.redirect('/');
  }
});

// render is used to open ejs file
app.get('/about', (req, res)=>{
  res.render('about');
});

app.listen(7000, ()=>{
  console.log("Server Established");
});
