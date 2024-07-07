'use client'

import React from 'react'
import clsx from "clsx";
import Link from "next/link";

interface MobileItemProps {
  label: string;
  icon: any; // Ideally, you should specify a more precise type for icons, like React.ComponentType or React.ElementType
  href: string;
  onClick?: () => void;
  active?: boolean;
}

const MobileItem = ({
  label,
  icon: Icon,
  href,
  onClick,
  active = false
}: MobileItemProps) => {
  const handleClick = () => {
    if (onClick) {
      return onClick();
    }
  };

//   console.log("Active:", active); // Debugging line to check the value of active

  return (
    <Link
      href={href}
      onClick={handleClick} // Use handleClick instead of onClick to ensure the custom handler is called
      className={clsx(
        `group flex gap-x-3 text-sm leading-6 font-semibold w-full justify-center p-4 text-gray-500 hover:text-black hover:bg-gray-100`,
        active && "bg-gray-100 text-black"
      )}
    >
         <span className={clsx(
        "h-6 w-6", // Base icon size class
        active && "text-black" // Highlight text-black color when active
      )}>
        <Icon className="h-6 w-6"/>
      
      </span>
    </Link>
  );
}

export default MobileItem;