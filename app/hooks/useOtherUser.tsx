import { useMemo } from "react";

import { User } from "@prisma/client";
import { useSession } from "next-auth/react";

import { FullConversationType } from "../types";

const useOtherUser = (conversation: FullConversationType | { users: User[] }) => {
  const session = useSession();

  const otherUser = useMemo(() => {
    const currentUserEmail = session.data?.user?.email;

    const otherUser = conversation.users.filter((user) => user.email !== currentUserEmail);
    // bcoz otherUser is array of users
    return otherUser[0];

  }, [session.data?.user?.email, conversation.users]);

  return otherUser;
};

export default useOtherUser;
