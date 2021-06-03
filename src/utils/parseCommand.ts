import { Command } from 'commander';
import stringArgv from 'string-argv';

interface AccessNone {
    type: 'NONE';
}
interface AccessGet {
    type: 'GET_PARAMS';
    tokens: { name: string; value: string }[];
}
interface AccessHeader {
    type: 'HEADER_PARAMS';
    tokens: { name: string; value: string }[];
}

export interface Bot {
    name: string;
    access: AccessNone | AccessGet | AccessHeader;
    commands: { [command: string]: BotCommand };
    presentation: string;
}

interface BotCommand {
    endpoint: { method: 'GET' | 'POST' | 'DELETE' | 'UPDATE'; url: string };
    predefinedParams?: { [key: string]: string };
    params: Param[];
    responseFormat?: ResponseFormat;
}

interface ResponseFormat {
    type: 'MultiplePresentation' | 'Presentation';
    path: string;
    fields: {
        img: string;
        title: string;
        text: string;
        defaultImg?: string;
    };
}
interface Param {
    name: string;
    aliases: string[];
}

export interface RequestInfo {
    responseFormat?: ResponseFormat;
    botName: string;
    headers: Record<string, string>;
    body: Record<string, any>;
    endpoint: { method: 'GET' | 'POST' | 'DELETE' | 'UPDATE'; url: string };
}

const getParams = new URLSearchParams();
const headers: Record<string, string> = {};

const extractArgs = (command: BotCommand, args: string[]) => {
    const { predefinedParams = {}, params } = command;
    for (const [name, value] of Object.entries(predefinedParams)) {
        getParams.set(name, value);
    }

    const program = new Command();

    for (const { name, aliases } of params) {
        program.requiredOption(`${aliases[0]}, ${aliases[1]} <value>`, '', (v) =>
            getParams.set(name, v),
        );
    }

    program.parse(args, { from: 'user' });
};

export const parseCommand = (bots: Bot[], input: string): RequestInfo => {
    const [name, command, ...values] = stringArgv(input);

    const bot = bots.find((b) => b.name === name);

    if (bot) {
        let params = values;
        if (!values.some((value) => value[0] === '-')) {
            params = values.reduce(
                (r, a, index) => [...r, bot.commands[command].params[index].aliases[0], a],
                [] as string[],
            );
        }
        extractArgs(bot.commands[command], params);

        switch (bot.access.type) {
            case 'GET_PARAMS':
                for (const { name: key, value } of bot.access.tokens) getParams.set(key, value);
                break;
            case 'HEADER_PARAMS':
                for (const { name: key, value } of bot.access.tokens) headers[key] = value;
                break;
            case 'NONE':
                break;
            default:
                throw new Error('Unexepected access token type');
        }

        const { endpoint, responseFormat } = bot.commands[command];
        const url = `${endpoint.url}?${getParams.toString()}`;

        return {
            headers,
            body: {},
            endpoint: { method: endpoint.method, url },
            botName: name,
            responseFormat,
        };
    }

    throw new Error('Bot not found');
};
