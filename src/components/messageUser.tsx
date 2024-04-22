import { chatRowBaseStyle, chatImageStyle, chatHeaderStyle, chatTextStyle } from '@/lib/commonStyles';
import Image from 'next/image';


const UserMessage = ({ content, imageSrc='/userImage.png'}: { content: string | undefined, imageSrc?: string }) => {
    return (
        <div className={`${chatRowBaseStyle}`}>
            <div className={`${chatImageStyle}`}>
                <Image width={100} height={100} alt='ai icon' src={imageSrc} />
            </div>
            <div className="flex flex-col">
                <h1 className={`${chatHeaderStyle}`}>You</h1>
                <p className={`${chatTextStyle}`}>
                    {content}
                </p>
            </div>
        </div>
    );
}

export default UserMessage;