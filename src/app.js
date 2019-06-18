/* eslint-disable no-console */
const http = require("http");
const basicConfig = require("./config/basicConfig");
const route = require("./helper/route");

const server = http.createServer((req, res) => {
  route(req, res);
});

server.listen(basicConfig.port, basicConfig.hostname, () => {
  const addr = `http://${basicConfig.hostname}:${basicConfig.port}`;
  console.log(`Server start at ${addr}`);
});