import styled, { css } from 'styled-components';

function createCSS() {
    let styles = '';

    for (let i = 1; i <= 3; i++) {
        styles += `
         .circle:nth-of-type(${i}) {
           animation: animate-circle 500ms infinite alternate;
           animation-delay: ${i * 0.2}s;
         }
       `;
    }

    return css`
        ${styles}
    `;
}

const App = styled.div`
    height: 100vh;
    width: 100vw;
    display: flex;
    flex-wrap: wrap;
    font-family: 'Roboto', sans-serif;
    * {
        box-sizing: border-box;
        margin: 0;
        padding: 0;
    }
    .header-app {
        width: 100%;
        height: 10%;
        box-shadow: rgba(0, 0, 0, 0.25) 0 5px 20px;
        margin-bottom: 24px;
    }
    .round-textfield {
        background-color: #e9e9e9;
        height: 100%;
        border: none;
        border-radius: 50px;
        display: flex;
        input {
            margin: auto 24px;
            width: 100%;
            background-color: #e9e9e9;
            border: none;
            padding: 0;
            font-size: 18px;
            &:focus {
                outline: none;
                border: none;
            }
            &::placeholder {
                font-weight: bold;
                font-size: large;
            }
        }
    }
    .round-btn {
        height: 50px;
        width: 50px;
        border-radius: 50%;
        border: none;
        background-color: #2196f3;
        display: flex;
        align-self: flex-end;
        margin-left: auto;
        margin-right: 15px;
        outline: none;
        img {
            height: 55%;
            width: 55%;
            margin: auto;
        }
    }
    .bots-list {
        width: 20%;
        height: calc(90% - 24px);
        display: flex;
        flex-direction: column;
        .header-bot-list {
            display: flex;
            height: 50px;
            margin-left: 24px;
            .search-bot {
                flex: 1;
                height: 50px;
            }
            .add-btn {
                background-color: #e9e9e9;
                margin-right: 24px;
            }
        }
        .bot {
            display: flex;
            margin-left: 24px;
            margin-top: 24px;
            &:last-of-type {
                margin-bottom: 24px;
            }
            .icon {
                height: 100px;
                width: 100px;
                border-radius: 50%;
                background-size: 70%;
                background-repeat: no-repeat;
                background-position-x: center;
                background-position-y: center;
                margin-right: 18px;
                box-shadow: #cccccc 0 0 14px 0px;
            }
            .description {
                width: 60%;
                overflow: hidden;
                margin: auto 0;
                .name {
                    margin-bottom: 12px;
                    font-weight: bold;
                    font-size: x-large;
                }
            }
        }

        .scrollbar {
            flex: 1 1 auto;
            height: 0px;
            overflow: auto;
        }
    }
    .main-content {
        width: calc(80% - 24px);
        height: calc(90% - 24px);
        margin-left: 24px;
        display: flex;
        flex-direction: column;
        .discussion-section {
            display: flex;
            /* justify-content: flex-end; */
            flex-direction: column;
            flex-wrap: nowrap;
            position: relative;
            width: 100%;
        }
        .scrollbar-discussion {
            flex: 1;
            height: 100px;
            overflow: auto;
            margin-bottom: 24px;
        }
        .bottom {
            display: flex;
            height: 50px;
            margin-bottom: 24px;
            .command-writer {
                margin-right: 24px;
                flex: 1;
            }
            .send-btn {
                img {
                    transform: translateX(2px);
                }
            }
        }
    }
    .message {
        padding: 10px 15px;
        width: fit-content;
        border-radius: 20px;
        max-width: 70%;
        font-size: 18px;
        flex-shrink: 0;
    }
    .message:first-of-type {
        margin-top: auto;
    }
    .message:last-of-type {
        margin-bottom: 5px;
    }
    .me {
        background-color: #2196f3;
        color: white;
        align-self: flex-end;
        margin-right: 10px;
        margin-bottom: 10px;
    }
    .receiver {
        background-color: #e0e0e0;
        align-self: auto;
        margin-left: 10px;
        margin-bottom: 10px;
    }
    .presentation {
        padding: 0;
        overflow: hidden;
        background-color: #e0e0e0;
        align-self: auto;
        margin-left: 10px;
        margin-bottom: 10px;
        width: 500px;
        min-height: 50px;
        .img {
            background-size: cover;
            height: 200px;
        }
        img {
            width: 100%;
        }
        .description {
            padding: 20px;
            width: fit-content;
            .title {
                font-weight: bold;
                font-size: 20px;
                margin-bottom: 10px;
                width: fit-content;
            }
            .text {
                font-size: 14px;
                width: fit-content;
            }
        }
    }
    .pending-info {
        /*
        position: absolute;
        right: 10px;
        bottom: 0;
        */
        margin-right: 10px;
        margin-bottom: 10px;
        align-self: flex-end;
        font-weight: bold;
        font-size: 12px;
        background-color: #e0e0e0;
        padding: 15px 15px;
        display: flex;
        border-radius: 40px;
        .circle {
            height: 10px;
            width: 10px;
            background-color: #424242;
            border-radius: 50%;
            margin: 0 5px;
        }
        ${createCSS()}
    }

    @keyframes animate-circle {
        from {
            opacity: 1;
        }
        to {
            opacity: 0.3;
        }
    }
`;

export default App;
