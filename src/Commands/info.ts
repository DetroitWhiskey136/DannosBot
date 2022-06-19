// #region imports
import {
  SlashCommandBuilder,
  SlashCommandSubcommandBuilder,
} from '@discordjs/builders';
import {
  CommandInteraction,
  MessageActionRow,
  Modal,
  ModalActionRowComponent,
  ModalSubmitInteraction,
  TextInputComponent,
} from 'discord.js';
import { BotClient } from '../Core/index';
// #endregion

// #region Add Sub Command

const addSubCommand = new SlashCommandSubcommandBuilder()
  .setName('add')
  .setDescription('adds a new info!');

async function addInfoModal() {
  const modal = new Modal()
    .setCustomId('info_addInfoModal')
    .setTitle('New Modal Details');

  const idInput = new TextInputComponent()
    .setCustomId('idInput')
    .setLabel('Name!')
    .setRequired(true)
    .setStyle('SHORT');

  const titleInput = new TextInputComponent()
    .setCustomId('titleInput')
    .setLabel('Title!')
    .setRequired(true)
    .setStyle('SHORT');

  const contentInput = new TextInputComponent()
    .setCustomId('contentInput')
    .setLabel('Content!')
    .setRequired(true)
    .setStyle('PARAGRAPH');

  const linkInput = new TextInputComponent()
    .setCustomId('linkInput')
    .setLabel('Link!')
    .setStyle('SHORT');

  const imageInput = new TextInputComponent()
    .setCustomId('imageInput')
    .setLabel('Image!')
    .setStyle('SHORT');

  const firstActionRow = new
  MessageActionRow<ModalActionRowComponent, ModalActionRowComponent>()
    .addComponents([idInput]);
  const contentActionRow = new
  MessageActionRow<ModalActionRowComponent>()
    .addComponents(contentInput);

  const titleActionRow = new
  MessageActionRow<ModalActionRowComponent>()
    .addComponents(titleInput);

  const linkActionRow = new
  MessageActionRow<ModalActionRowComponent>()
    .addComponents(linkInput);
  const imageActionRow = new
  MessageActionRow<ModalActionRowComponent>()
    .addComponents(imageInput);

  modal.addComponents(
    firstActionRow,
    titleActionRow,
    contentActionRow,
    linkActionRow,
    imageActionRow,
  );

  return modal;
}

async function addInfo(client: BotClient, interaction: CommandInteraction) {
  const modal = await addInfoModal();
  await interaction.showModal(modal);
}

// #endregion

// #region Info Command
const infoCommand = new SlashCommandBuilder()
  .setName('info')
  .setDescription('A slash command clone of the dbm mods bot info command')
  .addSubcommand(addSubCommand);
// #endregion

export = {
  data: infoCommand,
  async execute(client: BotClient, interaction: CommandInteraction) {
    switch (interaction.options.getSubcommand()) {
      case 'add':
        await addInfo(client, interaction);
        break;

      default:
        interaction.reply(`Unknown sub command in command: ${interaction.commandName}`);
        break;
    }
  },

  async executeModalSubmit(client: BotClient, interaction: ModalSubmitInteraction) {
    const modalID = interaction.customId;

    switch (modalID) {
      case 'info_addInfoModal':
        // eslint-disable-next-line no-case-declarations
        const data: any = {};
        await interaction.components.forEach((actionRow) => {
          actionRow.components.forEach((component) => {
            data[component.customId] = component.value;
          });
        });

        try {
          const hasEntry = await client.database.Infos.findOne({ where: { name: data.idInput } });
          if (hasEntry) return interaction.reply({ content: 'An info with that name already exists', ephemeral: true });

          await client.database.Infos.create({
            name: data.idInput ?? '',
            aliases: data.aliasesInput ?? '',
            image: data.imageInput ?? '',
            link: data.linkInput ?? '',
            content: data.contentInput ?? '',
            title: data.titleInput ?? '',
          });

          interaction.reply({ content: 'Thank you for submitting a new info!', ephemeral: true });
        } catch (error: any) {
          interaction.reply({ content: `You info data was not submitted because of an error!\nError: ${error.message}`, ephemeral: true });
        }
        break;

      default:
        interaction.reply({
          content: 'Modal not found!', ephemeral: true,
        });
        break;
    }

    return true;
  },
};
