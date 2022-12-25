import {
  ChatInputCommandInteraction,
  SlashCommandBuilder,
  SlashCommandStringOption, SlashCommandSubcommandBuilder,
} from 'discord.js';
import { BotClient } from '../Core';

// #region Add Sub Command
const nameOption = new SlashCommandStringOption()
  .setName('tagline')
  .setDescription('what tagline would you like to add?');

const descriptionOption = new SlashCommandStringOption()
  .setName('description')
  .setDescription('what tagline would you like to add?');

const addSubcommand = new SlashCommandSubcommandBuilder()
  .setName('add')
  .setDescription('Adds a new tag to the database.')
  .addStringOption(nameOption)
  .addStringOption(descriptionOption);

async function AddTag(client: BotClient, interaction: ChatInputCommandInteraction) {
  const tagName = interaction.options.get('tagline')?.value as string;
  const tagDescription = interaction.options.get('description')?.value as string;

  try {
    // equivalent to: INSERT INTO tags (name, description, username) values (?, ?, ?);
    const tag = await client.database.Tags.create({
      name: tagName,
      description: tagDescription,
      username: interaction.user.username,
      usage_count: 0,
    });

    return interaction.reply(`Tag ${tag.name} added.`);
  } catch (error: any) {
    if (error.name === 'SequelizeUniqueConstraintError') {
      return interaction.reply('That tag already exists.');
    }

    console.log(error);

    return interaction.reply('Something went wrong with adding a tag.');
  }
}
// #endregion

// #region Tag Command
const TagCommand = new SlashCommandBuilder()
  .setName('tag')
  .setDescription('Tags!')
  .addSubcommand(addSubcommand);
// #endregion

export = {
  data: TagCommand,

  async execute(client: BotClient, interaction: ChatInputCommandInteraction) {
    console.log(interaction.commandName);
    switch (interaction.options.getSubcommand()) {
      case 'add':
        await AddTag(client, interaction);
        break;

      default:
        await interaction.reply({
          content: 'Something went wrong processing your command try again later!',
          ephemeral: true,
        });
        break;
    }
  },
};
