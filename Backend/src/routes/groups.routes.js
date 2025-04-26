
const {Router} = require("express");
const { getAllGroups, createGroup, getGroupById, joinGroup, deleteGroup } = require("../controllers/groups.controller");
const { createPost, getPosts, deletePost, updatePost } = require("../controllers/post.controller");
const userAuth = require("../middlewares/userAuth");

const router = Router();

router.get("/", getAllGroups);

router.post("/", userAuth, createGroup);

router.get("/:id", getGroupById);

router.delete("/:id", userAuth, deleteGroup)

router.post("/:id/join", userAuth, joinGroup);

router.post("/:id/posts", userAuth, createPost);

router.get("/:id/posts", userAuth, getPosts);

router.put("/posts/:postId", userAuth, updatePost)

router.delete("/posts/:postId", userAuth, deletePost);

module.exports = router;
