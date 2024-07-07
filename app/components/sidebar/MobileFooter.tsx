'use client'

import React, { useState } from 'react';
import useRoutes from '../../hooks/useRoutes';
import useConversation from '../../hooks/useConversation';
import MobileItem from './MobileItem';
import MobileLink from './MobileLink';
import Avatar from '../Avatar';
import { User } from '@prisma/client';
import SettingsModal from './SettingsModal';

function MobileFooter({ currentUser }:{currentUser:User}) {

    const routes = useRoutes();
    const { isOpen } = useConversation();
    const [open, setOpen] = useState(false);

    if (isOpen) return null;

    return (
        <>
            <SettingsModal currentUser={currentUser} isOpen={open} onClose={() => setOpen(false)} />
            <div className='
                fixed
                justify-between
                w-full
                bottom-0
                z-40
                flex
                items-center
                bg-white
                border-t-[1px]
                lg:hidden'
            >
                {
                    routes.map((item) => (
                        <MobileItem
                            key={item.label}
                            href={item.href}
                            label={item.label}
                            icon={item.icon}
                            active={item.active}
                            onClick={item.onClick}
                        />
                    ))
                }
                <MobileLink>
                    <div onClick={() => setOpen(true)} className="cursor-pointer hover:opacity-75 transition">
                        <Avatar user={currentUser} />
                    </div>
                </MobileLink>
            </div>
        </>
    );
}

export default MobileFooter;
