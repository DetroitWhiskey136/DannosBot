import { SlashCommandBuilder } from '@discordjs/builders';
import { CommandInteraction } from 'discord.js';
import { BotClient } from '../Core/index';

export = {
  data: new SlashCommandBuilder()
    .setName('ping')
    .setDescription('Replies with Pong!'),

  async execute(client: BotClient, interaction: CommandInteraction) {
    await interaction.reply('Pong!');
  },
};
