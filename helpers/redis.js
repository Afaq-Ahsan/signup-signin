const redis = require("redis");

const configs = require("../configs/index");

const client = redis.createClient({
  uerl: configs.redis.host,
});

client.on("connect", () => {
  console.log("client connected to the redis....");
});

client.on("ready", () => {
  console.log("Client connected to redis and ready to use...");
});

client.on("error", (err) => {
  console.log(err.message);
});
client.on("end", () => {
  console.log("Client disconnected from redis");
});
// SIGINT stands for "Signal Interrupt".
process.on("SIGINT", () => {
  client.quit();
});
module.exports = client;
