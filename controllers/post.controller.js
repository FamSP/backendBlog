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
  if (!id) {
    return res.status(400).send({ message: "Post id is missing" });
  }
  try {
    const data = await PostModel.findById(id).populate("author", ["username"]);
    if (!data) {
      return res.status(404).send({ message: "Not Found post with id " });
    }
    res.send(data);
  } catch (error) {
    return res.status(500).send({ error: error.message });
  }
};

exports.getAuthorId = async (req, res) => {
  const id = req.params.id;
  try {
    const data = await PostModel.find({ author: id })
      .populate("author", ["username"])
      .sort({ createdAt: -1 })
      .limit(20);
    if (!data) {
      return res.status(404).send({ message: "Not Found post with id " });
    }
    res.send(data);
  } catch (error) {
    return res.status(500).send({ error: error.message });
  }
};

exports.updateById = async (req, res) => {
  const id = req.params.id;
  const { title, summary, content, cover, author } = req.body;
  try {
    if (!id) {
      return res.status(404).send({ message: "ID is missing" });
    }
    const post = await PostModel.findById(id).populate("author", ["username"]);

    if (!post) {
      return res.status(404).send({ message: "Post not found" });
    }

    const postDoc = await PostModel.findOne({ _id: id, author: author });
    if (!postDoc) {
      return res
        .status(404)
        .send({ message: "Not Found post with this author id " });
    }
    if (!postDoc) {
      return res.status(403).send({ message: "Unauthorize to edit this post" });
    } else {
      // postDoc.title = title;
      // postDoc.summary = summary;
      // postDoc.content = content;
      // postDoc.cover = cover;
      // await postDoc.save();

      const newPost = await PostModel.findOneAndUpdate(
        { author, _id: id },
        { title, summary, content, cover },
        {
          new: true,
        }
      );

      if (!newPost) {
        return res.status(200).send({ message: "Post has been Update!" });
      }
    }
  } catch (error) {
    return res.status(500).send({ error: error.message });
  }
};

exports.deleteById = async (req, res) => {
  const { id } = req.params.id;
  const { author } = req.body.author;
  if (!id) {
    return res.status(404).send({ message: "ID is missing" });
  }
  if (!author) {
    return res.status(404).send({ message: "author is missing" });
  }
  try {
    const post = await PostModel.findOneAndUpdate({ author, _id: id });
    if (!post)
      return res.status(500).send({ message: "You can't delete this post" });
    res.send({ message: "Post has been deleted!" });
  } catch (error) {
    return res.status(500).send({ error: error.message });
  }
};
