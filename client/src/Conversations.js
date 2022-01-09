import {
  ConversationList,
  Sidebar,
  Search,
  Conversation,
  Avatar,
} from "@chatscope/chat-ui-kit-react";
import icons from "./assets";
import { Component } from "react";

export default class Conversations extends Component {
  constructor(props) {
    super(props);
    this.state = { rooms: [] };
    this.listRoomsURL = "/rooms";
  }
  componentDidMount() {
    this.fetchRooms().then((rooms) => {
      rooms = rooms || [];
      this.setState({ rooms: rooms });
    });
  }
  openRoom = (roomId) => {
    if (this.props.onRoomChange) this.props.onRoomChange(roomId);
  };
  //Rooms should be like [{id:"value"},...]
  async fetchRooms() {
    let response = await fetch(this.listRoomsURL); //Send back a list of objects in json [{id:"abcd"},{id:"bsye"}]
    let json = await response.json();
    if (response.status === 404) return undefined;
    return json;
  }
  render() {
    return (
      <Sidebar position="left" scrollable={false}>
        <Search placeholder="Search..." />
        <ConversationList>
          {this.state.rooms.map((room) => (
            <Conversation
              key={room.id}
              name={room.id}
              active={this.props.roomId === room.id}
              onClick={(e) => {
                this.openRoom(room.id);
              }}
            >
              <Avatar src={icons.group} />
            </Conversation>
          ))}
        </ConversationList>
      </Sidebar>
    );
  }
}
