// getServerSession Function:

// This function is imported from next-auth. It is a utility provided by NextAuth.js to retrieve the session details of the current authenticated user from the server-side.
// It typically takes an authOptions object as an argument, which specifies the configuration for your authentication setup, including authentication providers, callbacks, etc.

import { getServerSession } from "next-auth";

import { authOptions } from "../api/auth/[...nextauth]/route";

export default async function getSession(){
    return await getServerSession(authOptions);
}