'use client'

import Avatar from '@/app/components/Avatar';
import { FullMessageType } from '@/app/types'
import clsx from 'clsx';
import { useSession } from 'next-auth/react'
// import Image from 'next/image';
import React, { useState } from 'react'
import { format } from "date-fns"
// import ImageModal from './ImageModal';
import ImageModal from '@/app/components/modals/ImageModal';
import ImageComponent from '@/app/components/ImageComponent';



interface MessageBoxProps {
  data: FullMessageType,
  isLast?: boolean,
}

function MessageBox({ data, isLast }: MessageBoxProps) {

  const session = useSession();

  const [imageModalOpen, setImageModalOpen] = useState(false);

  const isOwn = session?.data?.user?.email === data?.sender?.email;
  //to check whether the current session user is same as the one who sent the msg

  const seenList = (data.seen || [])
    .filter((user) => user.email !== data?.sender?.email)
    .map((user) => user.name)
    .join(', ');

  const container = clsx("flex gap-3 p-4", isOwn && "justify-end");
  const avatar = clsx(isOwn && "order-2");
  const body = clsx("flex flex-col gap-2", isOwn && "items-end");
  const message = clsx(
    "text-sm w-fit overflow-hidden",
    isOwn ? "bg-sky-500 text-white" : "bg-gray-100  dark:bg-lightgray",
    data.image ? "rounded-md p-0" : "rounded-full py-2 px-3"
  );

  const handleMediaClick = () => {
    if (isImage) {
      setImageModalOpen(true);
    }
  }

  // Extract the file extension from the URL
  const fileExtension = data.image?.split('.').pop()?.toLowerCase() || '';

  // Determine the type of media based on the file extension
  const isImage = ['jpg', 'jpeg', 'png'].includes(fileExtension);
  const isVideo = ['mp4'].includes(fileExtension);
  const isDocument = ['docx', 'pdf'].includes(fileExtension);

  return (
    <div className={container}>
      <div className={avatar}>
        <Avatar user={data.sender} />
      </div>

      <div className={body}>
        <div className="flex items-center gap-1">
          <div className="text-sm text-gray-500">{data.sender.name}</div>
          <div className="text-xs text-gray-400">{format(new Date(data.createdAt), "p")}</div>
        </div>
        <div className={message}>
          {isImage && data.image && (
            <>
              <ImageModal src={data.image} isOpen={imageModalOpen} onClose={() => setImageModalOpen(false)} />
              <ImageComponent
                alt="Image"
                
               
                src={data.image}
                
              />
            </>
          )}
          {isVideo && data.image && (
            <video controls className="max-w-full max-h-64 rounded-md">
              <source src={data.image} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          )}
          {isDocument && data.image && (
          <div className="border p-4">
            <a
              href={data.image}
              target="_blank"
              rel="noopener noreferrer"
            >
              {fileExtension.toUpperCase()} File: <span className="underline">{data.image.split('/').pop()}</span>
            </a>
          </div>
        )}

          {!isImage && !isVideo && !isDocument && (
            <div>{data.body}</div>
          )}
        </div>
        {isLast && isOwn && seenList.length > 0 && (
          <div
            className="
              text-xs 
              font-light 
              text-gray-500
              "
          >
            {`Seen by ${seenList}`}
          </div>
        )}
      </div>
    </div>
  )
}

export default MessageBox;
