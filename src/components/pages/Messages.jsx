import { useContext, useEffect, useState, useCallback } from 'react';
import RecentChats from '../messages/RecentChats';
import Chat from '../messages/Chat';
import SmartLoader from '../reusable/SmartLoader';
import { Context } from '../../context/Store';
import {
    ResizableHandle,
    ResizablePanel,
    ResizablePanelGroup,
} from "@/components/ui/resizable"
import { saveMessageAPI } from '../../utility/apiUtils';
import PropTypes from 'prop-types';
import { useParams } from 'react-router-dom';


export default function Messages({ userId }) {

    const [collapse, setCollapse] = useState(false);

    const { socket, messages, msgLoading, setSelectedUserForChat, fetchMessagesFromDB, recentChatUsers, messageInput, setMessageInput, selectedUserForChat, fetchRecentChats, setIsSelectedUserOnline } = useContext(Context);

    const { userId: selectedUserId } = useParams();

    const saveMessage = useCallback(async (messageData) => {
        try {
            const { data } = await saveMessageAPI(messageData);
            if (!data.success) {
                console.log(data.status);
            }
            else {
                await fetchRecentChats();
            }
        } catch (error) {
            console.error(`Error saving message:`, error);
        }
    }, [fetchRecentChats]);


    useEffect(() => {
        if (socket) {
            socket.on("read_response", async ({
                readBy
            }) => {
                console.log(readBy);
                if (selectedUserForChat && (readBy === selectedUserForChat._id)) {
                    await fetchMessagesFromDB();
                }
                await fetchRecentChats();
            })
        }
    }, [socket, fetchMessagesFromDB, setIsSelectedUserOnline, fetchRecentChats, selectedUserForChat]);

    useEffect(() => {
        fetchRecentChats();
    }, [fetchRecentChats]);

    useEffect(() => {
        fetchMessagesFromDB();
    }, [fetchMessagesFromDB, selectedUserId]);

    useEffect(() => {
        const handleKeyPress = (e) => {
            if (e.key === "Escape") {
                setSelectedUserForChat(null);
            }
        };

        document.addEventListener("keydown", handleKeyPress);

        return () => {
            document.removeEventListener("keydown", handleKeyPress);
        };
    }, [setSelectedUserForChat]);


    const sendMessage = useCallback(async () => {
        if (!selectedUserForChat) return;
        const messageData = {
            content: messageInput,
            receiver: selectedUserForChat._id,
            sender: userId
        };
        await saveMessage(messageData);
        await fetchMessagesFromDB();
        setMessageInput("");
        if (socket && socket.id) {
            socket.emit("new_message", messageData);
        }
    }, [userId, selectedUserForChat, messageInput, saveMessage, fetchMessagesFromDB, setMessageInput, socket]);

    return (
        <main className='h-[80vh] md:h-[85vh] px-6 gap-0.5 flex' >
            {(msgLoading || !recentChatUsers) && <SmartLoader className='h-[85vh] absolute w-full' />}
            {(!msgLoading && recentChatUsers) && <>
                <div className='md:block hidden w-full'>
                    <ResizablePanelGroup className="transition-none flex-col gap-1" direction="horizontal">
                        <ResizablePanel className="transition-none">
                            <div className={`bg-[#12101A] h-full rounded-lg overflow-hidden`}>
                                {recentChatUsers && <RecentChats setCollapse={setCollapse} />}
                            </div>
                        </ResizablePanel>
                        <ResizableHandle className="bg-zinc-800 transition-none" withHandle />
                        <ResizablePanel className="chat bg-[#12101A] rounded-lg w-full">
                            {recentChatUsers && messages && <Chat userId={userId} sendMessage={sendMessage} />}
                        </ResizablePanel>
                    </ResizablePanelGroup>
                </div>
                <div className='flex flex-col w-full relative md:hidden'>
                    <div className='w-[40px] my-2'>
                        <button onClick={() => {
                            setCollapse(!collapse)
                        }} className={`hover:bg-zinc-700/40 right-2 top-4 px-2 rounded-sm text-muted text-lg cursor-pointer ${collapse && "bg-zinc-700/50"}`}>
                            <i className="ri-menu-fold-line"></i>
                        </button>
                    </div>
                    <div className='relative w-full h-full'>
                        <div className={`absolute z-40 md:left-0 md:relative following bg-[#1E1E21] rounded-lg h-full ${!collapse ? "w-full" : "w-0"} overflow-hidden`}>
                            {recentChatUsers && <RecentChats setCollapse={setCollapse} />}
                        </div>
                        <div className={`chat bg-zinc-800/20 rounded-lg h-full ${collapse ? "w-full" : "w-0"}`}>
                            {recentChatUsers && messages && <Chat userId={userId} collapse={collapse} sendMessage={sendMessage} />}
                        </div>
                    </div>
                </div>
            </>}
        </main>
    );
}

Messages.propTypes = {
    userId: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.bool,
    ]).isRequired,
};