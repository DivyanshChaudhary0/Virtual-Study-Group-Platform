
const {Router} = require("express");
const { getAllGroups, createGroup, getGroupById, joinGroup, deleteGroup } = require("../controllers/groups.controller");
const { createPost, getPosts, deletePost, updatePost } = require("../controllers/post.controller");

const router = Router();

router.get("/", getAllGroups);

router.post("/", createGroup);

router.get("/:id", getGroupById);

router.delete("/:id", deleteGroup)

router.post("/:id/join", joinGroup);

router.post("/:id/posts", createPost);

router.get("/:id/posts", getPosts);

router.put("/posts/:postId", updatePost)

router.delete("/posts/:postId", deletePost);

module.exports = router;