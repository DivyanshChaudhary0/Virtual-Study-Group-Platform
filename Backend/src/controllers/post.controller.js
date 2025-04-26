

const mongoose = require("mongoose");
const postModel = require("../models/posts.model");
const groupModel = require("../models/groups.model");


const getPosts = async (req, res) => {
  try {
    const groupId = req.params.id;

    const posts = await postModel.find({group: groupId}).sort({ createdAt: -1 });
    if(!posts){
        return res.status(404).json({
            message: "No Post found"
        })
    }

    res.status(200).json({
        message: "Post fetched",
        posts
    })

  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};


const createPost = async (req, res) => {
  try {
    const groupId = req.params.id;
    const user = req.user;

    const { text } = req.body;
    if(!text){
        return res.status(400).json({
            message: "text or aurhor not found"
        })
    }

    if(!mongoose.Types.ObjectId.isValid(groupId)){
        return res.status(400).json({
            message: "Group not found"
        })
    }

    const groupExists = await groupModel.findById(groupId);
    if (!groupExists) {
      return res.status(404).json({ success: false, message: `Group not found with id ${groupId}, cannot create post` });
    }

    const post = await postModel.create({
        text,
        authorName: user.name,
        group: groupId
    })

    res.status(201).json({
        message: "Post created",
        post
    })

  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};


const updatePost = async (req,res) => {
    try{

        const postId = req.params.postId;
        const user = req.user;

        if(!mongoose.Types.ObjectId.isValid(postId)){
            return res.status(400).json({
                message: "Group is not found"
            })
        }

        const { text } = req.body;
        if(!text){
            return res.status(400).json({
                message: "text is not found"
            })
        }

        const updatedPost = await postModel.findOne({$and: [{ _id: postId },{name: user.name}]} , { text }, { new: true });
        if(!updatePost){
            return res.status(403).json({
                message: "User can not update profile"
            })
        }

        res.status(200).json({
            message: "Post updated",
            post: updatedPost
        })

    }
    catch(err){
        res.status(500).json({
            message: err.message
        })
    }
}


const deletePost = async (req,res) => {
    try{
        const postId = req.params.postId;
        const user = req.user;

        if(!mongoose.Types.ObjectId.isValid(postId)){
            return res.status(400).json({
                message: "Group is not found"
            })
        }

        const isPostExist = await postModel.findById(postId);
        if(!isPostExist){
            return res.status(400).json({
                message: "Post not found"
            })
        }

        if(isPostExist.name !== user.name){
            return res.status(403).json({
                message: "Can not delete post"
            })
        }

        const deletedPost = await postModel.findOneAndDelete({_id: postId}, { new: true });

        if(!deletePost){
            return res.status(404).json({
                message: "Post not found"
            })
        }

        res.status(200).json({
            message: "Post deleted",
            post: deletedPost
        })

    }
    catch(err){
        res.status(500).json({
            message: err.message
        })
    }
}


module.exports = {
  createPost,
  getPosts,
  updatePost,
  deletePost
};
