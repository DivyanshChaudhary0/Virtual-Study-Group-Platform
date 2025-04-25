
const {Router} = require("express");

const router = Router();

router.get("/groups", async(req,res) => {
    try{
        
    }
    catch(err){
        res.status(500).json({
            message: err.message
        })
    }
});

router.post("/groups", );

router.get("/groups/:id", );

router.post("/groups/:id/join", );

router.post("/groups/:id/posts", );

router.get("/groups/:id/posts", )


module.exports = router;