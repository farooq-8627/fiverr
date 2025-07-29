import type * as Party from "partykit/server";
import ChatRoomServer from "./chatRoom";
import ChatRoomsServer from "./chatRooms";

// Export the main chat room server as the default
export default ChatRoomServer;

// Export the chat rooms management server
export const chatrooms = ChatRoomsServer;
