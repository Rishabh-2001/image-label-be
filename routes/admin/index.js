const { addImages, getImages, removeImage } = require("../../db/admin/pictures.db.fun");
const route = require("express").Router();

route.post("/addTagsPost", async (req, res) => {
  console.log("IN ADD car", req.body, req.user);
  let data = req.body;
  data={...data,addedBy:req.user.id};
  if(req.user?.userType==="CUSTOMER")
  {
    return res.status(403).json({ error: "You are not Authorised for this Action." });
  }
  console.log("SENDING:", data);
  await addImages(data).then(response=>{
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

route.delete("/deleteTagPost/:id", async (req, res) => {
  const id = req.params.id;
  console.log("REQ,",req.user);
  if(req.user?.userType==="CUSTOMER")
  {
    return res.status(403).json({ error: "You are not Authorised for this Action." });
  }
 
  await removeImage(id).then(response=>{
  console.log("RESP in server:", response);
  res.status(200).send({
    response
  });
 })
 .catch(err=>{
  console.log("ERRROR", err);
  return res.status(401).json({ error: err });
 })
  

 
});



route.get("/getAllImages", async (req,res)=>{
  const { page, limit, category, labels } = req.query;
   
  getImages(page, limit, category, labels )
    .then((resp) => {
      console.log("RES", resp);
      res.status(200).send(resp);
    })
    .catch((err) => {
      return res.status(401).json({ error: err });
    });
})



route.post("/disable/:id", (req, res) => {
  console.log("Disable");
});
route.post("/deactivate/:id", (req, res) => {
  console.log("deactivate");
});

module.exports = {
  adminRoute: route,
};
