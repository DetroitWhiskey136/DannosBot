import { ChatInputCommandInteraction } from 'discord.js';
import { BotClient } from '../Core';

export = {
  name: 'interactionCreate',
  once: false,
  async execute(client: BotClient, interaction: ChatInputCommandInteraction) {
    const isCommand = interaction.isCommand();
    const isModalSubmit = interaction.isModalSubmit();
    const isAutocomplete = interaction.isAutocomplete();

    const { commandName } = interaction;

    const command = client.commands.get(commandName as string);

    if (!command) return;

    try {
      if (isCommand) {
        await command.execute(client, interaction);
      }

      if (isModalSubmit) {
        await command.executeModalSubmit(client, interaction);
      }

      if (isAutocomplete) {
        await command.executeAutocomplete(client, interaction);
      }
    } catch (error) {
      console.error(error);
      await interaction.reply({
        content: 'There was an error while executing this command!',
        ephemeral: true,
      });
    }
  },
};
