import axios, { Method } from 'axios';
import React from 'react';
import { Bot, parseCommand } from '../utils/parseCommand';

export interface BotRequest {
    botName: string;
    response: Promise<any>;
}

const useCommand = (bots: Bot[]): [BotRequest | null, (input: string) => void] => {
    const [request, setResponse] = React.useState<BotRequest | null>(null);
    const handleCommand = (input: string) => {
        const { headers, body, endpoint, botName } = parseCommand(bots, input);
        setResponse({
            botName,
            response: axios({
                headers,
                data: body,
                method: endpoint.method as Method,
                url: endpoint.url,
            }),
        });
    };

    return [request, handleCommand];
};
export default useCommand;
