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
    text: string;
}

interface PresentationData {
    title: string;
    img: string;
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

const PresentationMessage: React.FC<PresentationData> = ({ title, img, text }) => (
    <div className="message presentation">
        {/* <div className="img" style={{ backgroundImage: `url(${img})` }} /> */}
        <img alt={title} src={img} />
        <div className="description">
            {title && <p className="title">{title}</p>}
            {text && <p className="text">{text}</p>}
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
                    <div>
                        <img alt={title} src={img} />
                        <div className="description">
                            {title && <p className="title">{title}</p>}
                            {text && <p className="text">{text}</p>}
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
        { author: 'me', text: 'test' },
        { author: 'receiver', text: 'Test receiver' },
        { author: 'me', text: 'test' },
        { author: 'receiver', text: 'Test receiver' },
        { author: 'me', text: 'test' },
        { author: 'receiver', text: 'Test receiver' },
        { author: 'me', text: 'test' },
        { author: 'receiver', text: 'Test receiver' },
        { author: 'me', text: 'test' },
        { author: 'receiver', text: 'Test receiver' },
        { author: 'me', text: 'test' },
        { author: 'receiver', text: 'Test receiver' },
        { author: 'me', text: 'test' },
        { author: 'receiver', text: 'Test receiver' },
        { author: 'me', text: 'test' },
        { author: 'receiver', text: 'Test receiver' },
    ]);
    const [responseWriting, setResponseWriting] = React.useState(false);
    const [response, handleCommand] = useCommand(bots as Bot[]);
    const [command, setCommand] = React.useState('');
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
                            if (author === 'me') return <MeMessage>{text}</MeMessage>;
                            return <ReceiverMessage>{text}</ReceiverMessage>;
                        })}
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
