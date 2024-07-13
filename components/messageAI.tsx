// AiResponse.tsx
import Image from 'next/image';
import React from 'react';

interface AiResponseProps {
    content: React.ReactNode;
}

function AiResponse({ content }: AiResponseProps) {
    return (
        <div className='space-y-1'>
            <div className='flex items-center space-x-2'>
                <Image width={50} height={50} className='rounded' alt='ai icon' src={'/aisvg.svg'} />
                <h1 className='font-bold text-xl'>FormGenie</h1>
            </div>
            <div className='max-w-prose'>
                {content}
            </div>
        </div>
    );
}

export default AiResponse;