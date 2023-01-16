import { ChatInputCommandInteraction } from 'discord.js';
import { BotClient, Command } from '../Core';

export = {
  name: 'interactionCreate',
  once: false,
  async execute(client: BotClient, interaction: ChatInputCommandInteraction) {
    const command: Command | undefined = client.commands.get(interaction.commandName);

    if (!command) return;

    try {
      if (interaction.isCommand()) {
        await command.execute(client, interaction);
      }

      if (interaction.isModalSubmit()) {
        await command.executeModalSubmit(client, interaction);
      }

      if (interaction.isAutocomplete()) {
        await command.executeAutocomplete(client, interaction);
      }
    } catch (error) {
      console.error(error);
      await interaction.reply({
        content: `There was an error executing command: [${interaction.commandName} (${interaction.id})]`,
        ephemeral: true,
      });
    }
  },
};
