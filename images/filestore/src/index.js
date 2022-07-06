
import http from 'http';
import express from "express";
import knex from "knex";


const pg = knex({
  client: 'pg',
  connection: {
    host : process.env.POSTGRES_HOST ? process.env.POSTGRES_HOST : "localhost",
    port : 5432,
    user : process.env.POSTGRES_USER ? process.env.POSTGRES_USER : "postgres",
    password : process.env.POSTGRES_PASSWORD ? process.env.POSTGRES_PASSWORD : "test",
    database : process.env.POSTGRES_DATABASE ? process.env.POSTGRES_DATABASE : "test"
  }
});

async function initialise() {
}

// API endpoints
const port = 3000;

const app = express();
http.Server(app); 
app.use(express.json())

app.get("/", async (req, res) => {
  await pg.select("*").table("logs").orderBy("id", "DESC").limit(500).then((data) => {
    res.send(data)
  })
  .catch((e) => {
    res.status(500).send(e)
  })
})


app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
})

initialise();