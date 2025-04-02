import React, { useContext, useEffect, useMemo, useState } from "react";
import { AuthenticationContext } from "../../contexts/AuthenticationContext";
import { useAnalyticsFunctions } from "../../utils/analyticsFunctions";
import FilterBar from "./components/FilterBar";
import NewChatForm from "./components/NewChatForm";
import Chat from "./components/Chat";
import { profanity } from "@2toad/profanity";
import { logger, displayToast } from "../../utils";
import { isEnglish } from "../../utils/langDetect";

const ChatPage = () => {
  const [chats, setchats] = useState({});
  const [filter, setFilter] = useState({ type: "all", query: "" });
  const { authentication, gun } = useContext(AuthenticationContext);
  const { recordNewChat } = useAnalyticsFunctions();

  useEffect(() => {
    if (!gun) return;

    const chatsRef = gun.get("chats");
    chatsRef.map().on((chat, id) => {
      if (chat) {
        setchats((prevchats) => ({
          ...prevchats,
          [id]: { ...chat, id, comments: {} },
        }));

        gun
          .get("chats_comments")
          .get(id)
          .map()
          .on((comment, commentId) => {
            if (comment) {
              setchats((prevchats) => ({
                ...prevchats,
                [id]: {
                  ...prevchats[id],
                  comments: {
                    ...prevchats[id].comments,
                    [commentId]: comment,
                  },
                },
              }));
            }
          });
      } else {
        setchats((prevchats) => {
          const newchats = { ...prevchats };
          delete newchats[id];
          return newchats;
        });
      }
    });

    return () => {
      chatsRef.off();
      gun.get("chats_comments").off();
    };
  }, [gun]);

  const addchat = async (newchat) => {
    try {
      if (!isEnglish(newchat.content)) {
        displayToast(
          "We may support only english langauge at this moment!",
          false
        );
        return;
      }
      if (profanity.exists(newchat.content)) {
        displayToast("Ooops! The chat may violate general ethics!", false);
        return;
      }
      if (!authentication || !authentication.username) {
        logger("Username not available");
        return;
      }
      const id = Gun.text.random();
      const chatData = {
        content: newchat.content,
        createdAt: Date.now(),
        author: newchat.isAnonymous ? "Anonymous" : authentication.username,
        points: 0,
        image: newchat.image ? URL.createObjectURL(newchat.image) : null,
        scheduleDate: newchat.scheduleDate,
      };
      gun.get("chats").get(id).put(chatData);
      recordNewChat(authentication.username, id, newchat.content);

      setchats((prevchats) => ({
        [id]: { ...chatData, id, comments: {} },
        ...prevchats,
      }));
    } catch (err) {
      displayToast("ERROR! Something is wrong!", false);
      logger(err);
    }
  };

  const handleVote = (chatId, voteType) => {
    console.log(`Vote ${voteType} for chat ${chatId}`);
  };

  const handleFilterChange = (filterType, searchQuery = "") => {
    setFilter({ type: filterType, query: searchQuery });
  };

  const filteredchats = useMemo(() => {
    let result = Object.values(chats);

    result.sort((a, b) => b.createdAt - a.createdAt);

    switch (filter.type) {
    case "my":
      result = result.filter(
        (chat) => chat.author === authentication.username
      );
      break;
    case "search":
      if (filter.query) {
        const lowercaseQuery = filter?.query?.toLowerCase();
        result = result.filter(
          (chat) =>
            chat?.content?.toLowerCase().includes(lowercaseQuery) ||
              chat?.author?.toLowerCase().includes(lowercaseQuery)
        );
      }
      break;
    default:
      break;
    }

    return result;
  }, [chats, filter, authentication.username]);

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">General Chat</h1>
      {authentication.username && <NewChatForm onAddchat={addchat} />}
      <FilterBar
        onFilterChange={handleFilterChange}
        activeFilter={filter.type}
      />
      {filteredchats.map((chat) => (
        <Chat key={chat.id} chat={chat} onVote={handleVote} />
      ))}
    </div>
  );
};

export default ChatPage;
