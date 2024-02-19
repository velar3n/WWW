import mysql from 'mysql2'

const pool = mysql.createPool({
  host: '127.0.0.1',
  user: 'root',
  password: 'Password123',
  database: 'yummy'
}).promise()

export async function getRecipes() {
  const [result] = await pool.query("SELECT * FROM recipe")
  return result
}

export async function getRecipe(id) {
  const [result] = await pool.query("SELECT * FROM recipe WHERE recipeId LIKE ?", [id])
  return result[0]
}

export async function createRecipe(title, description, ingredients, category, time, portions, photo_path, difficulty) {
   await pool.query(
    "INSERT INTO recipe (title, description, ingredients, category, time, portions, photo_path, difficulty) VALUES (?, ?, ?, ?, ?, ?, ?, ?)", [title, description, ingredients, category, time, portions, photo_path, difficulty]
  )
  
}

export async function searchRecipe(search) {
  const [result] = await pool.query("SELECT * FROM recipe WHERE title LIKE ? OR description LIKE ? OR ingredients LIKE ?", [search])
  return result
}