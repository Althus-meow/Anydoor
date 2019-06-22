/* eslint-disable no-console */
const http = require("http");
const basicConfig = require("./config/basicConfig");
const route = require("./helper/route");
const openUrl = require("./helper/openUrl");

class MyServer {

  constructor(userConfig){
    this.config = Object.assign({}, basicConfig, userConfig);
  }

  start(){
    const server = http.createServer((req, res) => {
      route(req, res, this.config);
    });
    
    server.listen(this.config.port, this.config.hostname, () => {
      const addr = `http://${this.config.hostname}:${this.config.port}`;
      console.log(`Server start at ${addr}`);
      openUrl(addr);
    });
  }
}

module.exports = MyServer;