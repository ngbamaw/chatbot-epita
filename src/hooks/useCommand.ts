import axios, { Method } from 'axios';
import React from 'react';
import { getbyString } from '../utils';
import { Bot, parseCommand } from '../utils/parseCommand';

export interface BotRequest {
    botName: string;
    response: Promise<{ type: string; payload: any }>;
}


const useCommand = (bots: Bot[]): [BotRequest | null, (input: string) => void] => {
    const [request, setResponse] = React.useState<BotRequest | null>(null);
    const handleCommand = React.useCallback(
        (input: string) => {
            const { headers, body, endpoint, botName, responseFormat } = parseCommand(bots, input);
            const response = axios({
                headers,
                data: body,
                method: endpoint.method as Method,
                url: endpoint.url,
            }).then(({ data }) => {
                if (responseFormat) {
                    const base = getbyString(data, responseFormat.path);
                    switch (responseFormat.type) {
                        case 'MultiplePresentation':
                            return {
                                type: responseFormat.type,
                                payload: base.map((item: any) => ({
                                    title: getbyString(item, responseFormat.fields.title),
                                    text: responseFormat.fields.text
                                        ? getbyString(item, responseFormat.fields.text)
                                        : undefined,
                                    img: responseFormat.fields.img
                                        ? getbyString(item, responseFormat.fields.img)
                                        : responseFormat.fields.defaultImg,
                                })),
                                originalData: data,
                            };
                        default:
                            throw new Error("Unexpected response format's type");
                    }
                }

                return { type: 'default', payload: data, originalData: data };
            });

            setResponse({
                botName,
                response,
            });
        },
        [bots],
    );

    return [request, handleCommand];
};
export default useCommand;
