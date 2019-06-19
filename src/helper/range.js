module.exports = (totalSize, req, res) => {
  const range = req.headers["range"];
  const retObj = {
    code: 200
  };
  if (!range){
    return retObj;
  }

  const indexes = range.match(/bytes=(\d*)-(\d*)/);//index 0 is the matched content
  const start = indexes[1];
  const end = indexes[2];
  if (start > end || start < 0 || end > totalSize){
    retObj.code = 416;
    return retObj;
  } else {
    res.setHeader("Accept-Ranges", "byte");
    res.setHeader("Content-Range", `bytes ${start}-${end}/${totalSize}`);
    res.setHeader("Content-Length", end - start);
    retObj.code = 216;
    retObj.start = parseInt(start);
    retObj.end = parseInt(end);
    return retObj;
  }
};