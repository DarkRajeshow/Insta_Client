import { CheckCheck } from 'lucide-react';
import PropTypes from 'prop-types';
import convertToAMPM from '../../utility/covertToAMPM';
import { useCallback, useContext, useEffect } from 'react';
import { toast } from 'sonner';
import { messageReadAPI } from '../../utility/apiUtils';
import { Context } from '../../context/Store';

const Message = ({ message, isItYou, userId }) => {


    const { socket, selectedUserForChat, fetchRecentChats, } = useContext(Context);


    const markMessageAsReadIfNot = useCallback(async () => {
        if (message.read || message.sender === userId) {
            return;
        }
        try {
            const { data } = await messageReadAPI(message._id);
            if (data.success && socket) {
                console.log("should send");
                socket.emit("read", {
                    sentBy: selectedUserForChat._id,
                    readBy: userId
                });
                await fetchRecentChats();
            }
        } catch (error) {
            toast.error("Something went wrong.");
        }
    }, [message, userId, socket, selectedUserForChat._id, fetchRecentChats]);

    useEffect(() => {
        markMessageAsReadIfNot();
    }, [markMessageAsReadIfNot])


    return (
        <div className={`select-none fade-in-5 animate-in my-4 cursor-pointer max-w-[250px] w-[50vw] auto flex flex-col gap-1 ${isItYou ? "ml-auto" : "mr-auto"}`}>
            <div className={`message text-sm p-3 rounded-lg bg-zinc-700/40 ${isItYou ? " text-light/85 rounded-br-none" : "text-light/85 rounded-bl-none"}`}>
                <p className='flex justify-between items-center'>{message.content} {
                    isItYou && <CheckCheck className={`w-4 h-4 ${message.read ? "text-blue-500" : "text-light/70"}`} />
                }</p>
            </div>
            <span className='pl-1 text-xs font-semibold text-zinc-500'>{convertToAMPM(message.timestamp)}</span>
        </div>
    );
}

Message.propTypes = {
    message: PropTypes.shape({
        _id: PropTypes.string.isRequired,
        content: PropTypes.string.isRequired,
        sender: PropTypes.string.isRequired,
        timestamp: PropTypes.string.isRequired,
        read: PropTypes.bool
    }).isRequired,
    isItYou: PropTypes.bool.isRequired,
    userId: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.bool,
    ]).isRequired
};

export default Message;
