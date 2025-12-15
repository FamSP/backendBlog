const express = require("express");
const router = express.Router();
const PostController = require("../controllers/post.controller");

//http://localhost:5000/api/v1/user/register
router.post("/create", PostController.create);
router.get("/getall", PostController.getAll);
// router.get("/getbyid/:id", PostController.getById);

router.get("/author/:id", PostController.getAuthorId);

router.delete("/deletebyid/:id", PostController.DeleteById);

module.exports = router;
