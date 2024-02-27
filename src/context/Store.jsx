import { createContext, useState } from 'react';
import PropTypes from 'prop-types';
import isLoggedIn from '@/utility/isLoggedIn';
import { toast } from 'sonner';
import { useLocation, useNavigate } from 'react-router-dom';
import { likeCommentAPI, likePostAPI, toggleFollowAPI, deleteCommentAPI, deletePostAPI, savePostAPI } from '../utility/apiUtils'

export const Context = createContext();

export const StoreProvider = ({ children }) => {
    const navigate = useNavigate();
    const [loggedUser, setLoggedUser] = useState(null);
    const location = useLocation();


    //messages 
    const [socket, setSocket] = useState(null);
    const [loggedUserData, setLoggedUserData] = useState(null);
    const [recentChatUsers, setRecentChatUsers] = useState(null);
    const [messages, setMessages] = useState([]);
    const [messageInput, setMessageInput] = useState("");
    const [selectedUserForChat, setSelectedUserForChat] = useState(null);
    const [messageLoading, setMessageLoading] = useState(false);
    const [userInMessageView, setUserInMessageView] = useState(false);
    const [notifications, setNotifications] = useState([]);

    const likePost = async (postId, reFetchPost) => {
        const isUserLogged = await isLoggedIn();
        if (!isUserLogged) {
            toast.error("Login to continue.");
            navigate(`/login?callback=${location.pathname}`)
        }
        else {
            try {
                const { data } = await likePostAPI(postId)
                console.log(data);
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
        const isUserLogged = await isLoggedIn();
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
        const userLogged = await isLoggedIn();

        if (!userLogged) {
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
            messageLoading,
            setMessageLoading,
            userInMessageView,
            setUserInMessageView,
            notifications,
            setNotifications
        }}>
            <div>{children}</div>
        </Context.Provider>
    );
};

StoreProvider.propTypes = {
    children: PropTypes.node.isRequired,
};
