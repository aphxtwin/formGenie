// AiResponse.tsx
import Image from 'next/image';
import React from 'react';

interface UserResponseProps {
    content: React.ReactNode;
}

function UserResponse({ content }: UserResponseProps) {
    return (
        <div className='space-y-1'>
            <div className='flex items-center space-x-2'>
                <Image width={50} height={50} className='rounded' alt='user icon' src={'/userImage.png'} />
                <h1 className='font-bold text-xl'>You</h1>
            </div>
            <div className='max-w-prose'>
                {content}
            </div>
        </div>
    );
}

export default UserResponse;