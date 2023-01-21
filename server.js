const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");
const bodyParser = require("body-parser");

const app = express();

const jsonBodyParser = bodyParser.json();
const urlBodyParser = bodyParser.urlencoded({ extended: false });

var con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "Adhil@123",
  database: "db",
});

// middileWare
app.use(cors());
app.use(jsonBodyParser);
app.use(urlBodyParser);

// helper function
const inform = (err, res, result) => {
  if (err) {
    return res.status(400).send({ error: "failed" });
  } else if (result.length > 1) {
    res.send(result);
  } else {
    return res
      .status(200)
      .send({ error: null, status: "successfully compleated" });
  }
};

// query function
const query = (query, data = {}, res) => {
  return con.query(query, data, (err, result) => {
    inform(err, res, result);
  });
};

con.connect((err) => {
  if (err) console.log(err);
  console.log("connected");
});

// get all data....
app.get("/students", (req, res, next) => {
  con.query("select * from student", async (err, result, fields) => {
    if (err) throw err;

    var data = result;

    res.json(data);
  });
});

// get single data
app.get("/student/:id", (req, res, next) => {
  let { id } = req.params;

  con.query(`select * from student WHERE id =?`, id, (err, result, fields) => {
    if (err) throw err;
    res.json(result);
  });
});

// post data
app.post("/add", (req, res, next) => {
  let { first_name, current_location, pinCode, city } = req.body;

  query(
    "insert into student set ?",
    {
      first_name,
      current_location,
      pinCode,
      city,
    },
    res
  );
});

// update data
app.patch("/student/:id", (req, res, next) => {
  let { id } = req.params;
  let { first_name, current_location, pinCode, city } = req.body;
  // let sql = `UPDATE student set first_name= "" ?
  // ,current_location=  ?
  // ,pinCode=  ?,city= "" ?  WHERE id= ${id}`;
  // let key = { first_name, current_location, pinCode, city };
  let sql = `UPDATE student set first_name= '${first_name}'
  ,current_location='${current_location}'
  ,pinCode=${pinCode},city='${city}'  WHERE id=${id}`;
  // query(sql, { first_name, current_location, pinCode, city }, res);
  con.query(sql, (err, result) => {
    if (err) {
      res.status(400).send({ error: "Updation faild" });
      console.log(err);
    } else {
      res.status(200).send({ error: null, status: "successfully compleated" });
    }
  });
});

// delete data
app.delete("/student/:id", (req, res, next) => {
  let { id } = req.params;

  query("DELETE FROM student WHERE id = ?", id, res);
});

// pert listen
app.listen(5000, () => {
  console.log(`server listen ${5000}`);
});
