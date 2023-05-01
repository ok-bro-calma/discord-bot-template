// no need to customize this file!
module.exports = async (client, i) => {
  // loop through all initially specified types
  for (const [type, interaction] of client.interactions) {
    if (!i[type]?.()) continue; // skip if type doesn't exist or check results in false
    // try and log errors (if any)
    try {
      await interaction(client, i);
    }
    catch(e) {
      console.log(`[interaction] :: ${type} interaction error :: [${client.util.time()}]`);
      console.log(e);
    };
    break; // obvious
  };
};
