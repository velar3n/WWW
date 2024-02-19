import express from 'express'
import multipart from 'lambda-multipart-parser'
import multer from 'multer';
const app = express();
import {getRecipes, getRecipe, createRecipe, searchRecipe} from './database.js';


app.set("view engine", "ejs")
app.use(express.urlencoded({extended: true}))
app.use(express.json())

// Set up storage for uploaded files
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'public/images');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

// Create the multer instance
const upload = multer({ storage: storage });



app.get('/', async (req, res) => {
  const recipes = await getRecipes()
  res.render("home.ejs", {
    recipes,
  });
})

app.get('/recipes', async (req, res) => {
  const recipes = await getRecipes()
  res.render("recipes.ejs", {
    recipes,
  });
})

app.get('/recipes/:id', async (req, res) => {
  const id = req.params.id
  const recipe = await getRecipe(id)
  res.render("recipe_post.ejs", {
    recipe,
  });
})

app.get('/add_recipe', (req, res) => {
  res.render("add_recipe.ejs");
})

app.post('/add_recipe/add', upload.single("photo"), async (req, res) => {
  const { title, category, time, portions, difficulty, ingredients, description } = req.body;
  const path = req.file.filename;

  const joined_ingredients = ingredients.join(";");
  const joined_description = description.join(";");

  await createRecipe(title, joined_description, joined_ingredients, category, time, portions, path, difficulty)

  res.redirect('/');
})

app.get('/contact', (req, res) => {
  res.render("contact.ejs");
})



app.use(express.static("public"))

const port = 8080;
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
