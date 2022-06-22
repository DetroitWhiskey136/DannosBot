import { CommandInteraction } from 'discord.js';
import { BotClient } from '../Core/index';

export = {
  name: 'interactionCreate',
  once: false,
  async execute(client: BotClient, interaction: CommandInteraction) {
    const isCommand = interaction.isCommand();
    const isModalSubmit = interaction.isModalSubmit();
    const isAutocomplete = interaction.isAutocomplete();

    let commandName;

    if (isCommand || isAutocomplete) {
      commandName = interaction.commandName;
    }

    if (isModalSubmit) {
      // eslint-disable-next-line prefer-destructuring
      commandName = interaction.customId.split('_')[0];
    }

    const command = client.commands.get(commandName as string);

    if (!command) return;

    try {
      if (isCommand) {
        await command.execute(client, interaction);
      }

      if (isModalSubmit) {
        await command.executeModalSubmit(client, interaction);
      }

      if (isModalSubmit) {
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
