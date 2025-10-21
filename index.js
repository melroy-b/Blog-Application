import express from "express";
import morgan from "morgan";
import bodyParser from "body-parser"
import path, { dirname } from "path"
import { fileURLToPath } from "url"

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const port = 3000;
const router = express();

// console.log(__filename);
// console.log(__dirname);

//serve static files (css, js)
router.use(express.static(path.join(__dirname,'public')));

//serve bootstrap from node modules
router.use('/bootstrap',express.static(path.join(__dirname, 'node-modules/bootstrap/dist')));    
router.use(bodyParser.urlencoded({ extended: true }));

router.get("/", (req, res) => {
    res.render("index.ejs");
})

router.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
})