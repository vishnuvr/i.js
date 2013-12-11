var fs = require('fs'),
    logger = require('log4js').getLogger("scrapbook"),
    path = require('path'),
    shared = require('./shared');

var init = function () {
    logger.info("init()");
    if (fs.existsSync(shared.workdir)) {
        if (!fs.statSync(shared.workdir).isDirectory()) {
            throw new Error(shared.workdir + " should be a directory");
        }
    } else {
        fs.mkdirSync(shared.workdir);
    }
}

exports.scrapbook = function (req, res) {
    logger.info("scrapbook()");

    if (!req.query) {
        logger.info("missing request query");
        return;
    }

    var id = req.params[0];
    logger.info("id:" + id);
    res.render('scrapbook', { title: shared.title, id: id });
};

exports.save = function (req) {
    logger.info("save()");
    if (!req.body) {
        logger.info("missing request body");
        return;
    }

    var id = req.body.id;
    var data = req.body.data;

    if (id && data) {
        logger.info("id: " + id);
        logger.debug("data: " + data);
        var file = path.join(shared.workdir, id + ".json");
        fs.writeFile(file, JSON.stringify(data), function (err) {
            if (err) {
                logger.error(err);
                throw err;
            } else {
                logger.info("The file was saved!");
            }
        });
    }
};

exports.load = function (req, res) {
    logger.info("load()");
    if (!req.query) {
        logger.info("missing request query");
        return;
    }

    var id = req.query.id;
    if (id) {
        logger.info("id: " + id);
        var file = path.join(shared.workdir, id + ".json");
        logger.info("file: " + file);
        fs.readFile(file, function (err, data) {
            if (err) {
                res.send({name: id, cells: []});
            } else {
                logger.debug("data: " + data);
                res.send(JSON.parse(data));
            }
        });
    }
};

init();