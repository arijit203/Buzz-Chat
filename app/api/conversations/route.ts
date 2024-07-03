import getCurrentUser from "@/app/actions/getCurrentUser";

import { NextResponse } from "next/server";

import prisma from '@/app/libs/prismadb'

export async function POST(
    request: Request
){
    try{
        const currentUser=await getCurrentUser();
        const body=await request.json();

        const {
            userId,
            isGroup,
            members,
            name
        }=body;

        if(!currentUser?.id || !currentUser?.email){
            return new NextResponse('Unauthorized',{status:401});

        }

        if(isGroup && (!members || members.lenght<2 || !name)){
            return new NextResponse('Invalid Data',{status:400});
        }

        if(isGroup){
            const newConversation=await prisma.conversation.create({
                data:{
                    name,
                    isGroup,
                    users:{
                        connect:[
                            ...members.map((member:{value:String})=>({
                                id:member.value
                            })),
                            {
                                id:currentUser.id
                            }
                        ]
                    }
                },
                include:{
                    users:true   
                }
                // include: This keyword in Prisma allows you to include related records in the response.
                // users: true: This indicates that the response should include the related users for the new conversation.
            });

            return NextResponse.json(newConversation)
        }

        //for single chat we have to check whether the chat with respective person already exists or not 
        const existingConversations=await prisma.conversation.findMany({
            where:{
                OR:[
                {
                    userIds:{
                        equals:[currentUser.id,userId]
                    }
                },
                {
                    userIds:{
                        equals:[userId,currentUser.id]
                    }
                }
                ]
            }
        }) 

        const singleConversation=existingConversations[0];

        if(singleConversation){
            return NextResponse.json(singleConversation);
        }

        const newConversation=await prisma.conversation.create({
            data:{
                users:{
                    connect:[
                        {
                            id:currentUser.id
                        },
                        {
                            id:userId
                        }
                    ]
                }
            },
            include:{
                users:true
            }
        })
        return NextResponse.json(newConversation)
    }
    catch(error:any){
        return new NextResponse('Internal Error',{status:500});

    }

}