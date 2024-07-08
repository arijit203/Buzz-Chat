'use client';

import useConversation from "@/app/hooks/useConversation";
import { User } from "@prisma/client";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import clsx from "clsx";
import { MdOutlineGroupAdd } from "react-icons/md";
import ConversationBox from "./ConversationBox";
import { FullConversationType } from "@/app/types";
import GroupChatModal from "./GroupChatModal";
import { useSession } from "next-auth/react";
import { pusherClient } from "@/app/libs/pusher";
import { find } from "lodash";
import Search from "@/app/components/Search";
import useOtherUserList from "@/app/hooks/useOtherUserList";

interface ConversationListProps {
  initialItems: FullConversationType[];
  users: User[];
}

const ConversationList = ({ initialItems, users }: ConversationListProps) => {
  const [items, setItems] = useState(initialItems); // initialItems contains the set of conversations
  const [filteredItems, setFilteredItems] = useState(initialItems); // Filtered items
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState(""); // Search query state

  const router = useRouter();
  const { conversationId, isOpen } = useConversation();
  const session = useSession();

  const pusherKey = useMemo(() => {
    return session.data?.user?.email;
  }, [session.data?.user?.email]);

  useEffect(() => {
    if (!pusherKey) {
      return;
    }

    pusherClient.subscribe(pusherKey);

    const updateHandler = (conversation: FullConversationType) => {
      // console.log("Update handler called with conversation:", conversation);
      setItems((current) =>
        current.map((currentConversation) => {
          if (currentConversation.id === conversation.id) {
            return {
              ...currentConversation,
              messages: conversation.messages,
            };
          }
          return currentConversation;
        })
      );
    };

    const newHandler = (conversation: FullConversationType) => {
      // console.log("New handler called with conversation:", conversation);
      setItems((current) => {
        // skip if the conversation already exists
        if (find(current, { id: conversation.id })) {
          return current;
        }
        return [conversation, ...current];
      });
    };

    const removeHandler = (conversation: FullConversationType) => {
      // console.log("Remove handler called with conversation:", conversation);
      setItems((current) => {
        return current.filter((convo) => convo.id !== conversation.id);
      });

      if (conversationId == conversation.id) {
        router.push("/conversations");
      }
    };

    pusherClient.bind('conversation:new', newHandler);
    pusherClient.bind('conversation:update', updateHandler);
    pusherClient.bind('conversation:delete', removeHandler);

    return () => {
      pusherClient.unsubscribe(pusherKey);
      pusherClient.unbind('conversation:update', updateHandler);
      pusherClient.unbind('conversation:new', newHandler);
      pusherClient.unbind('conversation:delete', removeHandler);
    };
  }, [conversationId, pusherKey, router]);

  // Filter conversations based on search query
  const conversationsWithOtherUsers = useOtherUserList(items);
  useEffect(() => {
    const filtered = conversationsWithOtherUsers.filter((item) => {
      const name = item.isGroup ? item.name : item.otherUser?.name;
      return name?.toLowerCase().includes(searchQuery.toLowerCase());
    });
    setFilteredItems(filtered);
  }, [searchQuery, items, conversationsWithOtherUsers]);

  return (
    <>
      <GroupChatModal users={users} isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />

      <aside
        className={clsx(
          `
          fixed 
          inset-y-0 
          pb-20
          lg:pb-0
          lg:left-20 
          lg:w-80 
          lg:block
          overflow-y-auto 
          border-r 
          border-gray-200 
        `,
          isOpen ? "hidden" : "block w-full left-0"
        )}
      >
        <div className="px-5">
          <div className="flex justify-between mb-4 pt-4">
            <div className="text-2xl font-bold text-neutral-800 ">Messages</div>
            <div
              className="
                rounded-full 
                p-2 
                bg-gray-100 
                text-gray-600 
                cursor-pointer 
                hover:opacity-75 
                transition                
              "
              onClick={() => setIsModalOpen(true)}
            >
              <MdOutlineGroupAdd size={20} />
            </div>
          </div>
          <Search searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
          {filteredItems.map((item) => (
            <ConversationBox key={item.id} data={item} selected={conversationId === item.id} />
          ))}
        </div>
      </aside>
    </>
  );
};

export default ConversationList;
