import { ChatInputCommandInteraction, SlashCommandBuilder } from 'discord.js';
import { BotClient } from '../Core';

export = {
  data: new SlashCommandBuilder()
    .setName('ping')
    .setDescription('Replies with Pong!'),

  async execute(client: BotClient, interaction: ChatInputCommandInteraction) {
    await interaction.reply('Pong!');
  },
};
