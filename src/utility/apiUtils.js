
import api from '@/assets/api';

const apiRequest = async (method, url, data) => {
    try {
        const response = await api({
            method,
            url,
            data,
        });
        return response;
    } catch (error) {
        throw new Error(error.response.data.message || 'Something went wrong');
    }
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


