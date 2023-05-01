// no need to customize this file!
module.exports = async (client, i) => {
  const command = client.commands.slash.get(i.commandName); // look for the commmand in data
  if (!command?.run) return; // return if it doesn't exist or the command doesn't have a run function
  await command.run(client, i); // errors are logged, don't worry
};
