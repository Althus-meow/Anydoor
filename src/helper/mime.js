const path = require("path");
const mimeTypes = require("../config/mimeTypes");

module.exports = function(filePath){
  let extName = path.extname(filePath).split(".").pop().toLowerCase();

  if (!extName){
    extName = filePath;
  }

  return mimeTypes[extName] || mimeTypes["txt"];
};