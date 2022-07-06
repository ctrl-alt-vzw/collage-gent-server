
import http from 'http';
import express from "express";
import knex from "knex";

import createTables from "./db/helpers.js";
import { generateUUID } from './helpers.js'
import e from 'express';

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
  console.log("connect")
  await createTables(pg);
  
}

// API endpoints
const port = 3000;

const app = express();
http.Server(app); 
app.use(express.json())

app.get("/", async (req, res) => {
  res.send({
    "endpoints": {
      "GET /annotation": "display all records",
      "GET /annotation/empty": "Display all records with empty annotation",
      "PATCH /annotation/[UUID]": "update an annotation, body: {annotation: [new annotation]}",
      "DELETE /annotation/[UUID]": "Delete a record",
      "POST /annotation": "Add a record, needs { imageURI, id, origin }"
    }
  })
})
app.delete("/annotation/:uuid", async (req, res) => {
  pg.delete().table("annotations").where({UUID: req.params.uuid}).returning("id").then((d) => {
    if(d.length > 0) {
      res.send({
        message: "deleted",
        id: d[0]
      })
    } else {
      res.send({
        message: "not found"
      })
    }
  })
})
app.patch("/annotation/:uuid", async(req, res) => {
  const toUpdate = {
    annotation: req.body.annotation
  }
  await pg.update(toUpdate).table("annotations").returning("*").then((data) => {
    res.send(data)
  })
  .catch(e => {
    res.status(400).send(e)
  })
})
app.post("/annotation", async(req, res) => {
  console.log("saving")
  const b = req.body;
  if(b.label && b.id && b.imageURI) {
    const toInsert = {
      gentImageURI: b.imageURI,
      UUID: generateUUID(),
      originID: b.id,
      collection: b.origin,
      annotation: ""
    }
    pg.select("*").table("annotations").where({ originID: b.id, collection: b.origin }).then(async (d) => {
      if(d.length > 0) {
       
        res.status(200).send({message: "already exists"})
      } else {
        await pg.insert(toInsert).table("annotations").returning("*").then((d) => {
          res.send(d);
        })
      }
    }).catch((e) => {
        console.log(e)
        return false;
    })
      
    
  }
  else {
    res.status(400).send()
  }
})

app.get("/annotation/empty", async (req, res) => {
  await pg.select("*").table("annotations").orderBy("id", "DESC").where({"annotation": ""}).then((data) => {
    res.send(data)
  })
  .catch((e) => {
    res.status(500).send(e)
  })
})

app.get("/annotation", async (req, res) => {
  await pg.select("*").table("annotations").orderBy("id", "ASC").then((data) => {
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