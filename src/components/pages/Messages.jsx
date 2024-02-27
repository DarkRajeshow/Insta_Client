import { useContext, useEffect, useState, useCallback } from 'react';
import Cookies from 'js-cookie';
import RecentChats from '../messages/RecentChats';
import Chat from '../messages/Chat';
import SmartLoader from '../reusable/SmartLoader';
import { Context } from '../../context/Store';
import {
    ResizableHandle,
    ResizablePanel,
    ResizablePanelGroup,
} from "@/components/ui/resizable"
import api from '../../assets/api';

export default function Messages() {
    const [loading, setLoading] = useState(true);
    const [collapse, setCollapse] = useState(false);

    const { socket, messages, setMessages, setSelectedUserForChat, recentChatUsers, setRecentChatUsers, messageInput, setMessageInput, selectedUserForChat, setMessageLoading, setUserInMessageView } = useContext(Context);
    const currentLyLoggedUser = Cookies.get("userId");

    const saveMessage = useCallback(async (messageData) => {
        try {
            const { data } = await api.put(`/api/messages/save`, messageData);
            if (!data.success) {
                console.log(data.status);
            }
            else{
                await fetchRecentChats();
            }
        } catch (error) {
            console.error(`Error saving message:`, error);
        }
    }, []);

    const fetchRecentChats = useCallback(async () => {
        if (!currentLyLoggedUser) {
            setLoading(false);
            return;
        }
        try {
            const { data } = await api.get("/api/user/recentchats");
            if (data.success) {
                setRecentChatUsers(data.recentChats);
            }
        } catch (error) {
            console.error('Error fetching logged user:', error);
        }
        setLoading(false);
    }, [currentLyLoggedUser, setRecentChatUsers]);

    const fetchMessagesFromDB = useCallback(async () => {
        if (selectedUserForChat && currentLyLoggedUser) {
            try {
                const { data } = await api.get(`/api/messages/${selectedUserForChat._id}`);
                if (data.success) setMessages(data.messages);
            } catch (error) {
                console.error('Error fetching messages:', error);
            }
        }
    }, [selectedUserForChat, setMessages, currentLyLoggedUser]);

    const fetchInitialMessages = useCallback(async () => {
        setMessageLoading(true);
        await fetchMessagesFromDB();
        setMessageLoading(false);
    }, [fetchMessagesFromDB, setMessageLoading]);

    useEffect(() => {
        fetchRecentChats();
    }, [fetchRecentChats]);

    useEffect(() => {
        fetchInitialMessages();
    }, [fetchInitialMessages]);

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

    useEffect(() => {
        if (socket) {
            socket.on('connect', async () => {
                await socket.emit("join_room", currentLyLoggedUser);
            });

            socket.on('receive_message', async () => {
                await fetchMessagesFromDB();
                await fetchRecentChats();
            });
        }
    }, [socket, currentLyLoggedUser, saveMessage, fetchMessagesFromDB, fetchRecentChats]);


    const sendMessage = useCallback(async (e) => {
        e.preventDefault();
        if (!selectedUserForChat) return;
        const messageData = {
            content: messageInput,
            receiver: selectedUserForChat._id,
            sender: currentLyLoggedUser
        };
        await saveMessage(messageData);
        await fetchMessagesFromDB();
        socket.emit("new_message", messageData);
        setMessageInput("");
    }, [currentLyLoggedUser, selectedUserForChat, messageInput, saveMessage, fetchMessagesFromDB, setMessageInput, socket]);
    
    useEffect(() => {
        // Set user in view when component mounts
        setUserInMessageView(true);

        // Clean up when component unmounts
        return () => {
            setUserInMessageView(false);
        };
    }, []);

    return (
        <main className='h-[88vh] sm:h-[85vh] px-6 gap-0.5 flex' >
            {loading && <SmartLoader className='h-[85vh] absolute w-full bg-zinc-900 ' />}

            {!loading && <>
                <div className='md:block hidden w-full'>
                    <ResizablePanelGroup className="transition-none flex-col gap-1" direction="horizontal">
                        <ResizablePanel className="transition-none">
                            <div className={`bg-[#1E1E21] h-full rounded-lg overflow-hidden`}>
                                {recentChatUsers && <RecentChats setCollapse={setCollapse} />}
                            </div>
                        </ResizablePanel>
                        <ResizableHandle className="bg-zinc-800 transition-none" withHandle />
                        <ResizablePanel className="chat bg-zinc-800/20 rounded-lg w-full">
                            {recentChatUsers && messages && <Chat sendMessage={sendMessage} />}
                        </ResizablePanel>
                    </ResizablePanelGroup>
                </div>
                <div className='flex flex-col w-full relative md:hidden'>
                    <div className='w-[40px] my-2'>
                        <button onClick={() => setCollapse(!collapse)} className={`hover:bg-zinc-700/40 right-2 top-4 px-2 rounded-sm text-muted text-lg cursor-pointer ${collapse && "bg-zinc-700/50"}`}>
                            <i className="ri-menu-fold-line"></i>
                        </button>
                    </div>
                    <div className='relative w-full h-full'>
                        <div className={`absolute z-40 md:left-0 md:relative following bg-[#1E1E21] rounded-lg h-full ${!collapse ? "w-full" : "w-0"} overflow-hidden`}>
                            {recentChatUsers && <RecentChats setCollapse={setCollapse} />}
                        </div>
                        <div className={`chat bg-zinc-800/20 rounded-lg w-full h-full`}>
                            {recentChatUsers && messages && <Chat sendMessage={sendMessage} />}
                        </div>
                    </div>
                </div>
            </>}
        </main>
    );
}
