import { ChatInputCommandInteraction, SlashCommandBuilder } from 'discord.js';
import { BotClient } from '../Core/index';

export = {
  data: new SlashCommandBuilder()
    .setName('server')
    .setDescription('Replies with server info!'),

  async execute(client: BotClient, interaction: ChatInputCommandInteraction) {
    await interaction.reply(`Server name: ${interaction.guild!.name}\nTotal members: ${interaction.guild!.memberCount}`);
  },
};
