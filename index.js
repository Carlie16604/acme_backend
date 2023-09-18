const pg = require('pg');
const client = new pg.Client('postgres://localhost/acme_backend_db');
const cors = require('cors');
const express = require('express');
const app = express();

app.use(cors());

app.get('/api/pets', async(req, res, next)=> {
  try {
    const SQL = `
      SELECT *
      FROM pets
    `;
    const response = await client.query(SQL);
    res.send(response.rows);
  }
  catch(ex){
    next(ex);
  }
});

const setup = async()=> {
  await client.connect();
  console.log('connected to the database');
  const SQL = `
    DROP TABLE IF EXISTS pets;
    CREATE TABLE pets(
      id SERIAL PRIMARY KEY,
      name VARCHAR(100),
      is_favorite BOOLEAN
    );
    INSERT INTO pets (name VARCHAR(20)) VALUES ('Charlie');
    INSERT INTO pets (name VARCHAR(20)) VALUES ('Stinker');
    INSERT INTO pets (name VARCHAR(20)) VALUES ('Soup');
    INSERT INTO pets (name, is_favorite) VALUES ('Marly', true);
  `;
  await client.query(SQL);
  console.log('tables created and data seeded');

  const port = process.env.PORT || 3000;
  app.listen(port, ()=> {
    console.log(`listening on port ${port}`);
  });
};

setup();
