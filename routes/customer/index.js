
const { getImages, addImages, updateImages } = require("../../db/admin/pictures.db.fun");

const auth = require("../../middlewares/auth");

const route = require("express").Router();

route.get("/getAllImages", (req, res) => {
  const { page, limit, category, labels } = req.query;
   console.log("CUST REQ",page, limit, category, labels );
  getImages(page, limit, category, labels )
    .then((resp) => {
      console.log("RES 34343", resp);
      res.status(200).send(resp);
    })
    .catch((err) => {
      return res.status(401).json({ error: err });
    });
});

route.post("/addTagsPost", auth, async (req, res) => {
  console.log("IN ADD car", req.body, req.user);
  let data = req.body;
  // data={...data,addedBy:req.user.id};
  console.log("SENDING:", data);
  
  await updateImages(data).then(response=>{
  console.log("RESP in server:", response);
  res.status(200).send({
    response
  });
 })
 .catch(err=>{
  console.log("ERRROR", err);
  // return res.status(401).json({ error: err });
 })
  

 
});

route.get("/some", auth, (req, res) => {
  console.log("REQQ", req.user);
  res.send("GOT IT");
});

module.exports = {
  customerRoute: route,
};
