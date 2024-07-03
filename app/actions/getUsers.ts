import React from 'react'
import prisma from "@/app/libs/prismadb"
import getSession from './getSession'


async function getUsers() {
    const session=await getSession();

    if(!session?.user?.email){
        return [];
    }
    try{
        const users=await prisma.user.findMany({
            orderBy:{
                createdAt:'desc' //such that newest users are at the top
            },
            where:{
                NOT:{
                    email: session.user.email //excluding the current user
                }
            }

        })
        return users;
    }catch(error:any){
        return [];
    }
}

export default getUsers