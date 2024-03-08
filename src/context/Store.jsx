import { createContext, useCallback, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { toast } from 'sonner';
import { useLocation, useNavigate } from 'react-router-dom';
import { likeCommentAPI, likePostAPI, toggleFollowAPI, deleteCommentAPI, deletePostAPI, savePostAPI, unReadNotificationsAPI, recentChatsAPI, logoutAPI, getMessagesAPI, getUserId, unReadMessagesAPI } from '../utility/apiUtils'

export const Context = createContext();

export const StoreProvider = ({ children }) => {
    const navigate = useNavigate();
    const [loggedUser, setLoggedUser] = useState(null);
    const location = useLocation();


    const [currentlyLoggedUser, setCurrentlyLoggedUser] = useState(false);
    const [socket, setSocket] = useState(null);
    const [loggedUserData, setLoggedUserData] = useState(null);
    const [recentChatUsers, setRecentChatUsers] = useState(null);
    const [messages, setMessages] = useState([]);
    const [messageInput, setMessageInput] = useState("");
    const [selectedUserForChat, setSelectedUserForChat] = useState(null);
    const [notifications, setNotifications] = useState([]);
    const [unReadNotificationCount, setUnReadNotificationCount] = useState(0);
    const [unReadMessages, setUnReadMessages] = useState(0);
    const [isSelectedUserOnline, setIsSelectedUserOnline] = useState(false);

    const [msgLoading, setMsgLoading] = useState(true);

    const findUserId = async () => {
        const userIdStatus = await getUserId();
        setCurrentlyLoggedUser(userIdStatus);
    }

    useEffect(() => {
        findUserId();
    }, [])

    const likePost = async (postId, reFetchPost) => {
        const isUserLogged = await getUserId();
        if (!isUserLogged) {
            toast.error("Login to continue.");
            navigate(`/login?callback=${location.pathname}`)
        }
        else {
            try {
                const { data } = await likePostAPI(postId)
                if (data.success) {
                    toast.success(data.status);
                    await reFetchPost();
                }
                else {
                    toast.error(data.status);
                    navigate(`/login?callback=${location.pathname}`)
                }
            } catch (error) {
                console.log(error);
                toast.error("Internal server error.");
            }
        }
    }

    const likeComment = async (commentId, reloadComments) => {
        const isUserLogged = await getUserId();
        if (!isUserLogged) {
            toast.error("Login to continue.");
            navigate(`/login?callback${location.pathname}`)
        }
        else {
            try {
                const { data } = await likeCommentAPI(commentId);

                console.log(data);
                if (data.success) {
                    toast.success(data.status);
                    await reloadComments();
                }
                else {
                    toast.error(data.status);
                    navigate(`/login?callback${location.pathname}`)
                }
            } catch (error) {
                console.log(error);
                toast.error("Internal server error.");
            }
        }
    }

    const deletePost = async (postId) => {
        try {
            const { data } = await deletePostAPI(postId);
            if (data.success) {
                toast.success(data.status);
                navigate("/profile");
            }
            else {
                toast.error(data.status);
            }
        } catch (error) {
            console.log(error);
            toast.error("Internal server error.");
        }
    }

    const share = async () => {
        try {
            if (navigator.share) {
                await navigator.share({
                    title: "Post",
                    text: 'Share post on..',
                    url: window.location.href
                });
            } else {
                toast.error("Web Share API is not supported in this browser.")
            }
        } catch (error) {
            console.error('Error sharing:', error.message);
            toast.error("Something went wrong.")
        }
    };


    const deleteComment = async (commentId, showComments, fetchPost) => {
        try {
            const { data } = await deleteCommentAPI(commentId);

            if (data.success) {
                toast.success(data.status);
                await showComments();
                await fetchPost();
            }
            else {
                toast.error(data.status);
            }

        } catch (error) {
            console.log(error);
            toast.error("Something went wrong.")
        }
    }

    const savePost = async (postId, fetchPost) => {
        const isUserLogged = await getUserId();

        if (!isUserLogged) {
            toast.error("Login to continue.");
            navigate(`/login?callback=${location.pathname}`)
            return;
        }

        else {
            try {
                const { data } = await savePostAPI(postId);
                console.log(data);
                if (data.success) {
                    toast.success(data.status);
                    await fetchPost();
                }
                else {
                    toast.error(data.status);
                    navigate(`/login?callback=${location.pathname}`)
                }
            } catch (error) {
                console.log(error);
                toast.error("Internal server error.");
            }
        }
    }

    const logOut = async () => {
        try {
            const { data } = await logoutAPI();

            if (data.success) {
                socket.emit("leave_room", currentlyLoggedUser);
                socket.emit("offline", currentlyLoggedUser);
                setLoggedUser(null);
                toast.success(data.status);
                navigate("/login");
            }
            else {
                toast.error(data.status)
            }
        } catch (error) {
            console.log(error);
            toast.error("Something went wrong.")
        }
    }


    const toggleFollow = async (userIdToFollow) => {

        try {
            const { data } = await toggleFollowAPI(userIdToFollow);

            if (data.success) {
                toast.success(data.status);
                return true;
            }

            else {
                toast.error(data.status)
                navigate(`/login?callback=${location.pathname}`)
                return false;
            }
        }

        catch (error) {
            console.log(error);
            toast.error("Something went wrong....")
            return false;
        }
    }

    const fetchUnReadNotifications = async (userId) => {
        try {
            const { data } = await unReadNotificationsAPI(userId);
            if (data.success) {
                setUnReadNotificationCount(data.notificationCount);
            }
            else {
                toast.success(data.status)
            }
        } catch (error) {
            console.log("Problem : " + error);
        }
    }

    const fetchUnReadMessages = async (userId) => {
        try {
            const { data } = await unReadMessagesAPI(userId);
            if (data.success) {
                setUnReadMessages(data.unReadMessagesCount);
            }
            else {
                toast.success(data.status)
            }
        } catch (error) {
            console.log("Problem : " + error);
        }
    }


    const fetchRecentChats = useCallback(async () => {
        if (!currentlyLoggedUser) {
            setMsgLoading(false);
            return;
        }
        try {
            const { data } = await recentChatsAPI();
            if (data.success) {
                setRecentChatUsers(data.recentChats);
            }
        } catch (error) {
            console.error('Error fetching logged user:', error);
        }
        setMsgLoading(false);
    }, [currentlyLoggedUser, setRecentChatUsers]);


    const fetchMessagesFromDB = useCallback(async () => {
        if (selectedUserForChat && currentlyLoggedUser) {
            try {
                const { data } = await getMessagesAPI(selectedUserForChat._id);
                if (data.success) setMessages(data.messages);
            } catch (error) {
                console.error('Error fetching messages:', error);
            }
        }
    }, [selectedUserForChat, currentlyLoggedUser, setMessages]);


    return (
        <Context.Provider value={{
            loggedUser,
            setLoggedUser,
            likePost,
            deletePost,
            savePost,
            likeComment,
            share,
            deleteComment,
            socket,
            setSocket,
            loggedUserData,
            setLoggedUserData,
            messages,
            setMessages,
            messageInput,
            setMessageInput,
            selectedUserForChat,
            setSelectedUserForChat,
            toggleFollow,
            recentChatUsers,
            setRecentChatUsers,
            notifications,
            setNotifications,
            fetchUnReadNotifications,
            unReadNotificationCount,
            isSelectedUserOnline,
            setIsSelectedUserOnline,
            fetchRecentChats,
            msgLoading,
            logOut,
            fetchUnReadMessages,
            setMsgLoading,
            fetchMessagesFromDB,
            unReadMessages
        }}>
            <div>{children}</div>
        </Context.Provider>
    );
};

StoreProvider.propTypes = {
    children: PropTypes.node.isRequired,
};
