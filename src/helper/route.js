const fs = require("fs");
const path = require("path");
const handlebars = require("handlebars");
const mime = require("../helper/mime");
const compress = require("../helper/compress");
const range = require("../helper/range");
const isFresh = require("../helper/cache");

const { promisify } = require("util");
const stat = promisify(fs.stat);
const readdir = promisify(fs.readdir);
// const createReadStream = promisify(fs.createReadStream);

const dirTplPath = path.join(__dirname, "../templates/dir.tpl");
const dirTpl = handlebars.compile(fs.readFileSync(dirTplPath, "utf-8"));

module.exports = async function (req, res, config) {
  const filePath = path.join(config.root, req.url);
  try {
    const stats = await stat(filePath);
    if (stats.isFile()) {
      const contentType = mime(filePath);
      res.setHeader("Content-Type", contentType);

      if (isFresh(stats, req, res)){
        res.statusCode = 304;
        res.end();
        return;
      }

      const {code, start, end} = range(stats.size, req, res);
      let readStream;
      if (code == 200){
        res.statusCode = code;
        readStream = fs.createReadStream(filePath);
      } else {
        readStream = fs.createReadStream(filePath, {start, end});
      }
      if (filePath.match(config.compress)){
        readStream = compress(readStream, req, res);
      }
      readStream.pipe(res);
    } else if (stats.isDirectory()) {
      let files = await readdir(filePath);
      const dir = path.relative(config.root, filePath);
      const pageData = {
        files : files.map((file) => {
          return {
            file,
            type : mime(file)
          };
        }),
        dir : dir? `/${dir}` : "",
        title : path.basename(filePath)
      };

      res.statusCode = 200;
      res.setHeader("Content-Type", "text/html");
      // res.end(files.join(", "));
      res.end(dirTpl(pageData));
    }
  } catch (err) {
    res.statusCode = 404;
    res.setHeader("Content-Type", "text/plain");
    res.end(`${filePath} is not a dictionary or file: 
    ${err}`);
  }
};