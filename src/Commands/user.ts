import { ChatInputCommandInteraction, SlashCommandBuilder } from 'discord.js';
import { BotClient } from '../Core';

export = {
  data: new SlashCommandBuilder()
    .setName('user')
    .setDescription('Replies with user info!'),

  async execute(client: BotClient, interaction: ChatInputCommandInteraction) {
    await interaction.reply(`Your tag: ${interaction.user.tag}\nYour id: ${interaction.user.id}`);
  },
};
