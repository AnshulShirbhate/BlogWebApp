import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";

const app = express();
mongoose.connect("mongodb://localhost:27017/BlogDatabase");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
app.set("view engine", "ejs");

const homeStartingContent =
  "Hello everyone! My name is Anshul and this is my blog website where I post the things I do " +
  "and experience. Stay tuned for the upcoming blogs as I share all my experiences and learnings with " +
  "you guys for the self upgradation and curiosity purposes."
const aboutContent =
"Hello everyone! My name is Anshul and this is my blog website where I post the things I do and learn "+
"and experience. I am a B.Tech student at YCCE(Yeshwantrao Chavan College of Engineering), Nagpur pursuing "+
"Artificial Intelligence and Data Science. Prior to this I have completed my course of Diploma in Computer "+
"engineering from Dr. Panjabrao Deshmukh Polytechnic, Amravati. Having keen interest in computers and "+
"technology I have done some courses such as Ethical hacking and Web-Development and always try to be "+ 
"updated about the emerging technologies rising around me in the world."
const contactContent = {
  email: "someone@gmail.com",
  phone: "+91 123456789",
  college: "Your college name"
}; 

const postsSchema = mongoose.Schema({
  title: String,
  description: String
})

const Post = new mongoose.model("post", postsSchema);

app.get("/", async function (req, res) {
  const postArr = await Post.find({});
  res.render("home.ejs", {
    startingContent: homeStartingContent,
    postArr: postArr,
  });
});

app.get("/about", function (req, res) {
  res.render("about.ejs", { aboutPage: aboutContent });
});

app.get("/contact", function (req, res) {
  res.render("contact.ejs", { content: contactContent });
});

app.get("/compose", function (req, res) {
  res.render("login.ejs");
});

app.post("/login", (req, res)=>{
  const username = "yourname";
  const password = "yourpassword";
  if(username == req.body.username && password == req.body.password){
    res.render("compose.ejs");
  }else{
    res.redirect("/compose");
  }
});

app.post("/compose", function (req, res) {
  const capitalizedTitle = (req.body.publishedText).charAt(0).toUpperCase() + (req.body.publishedText).slice(1).toLowerCase();
  const post = new Post({
    title : capitalizedTitle,
    description : req.body.publishedPost
  });
  post.save();

  res.redirect("/");
});

app.get("/posts/:postid", async function (req, res) {
  const requested_postid= req.params.postid;
  const post = await Post.findOne({_id: requested_postid});
  res.render("post.ejs", {post: post});
});



let port = process.env.PORT;
if(port == null || port == ""){
  port = 3000;
}
app.listen(port, function () {
  console.log("Server started on http://localhost:"+port);
});
