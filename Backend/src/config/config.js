
const _config = {
    PORT: process.env.PORT,
    MONGO_URI: process.env.MONGO_URI,
    JWT_SECRET: process.env.JWT_SECRET,
    JWT_EXPIARY: process.env.JWT_EXPIARY
}

const config = Object.freeze(_config);

module.exports = config;
