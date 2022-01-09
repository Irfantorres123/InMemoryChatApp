import React, { Component } from "react";
import {
  ChatContainer,
  MessageList,
  Message,
  MessageInput,
  ConversationHeader,
  Avatar,
  EllipsisButton,
  VoiceCallButton,
  VideoCallButton,
} from "@chatscope/chat-ui-kit-react";
import "@chatscope/chat-ui-kit-styles/dist/default/styles.min.css";
import icons from "./assets";
export default class ChatBox extends Component {
  constructor(props) {
    super(props);
    this.inputRef = React.createRef();
  }

  addStyling = (message) => {
    return {
      position: "left",
      type: "text",
      text: message.content,
      date: message.date,
    };
  };

  convertToContext(messages) {
    if (!messages) return [];
    return messages.map((message) => {
      return this.addStyling(message);
    });
  }
  getTimeFromISOString(date) {
    return date.split("T")[1];
  }
  getTime(date) {
    return this.getTimeFromISOString(date.toISOString());
  }

  sendMessage = async (innerHTML, textContent, innerText, nodes) => {
    this.props.onMessage(this.props.roomId, textContent);
  };

  componentDidUpdate = () => {
    if (this.inputRef.current) this.inputRef.current.focus();
  };

  render() {
    if (this.props.roomId)
      return (
        <ChatContainer>
          <ConversationHeader>
            <ConversationHeader.Back />
            <Avatar src={icons.group} name={this.props.roomId} />
            <ConversationHeader.Content userName={this.props.roomId} />
            <ConversationHeader.Actions>
              <VoiceCallButton />
              <VideoCallButton />
              <EllipsisButton orientation="vertical" />
            </ConversationHeader.Actions>
          </ConversationHeader>
          <MessageList>
            {this.convertToContext(this.props.messages).map(
              (message, index) => (
                <Message
                  key={index}
                  model={{
                    message: message.text,
                    sentTime: this.getTimeFromISOString(message.date),
                  }}
                />
              )
            )}
          </MessageList>
          <MessageInput
            placeholder="Type message here"
            onSend={this.sendMessage}
            autoFocus
            ref={this.inputRef}
          />
        </ChatContainer>
      );
    return (
      <div className="no-room-selected">
        &#60; - - Select a room to chat with people
      </div>
    );
  }
}
