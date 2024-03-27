
import { useEffect } from "react";
import { useState } from "react";
import InfiniteScroll from 'react-infinite-scroll-component';
import { Link } from "react-router-dom";
import PostCard from "../reusable/PostCard";
import { Skeleton } from "../ui/skeleton";
import { likedPostsAPI } from "../../utility/apiUtils";
import PropTypes from 'prop-types';


export default function Liked({ userId }) {

    const [likedPosts, setLikedPosts] = useState([]);
    const [offset, setOffset] = useState(0);
    const [hasMore, setHasMore] = useState(true);
    const [loading, setLoading] = useState(true);

    const fetchLikedPosts = async () => {
        try {
            const { data } = await likedPostsAPI(offset);

            console.log(data);

            if (data.success) {
                if (data.liked.length === 0) {
                    setHasMore(false);
                }
                else {
                    setLikedPosts([...likedPosts, ...data.liked]);
                    setOffset(offset + 1);
                }
            }
        } catch (error) {
            console.error(error);
        }
        setLoading(false);
    }

    useEffect(() => {
        fetchLikedPosts();
    }, [])

    return (
        <div className="w-full min-h-screen bg-zinc-900 text-white">
            <div className="flex items-center justify-between px-6 mb-3 mt-10">
                <div className="">
                    <h1 className="text-4xl font-bold mb-2 text-gray-300">Your <strong className="text-red-500">Liked</strong> Moments</h1>
                    <p className="text-xs text-gray-400 sm:text-sm sm:w-[400px] lg:w-[600px]">Your go-to destination to rediscover and relive your most beloved photos, videos, and posts in one convenient place</p>
                </div>
                <div className="hidden sm:block text-gray-500 cursor-pointer h-14 w-14">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="hover:text-light animate-pulse">
                        <path d="M7.493 18.5c-.425 0-.82-.236-.975-.632A7.48 7.48 0 0 1 6 15.125c0-1.75.599-3.358 1.602-4.634.151-.192.373-.309.6-.397.473-.183.89-.514 1.212-.924a9.042 9.042 0 0 1 2.861-2.4c.723-.384 1.35-.956 1.653-1.715a4.498 4.498 0 0 0 .322-1.672V2.75A.75.75 0 0 1 15 2a2.25 2.25 0 0 1 2.25 2.25c0 1.152-.26 2.243-.723 3.218-.266.558.107 1.282.725 1.282h3.126c1.026 0 1.945.694 2.054 1.715.045.422.068.85.068 1.285a11.95 11.95 0 0 1-2.649 7.521c-.388.482-.987.729-1.605.729H14.23c-.483 0-.964-.078-1.423-.23l-3.114-1.04a4.501 4.501 0 0 0-1.423-.23h-.777ZM2.331 10.727a11.969 11.969 0 0 0-.831 4.398 12 12 0 0 0 .52 3.507C2.28 19.482 3.105 20 3.994 20H4.9c.445 0 .72-.498.523-.898a8.963 8.963 0 0 1-.924-3.977c0-1.708.476-3.305 1.302-4.666.245-.403-.028-.959-.5-.959H4.25c-.832 0-1.612.453-1.918 1.227Z" />
                    </svg>
                </div>
            </div>
            <div className="likedPosts mb-20 m-auto ">

                <InfiniteScroll
                    className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-1 my-10 py-4 text-center border-t border-t-gray-800 mx-6"
                    dataLength={likedPosts.length}
                    next={fetchLikedPosts}
                    hasMore={hasMore}
                >
                    {
                        loading && (
                            <>
                                <Skeleton className={'aspect-square'} />
                                <Skeleton className={'aspect-square'} />
                                <Skeleton className={'aspect-square'} />
                                <Skeleton className={'aspect-square'} />
                                <Skeleton className={'aspect-square'} />
                            </>
                        )
                    }
                    {likedPosts.map((post, index) => (
                        <PostCard post={post} index={index} key={post._id} userId={userId} />
                    ))}
                </InfiniteScroll>

                {!loading && likedPosts.length === 0 && (
                    <Link to={"/"} className="cursor-pointer w-full h-[200px] flex flex-col gap-3 items-center justify-center font-bold text-light text-3xl ">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={0.5} stroke="currentColor" className="w-10 sm:w-20 h-10 sm:h-20 text-light/80 " >
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6.827 6.175A2.31 2.31 0 0 1 5.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 0 0-1.134-.175 2.31 2.31 0 0 1-1.64-1.055l-.822-1.316a2.192 2.192 0 0 0-1.736-1.039 48.774 48.774 0 0 0-5.232 0 2.192 2.192 0 0 0-1.736 1.039l-.821 1.316Z" />
                            <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 12.75a4.5 4.5 0 1 1-9 0 4.5 4.5 0 0 1 9 0ZM18.75 10.5h.008v.008h-.008V10.5Z" />
                        </svg>
                        <h1 className='w-[300px] text-center'>You haven&apos;t liked any posts.</h1>
                    </Link>
                )}
            </div>
        </div>
    )
}



Liked.propTypes = {
    userId: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.bool,
    ]).isRequired,
};