// import mongoose from "mongoose";
import fs from "fs";
import imagekit from "../config/imageKit.js";
import Blog from "../models/Blog.js";
import Comment from "../models/Comment.js";
import main from '../config/gemini.js';

export const addBlog = async (req, res) => {
  try {
    const { title, subTitle, description, category, isPublished } = JSON.parse(
      req.body.blog
    );

    const imageFile = req.file;

    // check if all fields are present
    if (!title || !description || !category || !imageFile) {
      return res.json({
        success: false,
        message: "Missing required fields",
      });
    }
    const fileBuffer = fs.readFileSync(imageFile.path);

    // Upload image to imagekit

    const response = await imagekit.upload({
      file: fileBuffer,
      fileName: imageFile.originalname,
      folder: "/blogs",
    });

    //optimization through  imagekit URL transformation

    const optimizedImageUrl = imagekit.url({
      path: response.filePath,
      transformation: [
        { quality: "auto" }, //auto compression
        { format: "webp" }, //convert to modern format
        { width: "1280" },
      ],
    });

    const image = optimizedImageUrl;

    await Blog.create({
      title,
      subTitle,
      description,
      category,
      image,
      isPublished,
    });
    res.json({ success: true, message: "Blog added successfully" });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// Get all blogs

export const getAllBlogs = async (req, res) => {
  try {
    const blogs = await Blog.find({ isPublished: true });
    res.json({ success: true, blogs });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

export const getBlogById = async (req, res) => {
  try {
    const { id } = req.params;
    const blog = await Blog.findById(id);
    if (!blog) {
      return res.json({ success: false, message: "Blog not found" });
    }
    res.json({ success: true, blog });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

export const deleteBlogById = async (req, res) => {
  try {
    const { id } = req.body;
    await Blog.findByIdAndDelete(id);
// Delete all comments associated with this blog

await Comment.deleteMany({blog:id});

    res.json({
      success: true,
      message: "Blog deleted successfully",
    });
  } catch (error) {
    res.json({
      success: false,
      message: error.message,
    });
  }
};

export const togglePublish = async (req, res) => {
  try {
    const { id } = req.body;
    const blog = await Blog.findById(id);
    blog.isPublished = !blog.isPublished;
    await blog.save();
    res.json({ success: true, message: "Blog status Updated" });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// for comment

export const addComment = async (req, res) => {
  try {
    const { blog, name, content } = req.body;

    if (!blog || !name || !content) {
      return res.json({
        success: false,
        message: "Missing required fields",
      });
    }

    await Comment.create({ blog, name, content, isApproved: true }); // ✅ FIXED: auto-approve for now

    res.json({
      success: true,
      message: "Comment added successfully",
    });
  } catch (error) {
    res.json({
      success: false,
      message: error.message,
    });
  }
};


export const getBlogComments = async (req, res) => {
  try {
    const { blogId } = req.body;
    const comments = await Comment.find({
      blog: blogId,
      isApproved: true,
    })
    .populate("blog","title")
    .sort({
      createdAt: -1,
    });
    res.json({ success: true, comments });
  } catch (error) {
    res.json({
      success: false,
      message: error.message,
    });
  }
};


// Generate content 

export const generateContent=async(req,res)=>{
  try{
const {prompt}=req.body;
const content=await main(prompt + 'Generate a blog content for this topic in simple text format')
  res.json({success:true,content});
}
  catch(error){
res.json({success:false,message:error.message});
  }
}

