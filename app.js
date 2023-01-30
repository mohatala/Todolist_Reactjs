//jshint esversion:6

const express= require("express");
const bodyParser=require("body-parser");
const date=require(__dirname+"/date.js")
const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

const itemlist=["Buy Food","Cook Food"];
const workitems=[];
app.get("/", function(req, res){
  const day=date.getDay();
  res.render('list',{listtitle:day,items:itemlist});
});

app.post("/", function(req, res){
  const item=req.body.newItem;
  if(req.body.list==="Work List"){
      workitems.push(item);
      res.redirect("/work");
  }else {
    itemlist.push(item);
    res.redirect("/");
  }

});
app.get("/work", function(req, res){

  res.render('list',{listtitle:"Work List",items:workitems});
});
app.get("/about", function(req, res){

  res.render('about');
});
app.listen(3000, function(){
  console.log("Server started on port 3000");
});
