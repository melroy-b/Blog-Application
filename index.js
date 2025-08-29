import express from "express";
import morgan from "morgan";
import bodyParser from "body-parser"

const port = 3000;
const router = express();

router.use(express.static("public"));
router.use(bodyParser.urlencoded({ extended: true }));

router.get("/", (req, res) => {
    res.render("index.ejs");
})

router.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
})