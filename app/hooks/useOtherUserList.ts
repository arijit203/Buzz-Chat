import { useMemo } from "react";
import { User } from "@prisma/client";
import { useSession } from "next-auth/react";
import { FullConversationType } from "../types";

const useOtherUser = (conversations: FullConversationType[]) => {
  const session = useSession();

  const otherUsers = useMemo(() => {
    const currentUserEmail = session.data?.user?.email;

    return conversations.map((conversation) => {
      const otherUser = conversation.users.filter((user) => user.email !== currentUserEmail);
      return {
        ...conversation,
        otherUser: otherUser[0]
      };
    });
  }, [session.data?.user?.email, conversations]);

  return otherUsers;
};

export default useOtherUser;
