
import api from '@/assets/api';

const apiRequest = async (method, url, data, options) => {
    try {
        const response = await api({
            method,
            url,
            data,
            options
        });
        return response;
    } catch (error) {
        throw new Error(error.response.data.message || 'Something went wrong');
    }
};

export const loginAPI = async (userCredentials) => {
    return apiRequest('post', "/api/login", userCredentials, { withCredentials: true });
};

export const registerAPI = async (userCredentials) => {
    return apiRequest('post', "/api/register", userCredentials, { withCredentials: true });
};

export const likePostAPI = async (postId) => {
    return apiRequest('put', '/api/like', { postId });
};

export const likeCommentAPI = async (commentId) => {
    return apiRequest('put', '/api/comments/like', { commentId });
};

export const deletePostAPI = async (postId) => {
    return apiRequest('delete', `/api/posts/${postId}`);
};

export const deleteCommentAPI = async (commentId) => {
    return apiRequest('delete', `/api/comments/${commentId}`);
};

export const savePostAPI = async (postId) => {
    return apiRequest('put', `/api/save/`, { postId });
};

export const toggleFollowAPI = async (userIdToFollow) => {
    return apiRequest('put', `/api/toggle-follow/`, { userIdToFollow });
};

export const getUserAPI = async () => {
    return apiRequest('get', `/api/user`);
};

export const updateUserDataAPI = async (newData) => {
    return apiRequest('put', `/api/user`, newData);
};

export const exporeDataAPI = async (offset) => {
    return apiRequest('get', `/api/posts/explore/${offset}`);
};

export const searchPostsAPI = async (searchQuery) => {
    return apiRequest('get', `/api/posts/search?query=${searchQuery}`);
};

export const feedPostsAPI = async (offset) => {
    return apiRequest('get', `/api/feed/${offset}`);
};

export const likedPostsAPI = async (offset) => {
    return apiRequest('get', `/api/liked/${offset}`);
};

export const savedPostsAPI = async (offset) => {
    return apiRequest('get', `/api/saved/${offset}`);
};

export const saveMessageAPI = async (messageData) => {
    return apiRequest('put', `/api/messages/save`, messageData);
};

export const getMessagesAPI = async (selectedUserId) => {
    return apiRequest('get', `/api/messages/${selectedUserId}`);
};

export const recentChatsAPI = async () => {
    return apiRequest('get', `/api/user/recentchats`);
};

export const postByIdAPI = async (id) => {
    return apiRequest('get', `/api/posts/${id}`);
};

export const getCommentsByPostIdAPI = async (id) => {
    return apiRequest('get', `/api/comments/${id}`);
};

export const addCommentByPostIdAPI = async (id, text) => {
    return apiRequest('post', `/api/comments/${id}`, { text });
};

export const addNoficationAPI = async (notification) => {
    return apiRequest('post', `/api/notifications/new`, notification);
};

export const userDataAPI = async (full = false) => {
    return apiRequest('get', `/api/user?full=${full}`);
};

export const logoutAPI = async () => {
    return apiRequest('get', `/api/logout`);
};

export const isLoggedInAPI = async () => {
    return apiRequest('get', `/api/isloggedin`);
};

export const showFollowsAPI = async (route, userId) => {
    return apiRequest('get', `/api/${route}/${userId}`);
};

export const searchUsersAPI = async (query) => {
    return apiRequest('get', `/api/search/${query}`);
};

export const uploadPostAPI = async (postData) => {
    return apiRequest('post', `/api/upload`, postData);
};

export const userByUsernameAPI = async (username) => {
    return apiRequest('get', `/api/username?username=${username}`);
};

export const specialUserAPI = async (userId, attributes) => {
    return apiRequest('get', `/api/special/user/${userId}?include=${attributes}`);
};

export const unReadNotificationsAPI = async (userId) => {
    return apiRequest('get', `/api/notifications/unread/${userId}`);
};

export const unReadMessagesAPI = async (userId) => {
    return apiRequest('get', `/api/messages/unread/${userId}`);
};

export const allNotificationsAPI = async () => {
    return apiRequest('get', `/api/notifications/all`);
};

export const notificationsReadAPI = async (notificationIds) => {
    return apiRequest('put', `/api/notifications/read`, {
        notificationIds
    });
};

export const clearNotificationsAPI = async () => {
    return apiRequest('delete', `/api/notifications/all`);
};

export const messageReadAPI = async (messageId) => {
    return apiRequest('put', `/api/messages/read`, {
        messageId
    });
};

export const getUserId = async () => {
    const { data } = await apiRequest('get', `/api/auth/userid`);
    if (data.success) {
        return data.userId
    }
    return false;
};

