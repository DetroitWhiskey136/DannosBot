/* eslint-disable no-use-before-define */
import fs from 'node:fs';
import path from 'node:path';
import {
  Client, ClientOptions, Collection, SlashCommandBuilder,
} from 'discord.js';
import { Database } from '../index';

export interface Event {
  name: string;
  once: boolean;
  execute: Function;
}

export interface Command {
  data: SlashCommandBuilder;
  execute: Function;
  executeModalSubmit: Function;
  executeAutocomplete: Function;
}

export interface BotClient extends Client {
  commands: Collection<string, Command>;
  database: typeof Database;

  /**
   * Loads all the commands from the Commands folder.
   *
   * @return {*}  {BotClient}
   * @memberof BotClient
   */
  loadCommands(): BotClient;

  /**
   * Loads all the events from the Events folder.
   *
   * @return {*}  {BotClient}
   * @memberof BotClient
   */
  loadEvents(): BotClient;
}

// noinspection JSUnusedGlobalSymbols
export class BotClient extends Client {
  private CommandsPath = path.join(__dirname, '../../Commands');

  private CommandFiles = this.getFiles(this.CommandsPath);

  private EventsPath = path.join(__dirname, '../../Events');

  private EventFiles = this.getFiles(this.EventsPath);

  constructor(options: ClientOptions) {
    super(options);
    this.commands = new Collection();
    this.database = Database;
  }

  public loadCommands() {
    this.CommandFiles.forEach(async (file) => {
      const filePath = path.join(this.CommandsPath, file);
      const command: Command = await import(filePath) as unknown as Command;

      this.commands.set(command.data.name, command);
    });

    return this;
  }

  public loadEvents() {
    this.EventFiles.forEach(async (file) => {
      const filePath = path.join(this.EventsPath, file);
      const event: Event = await import(filePath) as unknown as Event;

      if (event.once) {
        this.once(event.name, async (...args) => event.execute(this, ...args));
      } else {
        this.on(event.name, async (...args) => event.execute(this, ...args));
      }
    });

    return this;
  }

  /**
   * Gets the files from a specified path if they end in .js.
   * @param filePath The files path.
   * @returns a string array of files.
   */
  private getFiles(filePath: string) {
    return fs
      .readdirSync(filePath)
      .filter((file) => file.endsWith('.js'));
  }
}
