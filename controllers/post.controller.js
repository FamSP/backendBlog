const PostModel = require("../models/Post");

exports.create = async (req, res) => {
  const { title, summary, content, cover, author } = req.body;
  try {
    if (!title || !summary || !content || !cover || !author) {
      return res
        .status(400)
        .send({ message: "Please fill all the remaining blank fields" });
    }
    const existingPost = await PostModel.findOne({ title });
    if (existingPost) {
      return res.status(400).send({ message: "Post already exists" });
    }
    const newPost = {
      title,
      summary,
      content,
      cover,
      author,
    };
    const data = await PostModel.create(newPost);
    res.send(data);
  } catch (error) {
    return res.status(500).send({ error: error.message });
  }
};

exports.getAll = async (req, res) => {
  try {
    const data = await PostModel.find()
      .populate("author", ["username"])
      .sort({ createdAt: -1 })
      .limit(20);
    res.send(data);
  } catch (error) {
    return res.status(500).send({ error: error.message });
  }
};

exports.getById = async (req, res) => {
  const id = req.params.id;
  try {
    const data = await PostModel.findById(id);
    if (!data) {
      return res.status(404).send({ message: "Not Found post with id " + id });
    }
    res.send(data);
  } catch (error) {
    return res.status(500).send({ error: error.message });
  }
};

exports.getAuthorId = async (req, res) => {
  const id = req.params.id;
  try {
    const data = await PostModel.findById(id);
    if (!data) {
      return res.status(404).send({ message: "Not Found post with id " + id });
    }
    res.send(data);
  } catch (error) {
    return res.status(500).send({ error: error.message });
  }
};

exports.deleteById = async (req, res) => {
  const id = req.params.id;
  try {
    if (!id) {
      return res.status(404).send({ message: "ID is missing" });
    }
    const result = await PostModel.deleteOne({ _id: id });
    if (result.deletedCount === 0) {
      return res.status(404).send({ message: "Not Found post with id " + id });
    }
    res.send({ message: "Post has been deleted!" });
  } catch (error) {
    return res.status(500).send({ error: error.message });
  }
};
