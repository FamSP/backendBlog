const PostModel = require("../models/Post");

exports.create = async (req, res) => {
  const { title, summary, content, cover, author } = req.body;
  try {
    if (!title || !summary || !content || !cover || !author) {
      res
        .status(400)
        .send({ message: "Please fill all the remain blank filed" });
    }
    const existingPost = await PostModel.findOne({ title });
    if (existingPost) {
      res.status(400).send({ message: "Post already exists" });
      return;
    }
    const newPost = {
      title,
      summary,
      content,
      cover,
      author,
    };
    PostModel.create(newPost).then((data) => {
      res.send(data);
    });
  } catch (error) {
    return res.status(500).send({ error: error.message });
  }
};

exports.getAll = async (req, res) => {
  try {
    await PostModel.find()
      .populate("author", ["username"])
      .sort({ createdAt: -1 })
      .limit(20)
      .then((data) => {
        res.send(data);
      });
  } catch (error) {
    return res.status(500).send({ error: error.message });
  }
};

exports.getById = async (req, res) => {
  const id = req.params.id;
  try {
    await PostModel.findById(id).then((data) => {
      if (!data) {
        res.status(404)({ message: "Not Found post with id" + id });
      } else {
        res.send(data);
      }
    });
  } catch (error) {
    return res.status(500).send({ error: error.message });
  }
};

// exports.getAuthorId = async (req, res) => {
//   const id = req.params.id;
//   try {
//     await PostModel.findById(id).then((data) => {
//       if (!data) {
//         res.status(404)({ message: "Not Found post with id" + id });
//       } else {
//         res.send(data);
//       }
//     });
//   } catch (error) {
//     return res.status(500).send({ error: error.message });
//   }
// };

exports.DeleteById = async (req, res) => {
  const id = req.params.id;
  try {
    if (!id) {
      res.status(404).send({ message: "ID is missing" });
    }
    await PostModel.deleteOne(id).then((data) => {
      if (!data) {
        res.status(404)({ message: "Not Found post with id" + id });
      } else {
        res.send({ message: "Post has been DELETE!" });
      }
    });
  } catch (error) {}
};
