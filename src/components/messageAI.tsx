// AiResponse.tsx
import Image from 'next/image';
import React from 'react';
import { chatRowBaseStyle, chatImageStyle, chatHeaderStyle, chatTextStyle } from '@/lib/commonStyles';

interface AiResponseProps {
    content: React.ReactNode;
}

function AiResponse({ content }: AiResponseProps) {
    return (
        <div className={`${chatRowBaseStyle}`}>
            <div className={`${chatImageStyle}`}>
                <Image width={100} height={100} alt='ai icon' src={'/aisvg.svg'} />
            </div>
            <div className="flex flex-col">
                <h1 className={`${chatHeaderStyle}`}>AI</h1>
                <p className={`${chatTextStyle}`}>
                    {content}
                </p>
            </div>
        </div>
    );
}

export default AiResponse;