
export default async function createTables(pg) {
  // pg.schema.dropTable('logs').then((d) => {
  //   console.log("deleted table")
  // })
  pg.schema.hasTable('logs').then(function(exists) {
    if (!exists) {
      return pg.schema.createTable('logs', function(t) {
        t.increments('id').primary();
        t.string('cat', 1000);
        t.string("source", 1000);
        t.string("topic", 1000);
        t.string('message', 1000);
        t.integer("showID")
        t.timestamps(true, true);
      })

    } else {
      console.log("tables logs exist")

    }
  })
  pg.schema.hasTable('printout').then(function(exists) {
    if (!exists) {
      return pg.schema.createTable('printout', function(t) {
        t.increments('id').primary();
        t.string('question', 1000);
        t.json("options");
        t.integer("showID")
        t.timestamps(true, true);
      })

    } else {
      console.log("tables printout exist")

    }
  })
  pg.schema.hasTable('votes').then(function(exists) {
    if (!exists) {
      return pg.schema.createTable('votes', function(t) {
        t.increments('id').primary();
        t.string('controller', 1000);
        t.string('vote', 1000);
        t.integer("showID")
        t.timestamps(true, true);
      });
    } else {
      console.log("tables votes exist")
    }
  })
  pg.schema.hasTable('lifeline').then(function(exists) {
    if (!exists) {
      return pg.schema.createTable('lifeline', function(t) {
        t.increments('id').primary();
        t.string('cat', 1000);
        t.string("source", 1000);
        t.string("topic", 1000);
        t.string('message', 1000);
        t.timestamps(true, true);
      });
    } else {
      // pg.schema.dropTable('logs').then(() => {
      //   console.log("removed")
      // })
    
      console.log("tables lifeline exist")
    }
  })

  pg.schema.hasTable('shows').then(function(exists) {
    if (!exists) {
      return pg.schema.createTable('shows', function(t) {
        t.increments('id').primary();
        t.string('location', 1000);
        t.string("handle", 1000);
        t.integer("participants");
        t.dateTime("startTime");
        t.timestamps(true, true);
        t.boolean("isClosed");
      })
    } else {
      console.log("tables shows exist")
    }
  })

};
