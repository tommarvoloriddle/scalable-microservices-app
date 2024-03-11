// log all requests

// write custom logging middleware
const logging = (req, res, next) => {
    console.log(`${req.method} ${req.path}`);
    next();
};

module.exports = logging;