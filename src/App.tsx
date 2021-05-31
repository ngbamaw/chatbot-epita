import React from 'react';
import SimpleBar from 'simplebar-react';
import SendIcon from './assets/send-icon.png';
import PlusIcon from './assets/plus.png';
import Style from './style';
import 'simplebar/dist/simplebar.min.css';
import useCommand from './hooks/useCommand';
import bots from './commands.json';
import { Bot } from './utils/parseCommand';

interface Message {
    author?: string;
    text: string;
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

const BotElement: React.FC<{ name: string; description: string }> = ({ name, description }) => (
    <div className="bot">
        <div className="icon" />
        <div className="description">
            <div className="name">{name}</div>
            <p className="text">{description}</p>
        </div>
    </div>
);

const App: React.FC = () => {
    const [messageList, setMessageList] = React.useState<Message[]>([
        { author: 'me', text: 'test' },
        { author: 'receiver', text: 'Test receiver' },
    ]);
    const [responseWriting, setResponseWriting] = React.useState<boolean>(false);
    const [response, handleCommand] = useCommand(bots as Bot[]);
    const [command, setCommand] = React.useState<string>('');
    const discussionSection = React.useRef<HTMLDivElement>(null);
    const container = React.useRef<HTMLDivElement>(null);
    const scrollbarWrapper = React.useRef<HTMLDivElement>(null);

    React.useEffect(() => {
        if (scrollbarWrapper.current) scrollbarWrapper.current.scrollTop = 5000;
    }, [messageList]);

    React.useEffect(() => {
        if (discussionSection.current && scrollbarWrapper.current)
            discussionSection.current.style.height = `${scrollbarWrapper.current.offsetHeight}px`;
    }, [discussionSection]);

    const enterCommand = () => {
        if (command) {
            setMessageList([...messageList, { author: 'me', text: command }]);
            setCommand('');
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
                    <BotElement
                        name="Bot's name"
                        description="Description of the bot, what it can do, how it’s work, etc..."
                    />
                </SimpleBar>
            </div>
            <div className="main-content">
                <SimpleBar
                    className="scrollbar-discussion"
                    scrollableNodeProps={{ ref: scrollbarWrapper }}
                >
                    <div className="discussion-section" ref={discussionSection}>
                        {messageList.map(({ author, text }) => {
                            return author === 'me' ? (
                                <MeMessage>{text}</MeMessage>
                            ) : (
                                <ReceiverMessage>{text}</ReceiverMessage>
                            );
                        })}
                        {responseWriting && (
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
