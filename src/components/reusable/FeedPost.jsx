import Cookies from "js-cookie";
import { memo, useContext, useEffect, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Skeleton } from '../ui/skeleton'
import PropTypes from 'prop-types';
import axios from "axios";
import { toast } from "sonner";
import isLoggedIn from "../../utility/isLoggedIn";
import SmartLoader from "./SmartLoader";
import { Context } from "../../context/Store";

const handleIntersection = (entries) => {
    entries.forEach(entry => {
        const video = entry.target;
        if (entry.isIntersecting) {
            video.play();
        } else {
            video.pause();
            video.currentTime = 0;
        }
    });
};


function FeedPostComponent({ initialPost, following, toggleFollow }) {
    const postId = initialPost._id;
    const currentlyLoggedUser = Cookies.get("userId");
    const [loading, setLoading] = useState(false);
    const [hoverVideo, setHoverVideo] = useState(false);
    const [post, setPost] = useState(initialPost);
    const [comments, setComments] = useState([]);
    const [commentsLoading, setCommentsLoading] = useState(true);
    const [postLoading, setPostLoading] = useState(false);
    const [showComments, setShowComments] = useState(false);

    const [toggleFollowLoading, setToggleFollowLoading] = useState(false);

    const { likePost, share, savePost, deleteComment, likeComment } = useContext(Context);

    const navigate = useNavigate();

    const videoRef = useRef(null);

    const location = useLocation();


    const fetchPost = async () => {
        try {
            const { data } = await axios.get(`/api/posts/${postId}`);

            if (data.success) {
                setPost(data.post);
            }

        } catch (error) {
            console.log(error);
        }
    }



    const fetchComments = async () => {

        try {
            const { data } = await axios.get(`/api/comments/${postId}`);
            if (data.success) {
                setComments(data.comments);
            }
        }

        catch (error) {
            console.log(error);
        }

        setCommentsLoading(false);
    }


    const addComment = async (e) => {

        e.preventDefault();
        setPostLoading(true);

        const isUserLogged = await isLoggedIn();
        if (!isUserLogged) {
            toast.error("Login to continue.");
            navigate(`/login?callback${location.pathname}`)
            setPostLoading(false);
            return;
        }

        const commentData = new FormData(e.target);

        const text = commentData.get("text");

        try {
            const { data } = await axios.post(`/api/comments/${postId}`, {
                text: text
            });

            console.log(data);

            if (data.success) {
                toast.success(data.status)
                e.target.reset()
                await fetchComments();
                await fetchPost();
            }

            else {
                toast.error(data.status)
                navigate(`/login?callback=${location.pathname}`)
                setPostLoading(false);
                return;
            }

        } catch (error) {
            console.log(error);
            toast.error("Something went wrong.")
        }

        setPostLoading(false);
    }




    useEffect(() => {

        const observer = new IntersectionObserver(handleIntersection, { threshold: 0.8 });

        const videoElement = videoRef.current;

        if (videoElement) {
            observer.observe(videoElement);
        }

        return () => {
            if (videoElement) {
                observer.unobserve(videoElement);
            }
        };

    }, [videoRef]);

    return (
        <div key={postId} className="post visible animate-in fade-in-5 bg-zinc-800/20 rounded-lg mt-10 w-full min-h-[50vh] font-medium my-14 border-b border-zinc-800/80 py-10 px-4">
            <div className="flex items-center justify-between">
                <Link to={`/user/${post.author.username}`} className="title flex items-center gap-2">
                    <div className="w-10 h-10 bg-sky-100 rounded-full">
                        <img
                            className="h-full w-full aspect-square rounded-full object-cover"
                            src={`/api/uploads/${post.author.dp}`}
                            alt={`${post.author.name}`}
                        />
                    </div>
                    <div className="flex items-center justify-center gap-2">
                        <h4 className="text-sm font-semibold capitalize tracking-tight flex gap-2 items-center ">
                            {post.author.username}
                            <svg aria-label="Verified" className="x1lliihq x1n2onr6" fill="rgb(0, 149, 246)" height="14" role="img" viewBox="0 0 40 40" width="14"><title>Verified</title><path d="M19.998 3.094 14.638 0l-2.972 5.15H5.432v6.354L0 14.64 3.094 20 0 25.359l5.432 3.137v5.905h5.975L14.638 40l5.36-3.094L25.358 40l3.232-5.6h6.162v-6.01L40 25.359 36.905 20 40 14.641l-5.248-3.03v-6.46h-6.419L25.358 0l-5.36 3.094Zm7.415 11.225 2.254 2.287-11.43 11.5-6.835-6.93 2.244-2.258 4.587 4.581 9.18-9.18Z" fillRule="evenodd"></path></svg>
                        </h4>
                        <span className="h-1 w-1 rounded-full bg-gray-400"></span>
                        <h6 className="text-sm opacity-30 font-normal">{post.timePassed}</h6>
                    </div>

                </Link>
                <button onClick={async () => {
                    setToggleFollowLoading(true);
                    await toggleFollow(post.author._id);
                    setToggleFollowLoading(false);
                }} className="bg-zinc-800 px-4 py-1.5 rounded-full flex text-gray-300 items-center justify-center gap-1 transition-all hover:bg-blue-700 text-sm">
                    {
                        toggleFollowLoading && <span className='h-4 w-4 rounded-full border-[3px] border-light/70 border-t-transparent spin' />
                    }

                    {following ? "Following" : "Follow"}
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M18 7.5v3m0 0v3m0-3h3m-3 0h-3m-2.25-4.125a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0ZM3 19.235v-.11a6.375 6.375 0 0 1 12.75 0v.109A12.318 12.318 0 0 1 9.374 21c-2.331 0-4.512-.645-6.374-1.766Z" />
                    </svg>
                </button>
            </div>

            <div className="w-full aspect-square mt-4 bg-sky-100">
                {
                    post.type === "video" ?
                        <video
                            ref={videoRef}
                            onMouseEnter={() => {
                                setHoverVideo(true);
                            }}
                            onMouseLeave={() => {
                                setHoverVideo(false);
                            }}
                            onLoadedData={() => {
                                setLoading(false)
                            }}
                            id="video"
                            className={`h-full w-full object-cover aspect-[1/1.2] ${loading ? "invisible" : "visible animate-in fade-in-5"}`}
                            alt="Post"
                            autoPlay
                            autoFocus
                            controls={hoverVideo}
                            playsInline
                        >
                            <source src={post.media && `/api/uploads/${post.media}`} type="video/mp4" />
                        </video>
                        :
                        <img onLoad={() => { setLoading(false) }} src={post.media && `/api/uploads/${post.media}`} className={`aspect-[1/1.2] object-cover h-full w-full ${loading ? "hidden" : ""}`} alt={post.media} />
                }
                {loading && (
                    <Skeleton className="h-full w-full aspect-[1/1.2]" />
                )}
            </div>
            <div className="options w-full px-4 flex justify-between items-center text-[1.4rem]">
                <div className="flex gap-3 mt-2">
                    <div className="cursor-pointer" onClick={likePost.bind(this, postId, fetchPost)}>
                        {currentlyLoggedUser && post.likes.includes(currentlyLoggedUser) ? (
                            <i className="ri-heart-3-fill text-red-500"></i>
                        ) : (
                            <i className="ri-heart-3-line"></i>
                        )}
                    </div>

                    <i onClick={async () => {
                        setShowComments(!showComments);
                        if (!showComments) {
                            await fetchComments();
                            const commentInput = document.getElementById("commentInput");
                            commentInput.focus();
                        }
                    }} className="ri-chat-3-line cursor-pointer"></i>

                    <i onClick={share} className="ri-share-circle-line cursor-pointer"></i>
                </div>
                <div className="cursor-pointer" onClick={savePost.bind(this, postId, fetchPost)}>
                    {currentlyLoggedUser && post.saved.includes(currentlyLoggedUser) ? (
                        <i className="ri-bookmark-fill cursor-pointer"></i>
                    ) : (
                        <i className="ri-bookmark-line cursor-pointer"></i>
                    )}
                </div>
            </div>
            <h3 className="px-4 mt-2 text-sm leading-none tracking-tight">
                {post.likes.length} likes
            </h3>
            <h2 className="text-white font-light text-sm mt-2 px-4">
                <p className="font-semibold pr-2 text-base"></p>
                {post.caption}
            </h2>

            <div className="text-center text-light border-l-0 my-5 ">
                <h3 className="text-light text-left text-sm cursor-pointer hover:text-blue-400 select-none" onClick={async () => {
                    setShowComments(!showComments);
                    if (!showComments) {
                        await fetchComments();
                        const commentInput = document.getElementById("commentInput");
                        commentInput.focus();
                    }
                }}>Show Comments {`(${post.comments.length})`}</h3>

                {showComments &&
                    <div className="px-2 my-2 mx-1 border-l border-zinc-800">
                        <div className="h-[77%] bg-zinc-800/20 my-2 rounded-md overflow-y-auto select-none">
                            {
                                (!commentsLoading && comments.length !== 0) && <div className="p-1 flex flex-col gap-2">
                                    {comments.map((comment) => (
                                        <div className="follow bottom-0 py-3 pl-2 flex gap-2 hover:bg-zinc-800 bg-zinc-800/50 rounded-lg group" key={comment._id}>
                                            <img src={`/api/uploads/${comment.author.dp}`} className="h-8 w-8 rounded-full" alt={comment.author.name} />
                                            <div className="text-light flex justify-between w-full pr-2">
                                                <div className="text-left">
                                                    <Link to={`/user/${comment.author.username}`} className=" hover:text-blue-300 text-sm text-zinc-300">{comment.author.username}</Link>
                                                    <div className="text text-white text-sm font-normal text-left ">
                                                        {comment.text}
                                                    </div>
                                                    <div className="flex gap-3 pt-1">
                                                        <span className="text-left text-xs hover:text-red-200 cursor-pointer text-zinc-400">{comment.likes.length} Likes</span>
                                                        <span className="text-left hover:text-blue-100 cursor-pointer text-xs text-zinc-400">{comment.timePassed} ago</span>
                                                    </div>
                                                </div>
                                                <div className="likes flex items-start justify-between flex-col">
                                                    <div onClick={likeComment.bind(this, comment._id, fetchComments)}>
                                                        {(currentlyLoggedUser && comment.likes.indexOf(currentlyLoggedUser) >= 0) ?
                                                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 hover:text-red-600 cursor-pointer text-red-500">
                                                                <path d="m11.645 20.91-.007-.003-.022-.012a15.247 15.247 0 0 1-.383-.218 25.18 25.18 0 0 1-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0 1 12 5.052 5.5 5.5 0 0 1 16.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 0 1-4.244 3.17 15.247 15.247 0 0 1-.383.219l-.022.012-.007.004-.003.001a.752.752 0 0 1-.704 0l-.003-.001Z" />
                                                            </svg>
                                                            :
                                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 cursor-pointer text-gray-400 hover:text-gray-200">
                                                                <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" />
                                                            </svg>
                                                        }
                                                    </div>
                                                    {
                                                        currentlyLoggedUser && comment.author._id === currentlyLoggedUser && (
                                                            <div className="w-4 h-4" onClick={deleteComment.bind(this, comment._id, fetchComments, fetchPost)}>
                                                                <svg id="delete" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-full h-full cursor-pointer text-gray-500 hover:text-gray-200">
                                                                    <path fillRule="evenodd" d="M16.5 4.478v.227a48.816 48.816 0 0 1 3.878.512.75.75 0 1 1-.256 1.478l-.209-.035-1.005 13.07a3 3 0 0 1-2.991 2.77H8.084a3 3 0 0 1-2.991-2.77L4.087 6.66l-.209.035a.75.75 0 0 1-.256-1.478A48.567 48.567 0 0 1 7.5 4.705v-.227c0-1.564 1.213-2.9 2.816-2.951a52.662 52.662 0 0 1 3.369 0c1.603.051 2.815 1.387 2.815 2.951Zm-6.136-1.452a51.196 51.196 0 0 1 3.273 0C14.39 3.05 15 3.684 15 4.478v.113a49.488 49.488 0 0 0-6 0v-.113c0-.794.609-1.428 1.364-1.452Zm-.355 5.945a.75.75 0 1 0-1.5.058l.347 9a.75.75 0 1 0 1.499-.058l-.346-9Zm5.48.058a.75.75 0 1 0-1.498-.058l-.347 9a.75.75 0 0 0 1.5.058l.345-9Z" clipRule="evenodd" />
                                                                </svg>
                                                            </div>
                                                        )
                                                    }

                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            }
                            {
                                commentsLoading && (
                                    <SmartLoader className='h-40' />
                                )
                            }
                            {(comments.length === 0 && !commentsLoading) && (
                                <div className="h-40 w-full flex items-center justify-center">
                                    <p>No comments yet.</p>
                                </div>
                            )}
                        </div>

                        <form method="post" onSubmit={addComment} id="AddComment" className="text-left mb-4">
                            <label className="text-sm bg-dark">Add Comment</label>
                            <textarea
                                id="commentInput"
                                required
                                className="text-sm mb-4 px-2 mt-2 py-1.5 border-2 border-zinc-800 rounded-md block w-full bg-zinc-900"
                                type="text"
                                placeholder="write something..."
                                name="text"
                            />
                            <button className="text-sm w-full py-1.5 rounded-md bg-light/90 hover:bg-light text-black flex gap-3 items-center justify-center" type="submit">
                                {postLoading && <span className='h-5 w-5 rounded-full border-[3px] border-light border-t-blue-500 spin' />}
                                <span className="font-bold">Post</span>
                            </button>
                        </form>
                    </div>
                }
            </div>
        </div>
    )
}


FeedPostComponent.propTypes = {
    initialPost: PropTypes.shape({
        _id: PropTypes.string.isRequired,
        author: PropTypes.shape({
            dp: PropTypes.string.isRequired,
            name: PropTypes.string.isRequired,
            username: PropTypes.string.isRequired,
        }).isRequired,
        timePassed: PropTypes.string.isRequired,
        type: PropTypes.string.isRequired,
        media: PropTypes.string,
        likes: PropTypes.array.isRequired,
        saved: PropTypes.array.isRequired,
        caption: PropTypes.string.isRequired,
    }).isRequired,
    following: PropTypes.bool.isRequired,
    toggleFollow: PropTypes.func.isRequired
};


const FeedPost = memo(FeedPostComponent);

export default FeedPost