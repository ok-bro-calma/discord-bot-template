module.exports = (client) => {
  // you might want to setup a dashboard, i'm currently not experienced enough for that
  const host = require('express')();
  host.get('/', (req, res) => res.send(`Status: ${client.isReady() ? 'online' : 'offline'}`));
  host.listen(2023);

  // add necessary listeners
  client.on('error', (error) => {
    console.log(`[client] :: error :: [${client.util.time()}]`);
    console.log(error);
  });

  client.on('shardDisconnect', (event, id) => {
    console.log(`[shard#${id}] :: disconnected :: [${client.util.time()}]`);
    console.log(event);
  });

  client.on('shardError', (error, id) => {
    console.log(`[shard#${id}] :: error :: [${client.util.time()}]`);
    console.log(error);
  });

  client.on('shardReady', (id, unavailableGuilds) => {
    console.log(`[shard#${id}] :: connected :: [${client.util.time()}]`);
    if (unavailableGuilds) console.log(' unavailable Guild', unavailableGuilds);
  });

  client.on('shardReconnecting', (id) => {
    console.log(`[shard#${id}] :: reconnecting :: [${client.util.time()}]`);
  });

  client.on('shardResume', (id, replayedEvents) => {
    console.log(`[shard#${id}] :: reconnected [${replayedEvents} event(s)] :: [${client.util.time()}]`);
  });

  // add process listeners too!
  // these don't let your bot crash in case theres an error (most of the time)
  // the bot however, may get irresponsive depending upon the error
  process.on('unhandledRejection', (reason, promise) => {
    console.log(`[process] :: unhandled rejection :: [${client.util.time()}]`);
    console.log(reason);
    console.log(promise);
  });

  process.on('uncaughtException', (error, origin) => {
    console.log(`[process] :: uncaught exception :: [${client.util.time()}]`);
    console.log([origin]);
    console.log(error);
  });

  process.on('warning', ({ message, stack }) => {
    console.log(`[process] :: warning :: [${client.util.time()}]`);
    console.log([message]);
    console.log(stack);
  });

  // login! kill the process on failure
  client.login(process.env.token)
  .catch(() => process.kill(process.pid));
}
