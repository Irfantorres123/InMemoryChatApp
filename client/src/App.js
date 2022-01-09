import React, { Component } from "react";
import "./App.css";
import ChatBox from "./ChatBox";
import { MainContainer } from "@chatscope/chat-ui-kit-react";
import "@chatscope/chat-ui-kit-styles/dist/default/styles.min.css";
import Conversations from "./Conversations";
class App extends Component {
  constructor(props) {
    super(props);
    this.state = { roomId: undefined, messages: {}, ws: undefined };
  }

  onRoomChange = (roomId) => {
    this.setState({ roomId: roomId });
  };

  addMessage = (newMessage, roomId) => {
    this.setState((prevState) => {
      let messages = Object.assign({}, prevState.messages);
      if (messages[roomId]) {
        messages[roomId] = [...messages[roomId], newMessage];
      } else {
        messages[roomId] = [newMessage];
      }
      return { messages };
    });
  };

  onMessage = (roomId, messageContent) => {
    this.sendMessage({ content: messageContent, roomId: roomId }, "addMessage");
  };

  sendMessage = (data, type) => {
    if (!this.state.ws || this.state.ws.readyState !== this.state.ws.OPEN)
      return undefined;
    this.state.ws.send(
      JSON.stringify({
        ...data,
        type: type,
      })
    );
  };

  componentDidMount = () => {
    let ws = new WebSocket(`ws://localhost:5000/ws/`);

    ws.onopen = () => {
      console.log("Connection opened");
      this.sendMessage({}, "getMessages");
    };

    ws.onmessage = (event) => {
      if (!event.data) return;
      let data = JSON.parse(event.data);
      if (data.type === "addMessage") {
        this.addMessage(data.message, data.roomId);
      } else if (data.type === "getMessages") {
        this.setState({ messages: data.history });
      }
    };

    ws.onclose = () => {
      console.log("Connection closed");
    };

    ws.onerror = (event) => {
      console.warn(event);
    };

    this.setState({ ws: ws });
  };

  render() {
    return (
      <div
        style={{
          height: "100vh",
          position: "relative",
        }}
      >
        <MainContainer responsive>
          <Conversations
            onRoomChange={this.onRoomChange}
            roomId={this.state.roomId}
          />
          <ChatBox
            roomId={this.state.roomId}
            messages={this.state.messages[this.state.roomId]}
            onMessage={this.onMessage}
          />
        </MainContainer>
      </div>
    );
  }
}
export default App;
