'use client'

import useConversation from '@/app/hooks/useConversation'
import axios from 'axios';
import React from 'react'
import { FieldValues, SubmitHandler, useForm } from 'react-hook-form';
import { HiPhoto } from 'react-icons/hi2';
import MessageInput from './MessageInput';
import { HiPaperAirplane } from 'react-icons/hi2';
import {CldUploadButton} from "next-cloudinary"

function Form() {

    const {conversationId}=useConversation();

    const {
        register,handleSubmit,
        setValue,
        formState:{
            errors
        }
    }=useForm<FieldValues>({
        defaultValues:{
            message:''
        }
    })
    const onSubmit: SubmitHandler<FieldValues>=(data)=>{
        
        axios.post('/api/messages',{
            ...data,
            conversationId
        })

        //setValue('message', ''): This sets the value of the message field to an empty string. It's a way to clear the input field after the form has been submitted.
        setValue('message','',{shouldValidate:true})
    }

    const handleUpload=(result:any)=>{
      axios.post('/api/messages',{
        image:result?.info?.secure_url,
        conversationId
      })
    }
  return (
    <div
      className="
        py-4 
        px-4 
        bg-white 
        border-t 
        flex 
        items-center 
        gap-2 
        lg:gap-4 
        w-full
        
      "
    >
        <CldUploadButton 
        options={{maxFiles:1}}
        onSuccess={handleUpload}
        uploadPreset={process.env.NEXT_PUBLIC_CLOUDINARY_PRESET_NAME}
        >
          <HiPhoto size={30} />
        </CldUploadButton>
        
       
        <form onSubmit={handleSubmit(onSubmit)}
            className="flex items-center gap-2 lg:gap-4 w-full"
        >
            <MessageInput
          id="message"
          register={register}
          errors={errors}
          required
          placeholder="Write a message"
        />
             <button
          type="submit"
          className="
            rounded-full 
            p-2 
            bg-black
            cursor-pointer 
            hover:bg-sky-600 
            transition
          "
        >
          <HiPaperAirplane size={18} className="text-white" />
        </button>
        </form>
    </div>
  )
}

export default Form