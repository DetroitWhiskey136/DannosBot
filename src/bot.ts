import 'dotenv/config';
import { GatewayIntentBits } from 'discord.js';
import { BotClient } from './index';

new BotClient({
  intents: [GatewayIntentBits.Guilds],
})
  .loadCommands()
  .loadEvents()
  .login(process.env.BOT_TOKEN);
