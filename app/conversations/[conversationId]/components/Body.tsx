'use client'

import useConversation from '@/app/hooks/useConversation';
import { FullMessageType } from '@/app/types'
import React, { useEffect, useRef, useState } from 'react'
import MessageBox from './MessageBox';
import axios from 'axios';
import { pusherClient } from '@/app/libs/pusher';
import { find } from 'lodash';

interface BodyProps {
  initialMessages: FullMessageType[]
}

export default function Body({ initialMessages }: BodyProps) {

  const [messages, setMessages] = useState(initialMessages);

  const bottomRef = useRef<HTMLDivElement>(null);

  const { conversationId } = useConversation();

  // Ensure messages are marked as seen when the conversationId changes
  useEffect(() => {
    axios.post(`/api/conversations/${conversationId}/seen`)
  }, [conversationId]);

  // Handle new and updated messages
  useEffect(() => {
    pusherClient.subscribe(conversationId);

    const scrollToBottom = () => {
      bottomRef?.current?.scrollIntoView({ behavior: 'smooth' });
    }

    scrollToBottom();

    const messageHandler = (message: FullMessageType) => {
      axios.post(`/api/conversations/${conversationId}/seen`);
      setMessages((current) => {
        if (find(current, { id: message.id })) {
          return current; // Prevent duplication
        }
        return [...current, message];
      });
      scrollToBottom();
    }

    const updateMessageHandler = (newMessage: FullMessageType) => {
      setMessages((current) =>
        current.map((currentMessage) => {
          if (currentMessage.id === newMessage.id) {
            return newMessage;
          }
          return currentMessage;
        })
      );
    };

    pusherClient.bind('messages:new', messageHandler);
    pusherClient.bind('message:update', updateMessageHandler);

    return () => {
      pusherClient.unsubscribe(conversationId);
      pusherClient.unbind('messages:new', messageHandler);
      pusherClient.unbind('message:update', updateMessageHandler);
    }
  }, [conversationId]);

  // Ensure the component always scrolls to the bottom when messages change
  useEffect(() => {
    bottomRef?.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className="flex-1 overflow-y-auto">
      {messages.map((message, i) => (
        <MessageBox isLast={i === messages.length - 1} 
        key={message.id} 
        data={message} />
      ))}
      <div className="pt-1" ref={bottomRef} />
    </div>
  )
}
