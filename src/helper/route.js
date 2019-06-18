const fs = require("fs");
const path = require("path");
const basicConfig = require("../config/basicConfig");

const {promisify} = require("util");
const stat = promisify(fs.stat);
// const readdir = promisify(fs.readdir);
// const createReadStream = promisify(fs.createReadStream);

module.exports = async function(req, res){
  const filePath = path.join(basicConfig.root, req.url);
  try{
    const stats = await stat(filePath);
    if (stats.isFile()){
      res.statusCode = 200;
      res.setHeader("Content-Type", "text/plain");
      fs.createReadStream(filePath).pipe(res);
    } else if (stats.isDirectory()){
      fs.readdir(filePath, (err, files) => {
        res.statusCode = 200;
        res.setHeader("Content-Type", "text/plain");
        res.end(files.join(", "));
      });
    }
  }catch (err){
    res.statusCode = 404;
    res.setHeader("Content-Type", "text/plain");
    res.end(`${filePath} is not a dictionary or file: 
    ${err}`);
  }
}