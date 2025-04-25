
require("dotenv").config();
const app = require("./src/app");
const config = require("./src/config/config");
require("./src/db/db");


let port = config.PORT || 4000


app.listen(port, () => {
    console.log(`app listening on port ${port}`);
});
