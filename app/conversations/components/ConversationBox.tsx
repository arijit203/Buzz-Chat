"use client";

import React from 'react'
import clsx from "clsx";
import { useCallback, useMemo } from "react";

import { format } from "date-fns";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Conversation } from '@prisma/client';
import useOtherUser from '@/app/hooks/useOtherUser';
import { FullConversationType } from '@/app/types';
import Avatar from '@/app/components/Avatar';

interface ConversationBoxProps{
    data:FullConversationType,
    selected?:Boolean
}

function ConversationBox({data,selected}:ConversationBoxProps) {
    const otherUser=useOtherUser(data);
    const session=useSession();
    const router=useRouter();

    const handleClick = useCallback(() => {
        router.push(`/conversations/${data.id}`);
      }, [data, router]);

    const lastMessage = useMemo(() => {
    const messages = data.messages || [];

    return messages[messages.length - 1]; //last message
    }, [data.messages]);

    const userEmail=useMemo(()=>{
        return session.data?.user?.email
    },[session.data?.user?.email])


    const hasSeen = useMemo(() => { //hasSeen is to determine whether the current user has seen the last message in the conversation.
        if (!lastMessage) {   //no messages
          return false;
        }
        const seenArray=lastMessage.seen || [];

        if(!userEmail){
            return false;
        }

        return seenArray.filter((user) => user.email === userEmail).length !== 0;
    },[userEmail,lastMessage])
    

    const lastMessageText=useMemo(()=>{  //to check if last message is a text
        if(lastMessage?.image){
            return 'Sent an Image'
        }

        if(lastMessage?.body){
            return lastMessage.body;
        }

        return "Started a conversation"
    },[lastMessage])
    return (
    
    <div onClick={handleClick}
        className={clsx(
            `
            w-full 
            relative 
            flex 
            items-center 
            space-x-3 
            p-3 
            hover:bg-neutral-100
            rounded-lg
            transition
            cursor-pointer
            `,
            selected ? "bg-neutral-100" :"bg-white"
          )}
    >
        <Avatar user={otherUser} />
        <div className='min-w-0 flex-1'>
          <div className="focus:outline-none">
                <div 
                className='flex justify-between items-center mb-1'>
                    <p
                     className='text-md
                     font-medium
                     text-gray-900'>
                        {data.name || otherUser.name}
                    </p>
                    {lastMessage?.createdAt && (
                        <p  className="
                        text-xs 
                        text-gray-400 
                        font-light
                      ">
                            {format(new Date(lastMessage.createdAt),'p')}
                        </p>
                    )}
                </div>
                <p
                    className={clsx(
                    `
                    truncate 
                    text-sm
                    `,
                    hasSeen
                        ? "text-gray-500" :"text-black font-medium"
                    
                    )}
                >
                    {lastMessageText}
                </p>
          </div>
        </div>
    </div>
  )
}

export default ConversationBox