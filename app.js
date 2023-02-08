//jshint esversion:6

const express= require("express");
const bodyParser=require("body-parser");
const mongoose = require('mongoose');
const date=require(__dirname+"/date.js")
const app = express();
const _=require("lodash");
app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

mongoose.connect("mongodb://127.0.0.1:27017/todolistDB",{useNewUrlParser:true});

const itemSchema=new mongoose.Schema({
      name:String
});
const Item=mongoose.model("Item",itemSchema);
const listSchema=new mongoose.Schema({
  name:String,
  items:[itemSchema]
});
const List= mongoose.model("List",listSchema);

const workitems=[];

const it=new Item({name:"Welcome todo list"});
const it1=new Item({name:"Hit the + button to add new item"});
const it2=new Item({name:"<-- hit this to delete an item"});
const defaultitems=[it,it1,it2];
app.get("/", function(req, res){
  const day=date.getDay();
  Item.find({},function(err,items) {
      if(items.length===0){
        Item.insertMany([it,it1,it2],function functionName(err) {
          if(err){
          console.log(err);
        }else {
          console.log("success");
        }
        });
        res.redirect("/");
      }else {
        res.render('list',{listtitle:day,items:items});

      }
  });
  //console.log(itemlist);
});

app.post("/", function(req, res){
  const item=req.body.newItem;
  const listName=req.body.list;
  const day=date.getDay();
  const it=new Item({name:item});
  if(listName===day){
    it.save();
    res.redirect("/");
  }else {
    List.findOne({name:listName},function(err,foundList) {
      foundList.items.push(it);
      foundList.save();
      res.redirect("/" + listName);
    });

  }

});
app.post("/delete",function(req,res) {
  itemid=req.body.checkbox;
  const listName=req.body.listName;
  const day=date.getDay();
  if(listName===day){
    Item.findByIdAndRemove(itemid,function(err) {
      if (err) {console.log(err);
      }else {
        console.log("deleted");
        res.redirect("/");
      }
    });
  }else {
    List.findOneAndUpdate({name:listName},{$pull:{items:{_id:itemid}}},function(err,result) {
      if (!err) {
        res.redirect("/" + listName);
   }
    });
  }
});

app.get("/:customListName", function(req, res){
const customListName=_.capitalize(req.params.customListName);
List.findOne({name:customListName},function(err,results) {
  if(!err){
    if(!results){
      //console.log("not existe");
      const list=new List({
        name:customListName,
        items:defaultitems
      });
      list.save();
      res.redirect("/"+customListName);
    }
    else {
      //console.log("existe");
      res.render('list',{listtitle:results.name,items:results.items});

    }
  }
});

});

app.get("/about", function(req, res){

  res.render('about');
});
app.listen(3000, function(){
  console.log("Server started on port 3000");
});
