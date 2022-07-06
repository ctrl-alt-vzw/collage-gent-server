import { generateUUID } from './../helpers.js'


export default function annotation(app, pg) {
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

}