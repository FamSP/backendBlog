const express = require("express");
const authjwt = require("../middleware/auth.jwt");
const router = express.Router();
const PostController = require("../controllers/post.controller");

//http://localhost:5000/api/v1/user/register
router.post("/create", authjwt.verifyToken, PostController.create);
router.get("/getall", PostController.getAll);
router.get("/getbyid/:id", PostController.getById);

router.get("/author/:id", PostController.getAuthorId);
router.put("/update/:id", authjwt.verifyToken, PostController.updateById);

router.delete(
  "/deletebyid/:id",
  authjwt.verifyToken,
  PostController.deleteById
);

module.exports = router;
