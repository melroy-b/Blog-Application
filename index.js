import express from "express";
import morgan from "morgan";
import bodyParser from "body-parser"
import path, { dirname } from "path"
import { fileURLToPath } from "url";    
import axios from "axios";
import methodOverride from "method-override";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const port = 3000;
const app = express();

let blogPosts = [];
let idCounter = 0;

//serve static files (css, js)
app.use(express.static(path.join(__dirname,'public')));

//serve bootstrap from node modules
app.use('/bootstrap',express.static(path.join(__dirname, 'node_modules/bootstrap/dist')));    
app.use(bodyParser.urlencoded({ extended: true }));
app.use(methodOverride('_method'));

app.get("/", (req, res) => {
    res.render("index.ejs", {blogPosts});
})

//About and Contact routes
app.get("/about", (req, res) => {
    try {
        console.log("About route accessed");
        res.render("about.ejs");

    } catch (error) {   
        console.error("Error rendering contact page:", error);
        res.status(500).send("Internal Server Error");
    }
})

app.get("/contact", (req, res) => {
    try {
        console.log("Contact route accessed");
        res.render("contact.ejs");


    } catch (error) {   
        console.error("Error rendering contact page:", error);
        res.status(500).send("Internal Server Error");
    }

})

//POST routes for creating blog posts 
app.get("/create-post", (req, res) => {
    console.log("Create Post route accessed");
    res.render("posts/createPost.ejs");
})

app.post("/create-post", (req, res) => {
    try {
        console.log("Form Data:", req.body.title, req.body.content, req.body.author);
        const { title, content, author } = req.body;
        const id = idCounter++;
        blogPosts.push({ title, content, author, id });
        
        console.log("Blog post created:", blogPosts);
        
        res.redirect("/");
        res.sendStatus(200);  
    } catch (error) {
        res.status(500).send("Internal Server Error");
        console.error("Error creating blog post:", error);
    }

})

//Blog-Post route to display individual blog posts, put, patch and delete routes
app.get("/post/:id/edit-post", (req, res) => {
    try {
        console.log("Edit Posts route accessed");

        const postId = parseInt(req.params.id);
        const post = blogPosts.find(p => p.id === postId);
        res.render("posts/editPost.ejs", { post });
    } catch (error) {
        res.status(500).send("Internal Server Error");
        console.error("Error rendering posts page:", error);
    }   
});   



app.get("/post/:id", (req, res) => {
    try {
        const postId = parseInt(req.params.id); 
        const post = blogPosts.find(p => p.id === postId);
        console.log("Post accessed:", post);
        
        if (post) {
            //res.sendStatus(200);  
            res.render("posts/viewPost.ejs", { post });
        }else {
            res.status(404).send("Blog post not found");
        }
    } catch (error) {
        res.status(500).send("Internal Server Error");
        console.error("Error rendering blog post:", error);
    }
})

app.put("/post/:id", (req, res) => {
    try {   
        console.log("PUT /post/:id route accessed");

        const postId = parseInt(req.params.id);
        const { title, content, author } = req.body;
        const postIndex = blogPosts.findIndex(p => p.id === postId);  
        blogPosts[postIndex] = { id: postId, title, content, author };
        //res.sendStatus(200);  
        
        res.redirect("/");
    } catch (error) {
        res.status(500).send("Internal Server Error");
        console.error("Error updating blog post:", error);
    }
});

app.patch("/post/:id", (req, res) => {
    try {
        const postId = parseInt(req.params.id);
        const { title, content, author } = req.body;
        const postIndex = blogPosts.findIndex(P => P.id === postId);

        if (postIndex === -1) {
            return res.status(404).send("Blog post not found");
        }

        if (title) blogPosts[postIndex].title = title;
        if (content) blogPosts[postIndex].content = content;
        if (author) blogPosts[postIndex].author = author;
        //res.sendStatus(200);
        res.redirect("/");
    }catch (error) {
        res.status(500).send("Internal Server Error");
        console.error("Error partially updating blog post:", error);
    } 
});  

app.delete("/post/:id", (req, res) => {
    try {
        const postId = parseInt(req.params.id);
        blogPosts = blogPosts.filter(p => p.id !== postId); //deleted post
        //res.sendStatus(200);
        res.redirect("/");
    } catch (error) {
        res.status(500).send("Internal Server Error");
        console.error("Error deleting blog post:", error);
    }   
});


app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});