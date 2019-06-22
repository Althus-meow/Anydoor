const yargs = require("yargs");
const MyServer = require("./app");

const argv = yargs
  .usage("anywhere [option]")
  .option("p",{
    alias : "port",
    describe : "port number",
    default : 9527
  })
  .option("h", {
    alias : "hostname",
    describe : "host name",
    default : "127.0.0.1"
  })
  .option("d", {
    alias : "root",
    describe : "root dirctory",
    default : process.cwd()
  })
  .version()
  .alias("v", "version")
  .help()
  .argv;

const server = new MyServer(argv);
server.start();