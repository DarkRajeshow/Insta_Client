import { useCallback, useContext, useEffect, useRef, useState } from "react";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom"
import { toast } from "sonner";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import Cookies from "js-cookie";
import Page404 from "../special/Page404";
import { Skeleton } from "@/components/ui/skeleton"
import isLoggedIn from '../../utility/isLoggedIn'
import SmartLoader from "../reusable/SmartLoader";
import { Context } from '../../context/Store'
import api from "../../assets/api";
import filePath from "../../assets/filePath";


export default function Post() {

  const location = useLocation();
  const currentlyLoggedUser = Cookies.get("userId");
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [hoverVideo, setHoverVideo] = useState(false);
  const [error, setError] = useState(false)
  const [loading, setLoading] = useState(true);
  const [comments, setComments] = useState([]);
  const [commentsLoading, setCommentsLoading] = useState(true);
  const [postLoading, setPostLoading] = useState(false);

  const { likePost, likeComment, deletePost, share, deleteComment, savePost } = useContext(Context);


  const navigate = useNavigate();
  const videoRef = useRef(null);

  const fetchPost = useCallback(async () => {
    try {
      const { data } = await api.get(`/api/posts/${id}`);

      if (data.success) {
        setPost(data.post);
      }

      else {
        setError(true);
      }

    } catch (error) {
      setError(true);
    }
  }, [id]);



  const showComments = async () => {

    try {
      const { data } = await api.get(`/api/comments/${id}`);

      if (data.success) {
        setComments(data.comments);
      }

    } catch (error) {
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
    }

    const commentData = new FormData(e.target);

    const text = commentData.get("text");

    try {
      const { data } = await api.post(`/api/comments/${id}`, {
        text: text
      });

      console.log(data);

      if (data.success) {
        toast.success(data.status)
        e.target.reset()
        await showComments();
        await fetchPost();
      }

      else {
        toast.error(data.status)
        navigate(`/login?callback=${location.pathname}`)
      }

    } catch (error) {
      console.log(error);
      toast.error("Something went wrong.")
    }

    setPostLoading(false);
  }


  useEffect(() => {
    const videoElement = videoRef.current;

    if (videoElement) {
      const playVideo = async () => {
        try {
          await videoElement.play();
        } catch (error) {
          console.error('Autoplay was blocked:', error);
        }
      };
      playVideo();
    }

    fetchPost();
  }, [fetchPost]);



  if (error) {
    return (
      <Page404 messege="Post not found." />
    )
  }

  return (
    <Sheet>
      <main className="w-full h-screen relative">
        <div className="cursor-pointer" onClick={() => {
          window.history.back()
        }}>
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-10 h-10 absolute top-6 left-6 text-light hover:text-light/50 z-20">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
          </svg>
        </div>

        {post && <div className="w-full h-screen relative rounded-lg overflow-hidden">
          <div className="image shadow-[0_0px_1px_1px] p-2 shadow-zinc-800 rounded-md overflow-hidden w-[500px] absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
            <div className="relative h-full w-full rounded-md overflow-hidden">
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
                    className={`h-full w-full rounded-lg object-cover aspect-[1/1.2] ${loading ? "hidden" : ""}`}
                    alt="Post"
                    autoPlay
                    autoFocus
                    controls={hoverVideo}
                    playsInline
                  >
                    <source src={post.media && `${filePath}/${post.media}`} type="video/mp4" />
                  </video>
                  :
                  <img onLoad={() => { setLoading(false) }} src={post.media && `${filePath}/${post.media}`} className={`aspect-[1/1.2] object-cover w-full h-ful opacity-80 ${loading ? "hidden" : ""}`} alt={post.media} />
              }
              {loading && (
                <Skeleton className="h-full w-full rounded-lg aspect-[1/1.2]" />
              )}

              <div className="caption">
                <p className="text-light text-lg mt-2 pl-2">{post.caption}.</p>
              </div>
              <Link to={`/user/${post.author.username}`} className="autho bottom-0 py-3 pl-2 flex gap-2" >
                <img src={`${filePath}/${post.author.dp}`} className="h-10 w-10 rounded-full" alt={post.author.name} />
                <div className="flex flex-col text-light">
                  <h3 className="text-sm font-semibold">{post.author.name}</h3>
                  <p className="text-sm font-semibold">@{post.author.username}</p>
                </div>
              </Link>
            </div>
          </div>

          {(currentlyLoggedUser === post.author._id) && (
            <Dialog >
              <DialogTrigger>
                <svg id="delete" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8 cursor-pointer absolute top-4 right-5 mx-2 text-light">
                  <path fillRule="evenodd" d="M16.5 4.478v.227a48.816 48.816 0 0 1 3.878.512.75.75 0 1 1-.256 1.478l-.209-.035-1.005 13.07a3 3 0 0 1-2.991 2.77H8.084a3 3 0 0 1-2.991-2.77L4.087 6.66l-.209.035a.75.75 0 0 1-.256-1.478A48.567 48.567 0 0 1 7.5 4.705v-.227c0-1.564 1.213-2.9 2.816-2.951a52.662 52.662 0 0 1 3.369 0c1.603.051 2.815 1.387 2.815 2.951Zm-6.136-1.452a51.196 51.196 0 0 1 3.273 0C14.39 3.05 15 3.684 15 4.478v.113a49.488 49.488 0 0 0-6 0v-.113c0-.794.609-1.428 1.364-1.452Zm-.355 5.945a.75.75 0 1 0-1.5.058l.347 9a.75.75 0 1 0 1.499-.058l-.346-9Zm5.48.058a.75.75 0 1 0-1.498-.058l-.347 9a.75.75 0 0 0 1.5.058l.345-9Z" clipRule="evenodd" />
                </svg>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader className="text-center">
                  <DialogTitle>Are you absolutely sure?</DialogTitle>
                  <DialogDescription>
                    This action cannot be undone. This will permanently delete your post.
                  </DialogDescription>
                  <button onClick={deletePost.bind(this, post._id)} className="text-light bg-red-600 py-3 px-4 rounded-md">Delete</button>
                </DialogHeader>
              </DialogContent>
            </Dialog>
          )}

          <div className="options text-light absolute bottom-20 right-5 flex items-center justify-center gap-6 flex-col w-10 text-2xl">
            <div onClick={likePost.bind(this, post._id, fetchPost)} className="likes flex items-center flex-col justify-center ">
              {(currentlyLoggedUser && post.likes.indexOf(currentlyLoggedUser) >= 0) ?
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8 cursor-pointer text-red-500">
                  <path d="m11.645 20.91-.007-.003-.022-.012a15.247 15.247 0 0 1-.383-.218 25.18 25.18 0 0 1-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0 1 12 5.052 5.5 5.5 0 0 1 16.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 0 1-4.244 3.17 15.247 15.247 0 0 1-.383.219l-.022.012-.007.004-.003.001a.752.752 0 0 1-.704 0l-.003-.001Z" />
                </svg>
                :
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 cursor-pointer">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" />
                </svg>
              }
              <span className="text-lg">{post.likes.length}</span>
            </div>

            <SheetTrigger onClick={showComments}>
              <div className="likes flex items-center flex-col justify-center ">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 cursor-pointer">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 12a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H8.25m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H12m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 0 1-2.555-.337A5.972 5.972 0 0 1 5.41 20.97a5.969 5.969 0 0 1-.474-.065 4.48 4.48 0 0 0 .978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25Z" />
                </svg>
                <span className="text-lg">{post.comments.length}</span>
              </div>
            </SheetTrigger>

            <div onClick={share} className="share flex items-center flex-col justify-center ">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 cursor-pointer">
                <path strokeLinecap="round" strokeLinejoin="round" d="M7.217 10.907a2.25 2.25 0 1 0 0 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186 9.566-5.314m-9.566 7.5 9.566 5.314m0 0a2.25 2.25 0 1 0 3.935 2.186 2.25 2.25 0 0 0-3.935-2.186Zm0-12.814a2.25 2.25 0 1 0 3.933-2.185 2.25 2.25 0 0 0-3.933 2.185Z" />
              </svg>
            </div>

            <a href={`${filePath}/${post.media}`} className='download flex items-center flex-col justify-center' download
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3" />
              </svg>
            </a>

            <div id="save" onClick={savePost.bind(this, post._id, fetchPost)}>
              {post.saved.indexOf(currentlyLoggedUser) >= 0
                ? <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="save w-8 h-8 cursor-pointer">
                  <path fillRule="evenodd" d="M6.32 2.577a49.255 49.255 0 0 1 11.36 0c1.497.174 2.57 1.46 2.57 2.93V21a.75.75 0 0 1-1.085.67L12 18.089l-7.165 3.583A.75.75 0 0 1 3.75 21V5.507c0-1.47 1.073-2.756 2.57-2.93Z" clipRule="evenodd" />
                </svg>

                : <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="save w-8 h-8 cursor-pointer">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0 1 11.186 0Z" />
                </svg>
              }

            </div>

            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="more w-8 h-8 cursor-pointer">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0ZM12.75 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0ZM18.75 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z" />
            </svg>


          </div>
          <SheetContent className="bg-zinc-900 text-center text-light border-l-0 px-3">
            <SheetHeader >
              <SheetTitle className="text-light border-b border-zinc-600">Comments</SheetTitle>
            </SheetHeader>
            <div className="h-[77%] bg-zinc-800/20 my-2 rounded-md overflow-y-auto">
              {
                (!commentsLoading && comments.length !== 0) && <div className="p-1 flex flex-col gap-2">
                  {comments.map((comment) => (
                    <div className="follow bottom-0 py-3 pl-2 flex gap-2 hover:bg-zinc-800 bg-zinc-800/50 rounded-lg group" key={comment._id}>
                      <img src={`${filePath}/${comment.author.dp}`} className="h-8 w-8 rounded-full" alt={comment.author.name} />
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
                          <div onClick={likeComment.bind(this, comment._id, showComments)}>
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
                              <div className="w-4 h-4" onClick={deleteComment.bind(this, comment._id, showComments, fetchPost)}>
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
                  <SmartLoader className='h-full' />
                )
              }
              {(comments.length === 0 && !commentsLoading) && (
                <div className="h-full w-full flex items-center justify-center">
                  <p>No comments yet.</p>
                </div>
              )}
            </div>

            <form method="post" onSubmit={addComment} id="AddComment" className="text-left mb-4">
              <label className="text-sm bg-dark">Add Comment</label>
              <textarea
                required
                className="text-sm mb-4 px-2 mt-2 py-1.5 border-2 border-zinc-800 rounded-md block w-full bg-zinc-900"
                type="text"
                placeholder="write something..."
                name="text"
              />
              <button className="text-sm w-full py-1.5 rounded-md bg-light/50 hover:bg-light/70 text-black flex gap-3 items-center justify-center" type="submit">
                {postLoading && <span className='h-5 w-5 rounded-full border-[3px] border-light border-t-blue-500 spin' />}
                <span className="font-bold">Post</span>
              </button>
            </form>

          </SheetContent>
        </div>
        }
      </main>
    </Sheet >
  )
}
