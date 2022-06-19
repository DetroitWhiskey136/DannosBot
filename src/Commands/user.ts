import { SlashCommandBuilder } from '@discordjs/builders';
import { CommandInteraction } from 'discord.js';
import { BotClient } from '../Core/index';

export = {
  data: new SlashCommandBuilder()
    .setName('user')
    .setDescription('Replies with user info!'),

  async execute(client: BotClient, interaction: CommandInteraction) {
    await interaction.reply(`Your tag: ${interaction.user.tag}\nYour id: ${interaction.user.id}`);
  },
};
