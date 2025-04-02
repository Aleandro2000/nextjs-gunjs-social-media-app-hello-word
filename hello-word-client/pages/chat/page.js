import React from "react";
import withAuth from "../../src/HOCs/withAuth";
import ChatPage from "../../src/components/Chatpage/ChatPage";

function Chat() {
  return <ChatPage />;
}

export default withAuth(Chat);
