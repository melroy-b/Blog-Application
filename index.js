import express from "express";
import morgan from "morgan";
import bodyParser from "body-parser"
import path, { dirname } from "path"
import { fileURLToPath } from "url";    
import axios from "axios";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const port = 3000;
const app = express();

let blogPosts = [];
let idCounter = 0;
// console.log(__filename);
// console.log(__dirname);

//serve static files (css, js)
app.use(express.static(path.join(__dirname,'public')));

//serve bootstrap from node modules
app.use('/bootstrap',express.static(path.join(__dirname, 'node_modules/bootstrap/dist')));    
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", (req, res) => {
    res.render("index.ejs", {blogPosts});
})

app.get("/about", (req, res) => {
    console.log("About route accessed");
    res.render("about.ejs");
})

app.get("/contact", (req, res) => {
    res.render("contact.ejs");
    try {
        console.log("Contact route accessed");
    } catch (error) {   
        console.error("Error rendering contact page:", error);
        res.status(500).send("Internal Server Error");
    }

})

app.get("/create-post", (req, res) => {
    console.log("Create Post route accessed");
    res.render("create-post.ejs");
})

app.post("/create-post", (req, res) => {
    console.log("Form Data:", req.body.title, req.body.content, req.body.author);
    const { title, content, author } = req.body;
    const id = idCounter++;
    blogPosts.push({ title, content, author, id });
    console.log("Blog post created with ID:", blogPosts);

    res.redirect("/");
})

app.get("/post/:id", (req, res) => {
    try {
        const postId = parseInt(req.params.id);
        const post = blogPosts.find(p => p.id === postId);
        console.log("Post accessed:", post);

        if (post) {
            res.render("blog-post.ejs", { post });
        }
    } catch (error) {
        
    }
})



app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
})