require('dotenv').config();
const fs = require('node:fs');
const path = require('node:path');
const { Routes, REST } = require('discord.js');

const commands = [];
const commandsPath = path.join(process.cwd(), 'dist/src/Commands');
const commandFiles = fs.readdirSync(commandsPath).filter((file) => file.endsWith('.js'));

commandFiles.forEach((file) => {
  const filePath = path.join(commandsPath, file);
  const command = require(filePath);
  commands.push(command.data.toJSON());
});

const rest = new REST({ version: '10' }).setToken(process.env.BOT_TOKEN);

rest.put(
  Routes.applicationGuildCommands(process.env.CLIENT_ID, process.env.GUILD_ID),
  { body: commands },
)
  .then(() => console.log('Successfully registered application commands.'))
  .catch(console.error);
