const Blog = require("../models/Blog");
const User = require("../models/User");
const mongoose = require("mongoose");
const blogController = {};
blogController.getAllBlogs = async (req, res, next) => {
  let blogs;
  try {
    blogs = await Blog.find();
  } catch (err) {
    console.log(err);
  }
  if (!blogs) {
    return res.status(404).json({ message: "No Blogs Found" });
  }
  return res.status(200).json({ blogs });
};
blogController.addBlog = async (req, res, next) => {
  const { title, description, image, user } = req.body;
  let existingUser;
  try {
    existingUser = await User.findById(user);
  } catch (err) {
    console.log(err);
  }
  if (!existingUser) {
    return res.status(400).json({ message: "Unable to find user by this id" });
  }

  const blog = new Blog({
    title,
    description,
    image,
    user,
  });
  try {
    const session = await mongoose.startSession();
    session.startTransaction();
    await blog.save({ session });
    existingUser.blogs.push(blog);
    await existingUser.save({ session });
    await session.commitTransaction();
  } catch (err) {
    console.log(err);
  }
  return res.status(200).json({ blog });
};
blogController.updateBlog = async (req, res, next) => {
  let blog;
  const { title, description } = req.body;
  const blogId = req.params.id;
  try {
    blog = await Blog.findByIdAndUpdate(blogId, {
      title,
      description,
    });
  } catch (err) {
    console.log(err);
  }
  if (!blog) {
    return res.status(500).json({ message: "Unable to Update the Blog" });
  }
  console.log("blog updated");
  return res.status(200).json({ blog });
};
blogController.getByIdBlog = async (req, res, next) => {
  const blogId = req.params.id;
  let blog;
  try {
    blog = await Blog.findById(blogId);
    console.log(blog);
  } catch (err) {
    console.log("ERROR", err);
  }
  if (!blog) {
    return res.status(404).json({ message: "No Blog Found" });
  }
  return res.status(200).json({ blog });
};
blogController.deleteBlog = async (req, res, next) => {
  const id = req.params.id;
  let blog;
  try {
    blog = await Blog.findByIdAndDelete(id);
    console.log("Successfully Deleted");
  } catch (err) {
    console.log(err);
  }
  if (!blog) {
    return res.status(500).json({ message: "Unable to Delete" });
  }
  const existingUser = await User.findById(blog.user);
  const index = existingUser.blogs.indexOf(blog._id);
  existingUser.blogs.splice(index, 1);
  existingUser.save();
  return res.status(200).json({ message: "Successfully Deleted" });
};
blogController.getByUserId = async (req, res, next) => {
  const userid = req.params.id;
  let userBlogs;
  try {
    userBlogs = await User.findById(userid).populate("blogs");
  } catch (err) {
    console.log(err);
  }
  if (!userBlogs) {
    return res.status(404).json({ message: "No Blog Found" });
  }
  return res.status(200).json({ blogs: userBlogs });
};

module.exports = blogController;
