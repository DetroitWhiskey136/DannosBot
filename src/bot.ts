import 'dotenv/config';
import { GatewayIntentBits } from 'discord.js';
import { BotClient } from './Core';

new BotClient({
  intents: [GatewayIntentBits.Guilds],
})
  .loadCommands()
  .loadEvents()
  .login(process.env.BOT_TOKEN)
  .then(() => {
    console.log(`Bot has logged in at: ${Date.now()}`);
  })
  .catch((error) => console.error(error));
