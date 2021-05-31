import { Command } from 'commander';

enum TypeAccess {
    GET_PARAMS = 'GET_PARAMS',
}

export interface Bot {
    name: string;
    access: { type: TypeAccess; name: string; token: string };
    commands: { [command: string]: BotCommand };
}

interface BotCommand {
    endpoint: { method: 'GET' | 'POST' | 'DELETE' | 'UPDATE'; url: string };
    predefinedParams: { [key: string]: string };
    params: Param[];
}

interface Param {
    name: string;
    aliases: string[];
}

export interface RequestInfo {
    botName: string;
    headers: Record<string, string>;
    body: Record<string, any>;
    endpoint: { method: 'GET' | 'POST' | 'DELETE' | 'UPDATE'; url: string };
}

const getParams = new URLSearchParams();

const extractArgs = (command: BotCommand, args: string[]) => {
    const { predefinedParams, params } = command;
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
    const [name, command, ...values] = input.split(' ');

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
            case TypeAccess.GET_PARAMS:
                getParams.set(bot.access.name, bot.access.token);
                break;
            default:
                throw new Error('Unexepected access token type');
        }

        const { endpoint } = bot.commands[command];
        const url = `${endpoint.url}?${getParams.toString()}`;

        return {
            headers: {},
            body: {},
            endpoint: { method: endpoint.method, url },
            botName: name,
        };
    }

    throw new Error('Bot not found');
};
