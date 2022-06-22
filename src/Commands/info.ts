// #region imports
import {
  SlashCommandBuilder,
  SlashCommandStringOption,
  SlashCommandSubcommandBuilder,
} from '@discordjs/builders';
import {
  AutocompleteInteraction,
  CommandInteraction,
  GuildMemberRoleManager,
  MessageActionRow,
  MessageEmbed,
  Modal,
  ModalActionRowComponent,
  ModalSubmitInteraction,
  TextInputComponent,
} from 'discord.js';
import { Infos } from '../Core/Database/Database';
import { BotClient } from '../Core/index';
// #endregion

const allowedRole = process.env.ALLOWED_ROLE;

// #region Check Permissions Function
async function checkPermission(interaction: CommandInteraction) {
  const memberRoles: GuildMemberRoleManager = await interaction
    .member?.roles as GuildMemberRoleManager;
  const hasAllowedRole = memberRoles.resolve(allowedRole!);

  if (!hasAllowedRole) {
    interaction.reply({ content: 'You do not have the required permissions to use this command', ephemeral: true });
    return false;
  }
  return true;
}
// #endregion

// #region Get Infos as List
async function GetInfosList(client: BotClient) {
  const data: string[] = [];
  const infos = await client.database.Infos.findAll();
  infos.forEach((info) => {
    const name = info.getDataValue('name');
    if (name) data.push(name);
  });
  return data.sort();
}

// #endregion

// #region Add Sub Command
const addInfoSubCommand = new SlashCommandSubcommandBuilder()
  .setName('add')
  .setDescription('Adds a new info!');

async function addInfoModal() {
  const modal = new Modal()
    .setCustomId('info_addInfoModal')
    .setTitle('New Info Details');

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
  return null;
}

// #endregion

// #region Edit SubCommand
const editStringOption = new SlashCommandStringOption()
  .setName('name')
  .setDescription('The name of the info you want to edit!')
  .setRequired(true);

const editInfoSubCommand = new SlashCommandSubcommandBuilder()
  .setName('edit')
  .setDescription('Edits a specified info entry')
  .addStringOption(editStringOption);

async function editInfoModal(info: Infos) {
  const modal = new Modal()
    .setCustomId(`info_editInfoModal_${info.name}`)
    .setTitle('Edit Info Details');

  const titleInput = new TextInputComponent()
    .setCustomId('titleInput')
    .setLabel('Title!')
    .setRequired(true)
    .setStyle('SHORT')
    .setValue(info.title);

  const contentInput = new TextInputComponent()
    .setCustomId('contentInput')
    .setLabel('Content!')
    .setRequired(true)
    .setStyle('PARAGRAPH')
    .setValue(info.content);

  const linkInput = new TextInputComponent()
    .setCustomId('linkInput')
    .setLabel('Link!')
    .setStyle('SHORT')
    .setValue(info.link);

  const imageInput = new TextInputComponent()
    .setCustomId('imageInput')
    .setLabel('Image!')
    .setStyle('SHORT')
    .setValue(info.image);

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
    titleActionRow,
    contentActionRow,
    linkActionRow,
    imageActionRow,
  );

  return modal;
}

async function editInfo(client: BotClient, interaction: CommandInteraction) {
  const info = await client.database.Infos.findOne({
    where: {
      name: interaction.options.getString('name'),
    },
  });

  if (!info) return interaction.reply({ content: 'No such info exists in our database please try again or use the `info list` command to get the available infos!', ephemeral: true });

  const modal = await editInfoModal(info);
  await interaction.showModal(modal);
  return null;
}
// #endregion

// #region Delete Sub Command
const deleteStringOption = new SlashCommandStringOption()
  .setName('name')
  .setDescription('The name of the info you want to edit!')
  .setRequired(true);

const deleteInfoSubCommand = new SlashCommandSubcommandBuilder()
  .setName('delete')
  .setDescription('Deletes a specified info entry')
  .addStringOption(deleteStringOption);

async function deleteInfo(client: BotClient, interaction: CommandInteraction) {
  const info = await client.database.Infos.findOne({
    where: {
      name: interaction.options.getString('name'),
    },
  });

  if (!info) return interaction.reply({ content: 'No such info exists in our database please try again or use the `info list` command to get the available infos!', ephemeral: true });

  client.database.Infos.destroy({
    where: {
      name: info.name,
    },
  });

  await interaction.reply({ content: `Information: \`${info.name}\` was successfully deleted`, ephemeral: true });

  return null;
}
// #endregion

// #region Get Sub Command
const infoNameStringOption = new SlashCommandStringOption()
  .setName('name')
  .setDescription('The info name you would like to retrieve!')
  .setRequired(true)
  .setAutocomplete(true);

const getInfoSubCommand = new SlashCommandSubcommandBuilder()
  .setName('get')
  .setDescription('Gets a specified info!')
  .addStringOption(infoNameStringOption);

async function getInfo(client: BotClient, interaction: CommandInteraction) {
  const dbEntry = await client.database.Infos.findOne({
    where: {
      name: interaction.options.getString('name'),
    },
  });

  if (!dbEntry) return interaction.reply({ content: 'No such info exists in our database please try again or use the `info list` command to get the available infos!', ephemeral: true });

  const embed = new MessageEmbed()
    .setTitle(dbEntry.title)
    .setDescription(dbEntry.content)
    .setColor(0x12a1f4);

  if (dbEntry.link.length >= 1) {
    embed.setURL(dbEntry.link);
  }

  if (dbEntry.image.length >= 1) {
    embed.setImage(dbEntry.image);
  }

  return interaction.reply({ embeds: [embed] });
}
// #endregion

// #region List Sub Command
const listInfoSubCommand = new SlashCommandSubcommandBuilder()
  .setName('list')
  .setDescription('Lists all available infos in the database!');

async function listInfo(client: BotClient, interaction: CommandInteraction) {
  // TODO Extend the embed creation to auto parse the length of
  // the data due to possible exceeding the character limit of
  // an embed description.
  const data: Array<string> = await GetInfosList(client);
  const embed = new MessageEmbed()
    .setColor(0x12a1f4)
    .setDescription(data.map((i) => `\`${i}\``).sort().join(','));

  return interaction.reply({ embeds: [embed] });
}

// #endregion

// #region Info Command
const infoCommand = new SlashCommandBuilder()
  .setName('info')
  .setDescription('A slash command clone of the dbm mods bot info command')
  .setDMPermission(false)
  .addSubcommand(getInfoSubCommand)
  .addSubcommand(listInfoSubCommand)
  .addSubcommand(addInfoSubCommand)
  .addSubcommand(editInfoSubCommand)
  .addSubcommand(deleteInfoSubCommand);
// #endregion

export = {
  data: infoCommand,
  async execute(client: BotClient, interaction: CommandInteraction) {
    switch (interaction.options.getSubcommand()) {
      case 'add':
        if (await checkPermission(interaction)) {
          await addInfo(client, interaction);
        }
        break;

      case 'edit':
        if (await checkPermission(interaction)) {
          await editInfo(client, interaction);
        }
        break;

      case 'delete':
        if (await checkPermission(interaction)) {
          await deleteInfo(client, interaction);
        }
        break;

      case 'get':
        await getInfo(client, interaction);
        break;

      case 'list':
        await listInfo(client, interaction);
        break;

      default:
        interaction.reply({ content: `Unknown sub command in command: ${interaction.commandName}`, ephemeral: true });
        break;
    }

    return null;
  },

  async executeModalSubmit(client: BotClient, interaction: ModalSubmitInteraction) {
    const modalID = interaction.customId.split('_');

    switch (modalID[1]) {
      case 'addInfoModal': {
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
      }

      case 'editInfoModal': {
        // eslint-disable-next-line no-case-declarations
        const data: any = {};
        await interaction.components.forEach((actionRow) => {
          actionRow.components.forEach((component) => {
            data[component.customId] = component.value;
          });
        });

        try {
          const hasEntry = await client.database.Infos.findOne({ where: { name: modalID[2] } });
          if (!hasEntry) return interaction.reply({ content: 'An info with that name doesn\'t exist in our database', ephemeral: true });

          await client.database.Infos.update(
            {
              image: data.imageInput,
              link: data.linkInput,
              content: data.contentInput,
              title: data.titleInput,
            },
            {
              where: {
                name: hasEntry.name,
              },
            },
          );

          interaction.reply({ content: 'Thank you for editing the info!', ephemeral: true });
        } catch (error: any) {
          interaction.reply({ content: `You info data was not submitted because of an error!\nError: ${error.message}`, ephemeral: true });
        }
        break;
      }

      default:
        interaction.reply({
          content: 'Modal not found!', ephemeral: true,
        });
        break;
    }

    return true;
  },

  async executeAutocomplete(client: BotClient, interaction: AutocompleteInteraction) {
    const choices: string[] = await GetInfosList(client);
    const focusedValue = interaction.options.getFocused() as string;
    const filtered = choices.filter((choice) => choice.startsWith(focusedValue));
    await interaction.respond(
      filtered.map((choice) => ({ name: choice, value: choice })),
    );
  },
};
