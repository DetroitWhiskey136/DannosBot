import 'dotenv/config';
import { Intents } from 'discord.js';
import { BotClient } from './index';

new BotClient({
  intents: [Intents.FLAGS.GUILDS],
})
  .loadCommands()
  .loadEvents()
  .login(process.env.BOT_TOKEN);
