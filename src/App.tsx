import React from 'react';
import SimpleBar from 'simplebar-react';
import SwipeableViews from 'react-swipeable-views';
import MobileStepper from '@material-ui/core/MobileStepper';
import KeyboardArrowLeft from '@material-ui/icons/KeyboardArrowLeft';
import KeyboardArrowRight from '@material-ui/icons/KeyboardArrowRight';
import { IconButton } from '@material-ui/core';
import SendIcon from './assets/send-icon.png';
import PlusIcon from './assets/plus.png';
import Style from './style';
import 'simplebar/dist/simplebar.min.css';
import useCommand from './hooks/useCommand';
import bots from './commands.json';
import { Bot } from './utils/parseCommand';

interface Message {
    author?: string;
    payload: any;
    type?: string;
}

interface PresentationData {
    title: string;
    img: string;
    text: string;
}

const limitString = (str: string, limit: number) =>
    str.length > limit ? `${str.substring(0, limit)}...` : str;

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
const decodeHtml = (html: string) => {
    const txt = document.createElement('textarea');
    txt.innerHTML = html;
    return txt.value;
};

const PresentationMessage: React.FC<PresentationData> = ({ title, img, text }) => (
    <div className="message presentation">
        {/* <div className="img" style={{ backgroundImage: `url(${img})` }} /> */}
        <img alt={title} src={img} />
        <div className="description">
            {title && <p className="title">{decodeHtml(title)}</p>}
            {text && <p className="text">{limitString(decodeHtml(text), 30)}</p>}
        </div>
    </div>
);

const MultiplePresantation: React.FC<{ data: PresentationData[] }> = ({ data }) => {
    const [activeStep, setActiveStep] = React.useState(0);

    const handleNext = () => {
        setActiveStep((prevActiveStep) => prevActiveStep + 1);
    };

    const handleBack = () => {
        setActiveStep((prevActiveStep) => prevActiveStep - 1);
    };

    const handleStepChange = (step: number) => {
        setActiveStep(step);
    };
    return (
        <div className="message presentation">
            {/* <div className="img" style={{ backgroundImage: `url(${img})` }} /> */}
            <SwipeableViews enableMouseEvents index={activeStep} onChangeIndex={handleStepChange}>
                {data.map(({ title, img, text }) => (
                    <div style={{ width: '100%' }}>
                        <img alt={title} src={img} />
                        <div className="description">
                            {title && <p className="title">{decodeHtml(title)}</p>}
                            {text && <p className="text">{limitString(decodeHtml(text), 30)}</p>}
                        </div>
                    </div>
                ))}
            </SwipeableViews>
            <MobileStepper
                steps={data.length}
                position="static"
                variant="text"
                activeStep={activeStep}
                nextButton={
                    <IconButton
                        size="small"
                        onClick={handleNext}
                        disabled={activeStep === data.length - 1}
                    >
                        <KeyboardArrowRight />
                    </IconButton>
                }
                backButton={
                    <IconButton size="small" onClick={handleBack} disabled={activeStep === 0}>
                        <KeyboardArrowLeft />
                    </IconButton>
                }
            />
        </div>
    );
};

const BotElement: React.FC<{ name: string; description: string; icon: string }> = ({
    name,
    description,
    icon,
}) => (
    <div className="bot">
        <div className="icon" style={{ backgroundImage: `url(${icon})` }} />
        <div className="description">
            <div className="name">{name}</div>
            <p className="text">{description}</p>
        </div>
    </div>
);

const App: React.FC = () => {
    const [messageList, setMessageList] = React.useState<Message[]>([
        { author: 'me', payload: 'test' },
        { author: 'receiver', payload: 'Test receiver' },
        { author: 'me', payload: 'test' },
        { author: 'receiver', payload: 'Test receiver' },
        { author: 'me', payload: 'test' },
        { author: 'receiver', payload: 'Test receiver' },
        { author: 'me', payload: 'test' },
        { author: 'receiver', payload: 'Test receiver' },
        { author: 'me', payload: 'test' },
        { author: 'receiver', payload: 'Test receiver' },
        { author: 'me', payload: 'test' },
        { author: 'receiver', payload: 'Test receiver' },
        { author: 'me', payload: 'test' },
        { author: 'receiver', payload: 'Test receiver' },
        { author: 'me', payload: 'test' },
        { author: 'receiver', payload: 'Test receiver' },
        { author: 'me', payload: 'test' },
        { author: 'receiver', payload: 'Test receiver' },
    ]);
    const [responseWriting, setResponseWriting] = React.useState(false);
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const [response, handleCommand] = useCommand(bots as Bot[]);
    const [pending, setPending] = React.useState(false);
    const [newMessage, setNewMessage] = React.useState(false);
    const [command, setCommand] = React.useState('');
    const discussionSection = React.useRef<HTMLDivElement>(null);
    const container = React.useRef<HTMLDivElement>(null);
    const scrollbarWrapper = React.useRef<HTMLDivElement>(null);

    React.useEffect(() => {
        if (scrollbarWrapper.current) scrollbarWrapper.current.scrollTop = 10000;
        const message = messageList[messageList.length - 1];
        if (message.author === 'me' && newMessage) {
            handleCommand(message.payload);
            setPending(true);
            setNewMessage(false);
        }
    }, [messageList, handleCommand, newMessage]);

    React.useEffect(() => {
        if (discussionSection.current && scrollbarWrapper.current)
            discussionSection.current.style.height = `${scrollbarWrapper.current.offsetHeight}px`;
    }, [discussionSection]);

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
                                    return <MultiplePresantation data={payload} />;
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
