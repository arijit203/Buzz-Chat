import getCurrentUser from "@/app/actions/getCurrentUser"

import { NextResponse } from "next/server"
import prisma from "@/app/libs/prismadb"


export async function POST(
    request:Request  //request is an instance of the Request object provided by the Next.js API routes. This Request object contains information about the HTTP request that was made to your API endpoint. Here are some key aspects of the Request object:
){
    try{
        const currentUser=await getCurrentUser();
        const body=await request.json();
        const {
            message,
            image,
            conversationId
        }=body;

        if(!currentUser?.id || !currentUser?.email){
            return new NextResponse('Unauthorized',{status:401})
        }

        const newMessage=await prisma.message.create({
            data:{
                body:message,
                image:image,
                conversation:{
                    connect:{
                        id:conversationId
                    }
                },
                sender:{
                    connect:{
                        id:currentUser.id
                    }
                },
                seen:{
                    connect:{
                        id:currentUser.id //person who has sent the message and seen the msg immediately
                    }
                }
            },
            include:{
                seen:true,
                sender:true
            }
        })

        //also update the conversation on the basis of the last created msg
        const updatedConversation=await prisma.conversation.update({
            where:{
                id:conversationId
            },
            data:{
                lastMessageAt:new Date(),
                messages:{
                    connect:{
                        id:newMessage.id
                    }
                }
            },
            include:{
                users:true,
                messages:{
                    include:{
                        seen:true
                    }
                }
            }

        })

        return NextResponse.json(newMessage);

    }catch(error:any){
        console.log(error,'ERROR_MESSAGES')
        return new NextResponse('Internal Error',{status:500})
    }

}

