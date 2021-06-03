/* eslint-disable import/no-cycle */
import React from 'react';
import SimpleBar from 'simplebar-react';
import { useDispatch, useSelector } from 'react-redux';
import SendIcon from './assets/send-icon.png';
import PlusIcon from './assets/plus.png';
import Style from './style';
import 'simplebar/dist/simplebar.min.css';
// import useCommand from './hooks/useCommand';
import bots from './commands.json';
// import { Bot } from './utils/parseCommand';
import { MultiplePresentation } from './components/MultiplePresentation';
import { BotElement } from './components/BotElement';
import { sendCommand } from './actions/command';
import { RootState } from '.';

interface Message {
    author?: string;
    payload: any;
    type?: string;
}

const ReceiverMessage: React.FC<{ children: string }> = ({ children }) => (
    <div className="message receiver">
        <p>{children}</p>
    </div>
);

const MeMessage: React.FC<{ children: string }> = ({ children }) => (
    <div className="message me">
        <p>{children}</p>
    </div>
);

const App: React.FC = () => {
    const [messageList, setMessageList] = React.useState<Message[]>([]);
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    // const [response, handleCommand] = useCommand(bots as Bot[]);
    const [pending, setPending] = React.useState(false);
    const [newMessage, setNewMessage] = React.useState(false);
    const [command, setCommand] = React.useState('');
    const discussionSection = React.useRef<HTMLDivElement>(null);
    const container = React.useRef<HTMLDivElement>(null);
    const scrollbarWrapper = React.useRef<HTMLDivElement>(null);
    const dispatch = useDispatch();

    React.useEffect(() => {
        if (scrollbarWrapper.current) scrollbarWrapper.current.scrollTop = 10000;
        const message = messageList[messageList.length - 1];
        if (messageList.length && message.author === 'me' && newMessage) {
            setNewMessage(false);
            if (message.payload.includes('@all hi')) {
                setMessageList([
                    ...messageList,
                    ...bots.map((bot) => ({ author: bot.name, payload: bot.presentation })),
                ]);
            } else {
                dispatch(sendCommand(message.payload));
                setPending(true);
            }
        }
    }, [dispatch, messageList, newMessage]);

    React.useEffect(() => {
        if (discussionSection.current && scrollbarWrapper.current)
            discussionSection.current.style.height = `${scrollbarWrapper.current.offsetHeight}px`;
    }, [discussionSection]);

    /*
    React.useEffect(() => {
        (async () => {
            if (response && pending) {
                const { response: data, botName } = response;
                const { payload, type } = await data;
                setPending(false);
                setMessageList([...messageList, { author: botName, payload, type }]);
            }
        })();
    }, [messageList, response, pending]);

    */
    const response = useSelector((state: RootState) => state.command);

    React.useEffect(() => {
        if (response.payload && pending) {
            const { payload, type, botName } = response.payload;
            setPending(false);
            setMessageList([...messageList, { author: botName, payload, type }]);
        }
    }, [messageList, response, pending]);

    const enterCommand = () => {
        if (command) {
            setMessageList([...messageList, { author: 'me', payload: command }]);
            setCommand('');
            setNewMessage(true);
        }
    };

    const onKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            enterCommand();
        }
    };

    return (
        <Style ref={container}>
            <div className="header-app">
                <div className="icon" />
            </div>
            <div className="bots-list">
                <div className="header-bot-list">
                    <button className="round-btn add-btn" type="button">
                        <img src={PlusIcon} alt="add" />
                    </button>

                    <div className="round-textfield search-bot">
                        <input type="text" placeholder="Search bot" />
                    </div>
                </div>
                <SimpleBar className="scrollbar">
                    {bots.map(({ name, description, icon }) => (
                        <BotElement name={name} description={description} icon={icon} />
                    ))}
                </SimpleBar>
            </div>
            <div className="main-content">
                <SimpleBar
                    className="scrollbar-discussion"
                    scrollableNodeProps={{ ref: scrollbarWrapper }}
                >
                    <div className="discussion-section" ref={discussionSection}>
                        {messageList.map(({ author, payload, type }) => {
                            if (author === 'me') return <MeMessage>{payload}</MeMessage>;
                            switch (type) {
                                case 'MultiplePresentation':
                                    return <MultiplePresentation data={payload} />;
                                default:
                                    return <ReceiverMessage>{payload}</ReceiverMessage>;
                            }
                        })}
                        {/*
                        <PresentationMessage
                            img="https://cdn.pixabay.com/photo/2013/11/28/10/03/river-219972_960_720.jpg"
                            title="Title"
                            text="Description of the bot, what it can do, how it’s work, etc..."
                        />
                        <PresentationMessage
                            img="https://cdn.pixabay.com/photo/2013/11/28/10/03/river-219972_960_720.jpg"
                            title="Title"
                            text="Description of the bot, what it can do, how it’s work, etc..."
                        />
                        <MultiplePresantation
                            data={[
                                {
                                    title: 'Title',
                                    text:
                                        'Description of the bot, what it can do, how it’s work, etc...',
                                    img:
                                        'https://cdn.pixabay.com/photo/2013/11/28/10/03/river-219972_960_720.jpg',
                                },
                                {
                                    title: 'Title',
                                    text:
                                        'Description of the bot, what it can do, how it’s work, etc...',
                                    img:
                                        'https://cdn.pixabay.com/photo/2013/11/28/10/03/river-219972_960_720.jpg',
                                },
                                {
                                    title: 'Title',
                                    text:
                                        'Description of the bot, what it can do, how it’s work, etc...',
                                    img:
                                        'https://cdn.pixabay.com/photo/2013/11/28/10/03/river-219972_960_720.jpg',
                                },
                            ]}
                        />
                        */}
                        {pending && (
                            <div className="pending-info">
                                <div className="circle" />
                                <div className="circle" />
                                <div className="circle" />
                            </div>
                        )}
                    </div>
                </SimpleBar>
                <div className="bottom">
                    <div className="round-textfield command-writer">
                        <input
                            type="text"
                            placeholder="Write command"
                            onKeyDown={onKeyDown}
                            onChange={(e) => setCommand(e.target.value)}
                            value={command}
                            autoComplete="on"
                        />
                    </div>

                    <button className="round-btn send-btn" type="button" onClick={enterCommand}>
                        <img src={SendIcon} alt="send" />
                    </button>
                </div>
            </div>
        </Style>
    );
};

export default App;
