var express = require("express");
var router = express.Router();
var qs = requre("qs");

module.exports = function (db) {
  
  router.get("/products", (req,res) => { //request and response object to read a product
    res.send(db.get("products").value());
  });


  router.post("/products", (req,res) => { //create a product
    const newProduct = req.body; //getting the body of the request
    const errors = [];
    if (!newProduct.name) {
      errors.push({
        field: "name",
        error: "required",
        message: "Name is required"
      })
    }

    if (newProduct.name > 25) {
      errors.push({
        field: "name",
        error: "length",
        message: "Name cannot be longer than 25 characters"
      })
    }

    if(!allowedColors.some( (_) => _ === newProduct.color)){
      errors.push({
        field: "color",
        error: "allowedValue",
        message: "Must be one of the following colors: red, blue, orange,black, brown"
      })
    }
    
    if (errors.length) {
      res.status(422).send(errors);
    } else {
      res.send(db.get("products").insert(newProduct).write()); //write saves it to the database
    }
  });

  //search in the api
  router.route("/products/search").get((req, res) => {
    const keywords = req.query.keywords;
    const result = db.get("products").filter( (_) => {
      const fullText = _.description + _.name + _.color;
      return fullText.indexOf(keywords) !== -1;
    });
    res.send();
  });

//detailed search

  router.route('/products/detailSearch').get((req,res) => {
    const query = qs.parse(req.query);
    const results = db.get('products').filter( (_) => {
      return Object.keys(query).reduce((found, key) => {
        const obj = query[key];
        switch(obj.op) {
          case "lt":
            found = found && _[key] < obj.val;
          case "eq" :
            found = found && _[key] == obj.val;
            break;
          default: 
            found = found && _[key].indexOf(obj.val) !== -1;
            break;
        }return found;
      },true)     
    });
  });

  router.patch("/products/:id", (req,res) => { //update a product
    res.send(db.get("products").find({id:req.params.id}).assign(req.body).write());
  });

  router.delete("/products/:id", (req,res) => { //delete a product
    db.get("products").remove({id:req.params.id}).write();
    res.status(204).send();
  });

  router.get("/products/:id", (req,res) => { //get a product by id
    const result = db.get("products").find({id:req.params.id}).value();

    if (result){
      res.send(result);
    } else {
      res.status(404).send();
    }
  });

  return router;

};
