const fs = require("fs");
const path = require("path");
const basicConfig = require("../config/basicConfig");
const handlebars = require("handlebars");
const mime = require("../helper/mime");

const { promisify } = require("util");
const stat = promisify(fs.stat);
const readdir = promisify(fs.readdir);
// const createReadStream = promisify(fs.createReadStream);

const dirTplPath = path.join(__dirname, "../templates/dir.tpl");
const dirTpl = handlebars.compile(fs.readFileSync(dirTplPath, "utf-8"));

module.exports = async function (req, res) {
  const filePath = path.join(basicConfig.root, req.url);
  try {
    const stats = await stat(filePath);
    if (stats.isFile()) {
      const contentType = mime(filePath);
      res.statusCode = 200;
      res.setHeader("Content-Type", contentType);
      fs.createReadStream(filePath).pipe(res);
    } else if (stats.isDirectory()) {
      let files = await readdir(filePath);
      const dir = path.relative(basicConfig.root, filePath);
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