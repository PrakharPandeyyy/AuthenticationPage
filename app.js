require('dotenv').config();
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require('mongoose');
const bcrypt=require("bcrypt");
const saltRound=10;

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/userDB",{useNewUrlParser:true});
const userSchema=new mongoose.Schema({
    email:String,
    password:String
});




const User = new mongoose.model("User",userSchema);



app.get("/",function(req,res){
    res.render("home");
});
app.get("/login",function(req,res){
    res.render("login");
});
app.get("/register",function(req,res){
    res.render("register");
});

app.post("/register",function(req,res){
    async function fun3(){
        try{
            const pass =await bcrypt.hash(req.body.password,saltRound)
            const newUser = new User({
                email : req.body.username,
                password : pass
            });
            async function fun1(){
                try{
                    await newUser.save();
                    await res.render("secrets");
                }
                catch(err){
                    console.log(err.message);
                }
            }
            fun1();
            
        }
        catch(err){
            console.log(err.message);
        }
    }
    fun3();
   
});

app.post("/login",function(req,res){
    const username=req.body.username;
    const password=req.body.password;


   
    async function fun2(){
        try{
            const data = await User.findOne({email:username});
            async function fun4(){
                try{
                    const result = await bcrypt.compare(password,data.password);
                    if(result === true){
                        res.render("secrets");
                    }
                }
                catch(err){
                    console.log(err.message);
                }
            }
            fun4();
        }
        catch(err){
            console.log(err.message);
        }
    }
    fun2();
});





app.listen(3000, function() {
  console.log("Server started on port 3000");
});
