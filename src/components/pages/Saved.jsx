import axios from "axios";
import { useEffect } from "react";
import { useState } from "react";
import InfiniteScroll from 'react-infinite-scroll-component';
import Cookies from "js-cookie";
import { Link } from "react-router-dom";
import PostCard from "../reusable/PostCard";
import { Skeleton } from "../ui/skeleton";

export default function Saved() {

    const [SavedPosts, setSavedPosts] = useState([]);
    const [offset, setOffset] = useState(0);
    const [hasMore, setHasMore] = useState(true);
    const [loading, setLoading] = useState(true);
    const currentlyLoggedUser = Cookies.get("userId");

    const fetchSavedPosts = async () => {
        try {
            const { data } = await axios.get(`/api/saved/${offset}`);

            console.log(data);

            if (data.success) {
                if (data.saved.length === 0) {
                    setHasMore(false);
                }
                else {
                    setSavedPosts([...SavedPosts, ...data.saved]);
                    setOffset(offset + 1);
                }
            }
        } catch (error) {
            console.error(error);
        }
        setLoading(false);
    }

    useEffect(() => {
        fetchSavedPosts();
    }, [])

    return (
        <div className="w-full min-h-screen bg-zinc-900 text-white">
            <div className="flex items-center justify-between px-6 mb-3 mt-10">
                <div className="">
                    <h1 className="text-4xl font-bold mb-2 text-gray-300">Your <strong className="text-[#6EB5FF]">Saved</strong> Content</h1>
                    <p className="text-xs text-gray-400 sm:text-sm sm:w-[400px] lg:w-[600px]"> keeps all your saved photos, and videos in one convenient place, ensuring you never lose track of your digital treasures!</p>
                </div>
                <div className="text-gray-500 cursor-pointer h-14 w-14">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="hover:text-light animate-pulse">
                        <path fillRule="evenodd" d="M6.32 2.577a49.255 49.255 0 0 1 11.36 0c1.497.174 2.57 1.46 2.57 2.93V21a.75.75 0 0 1-1.085.67L12 18.089l-7.165 3.583A.75.75 0 0 1 3.75 21V5.507c0-1.47 1.073-2.756 2.57-2.93Z" clipRule="evenodd" />
                    </svg>
                </div>
            </div>
            <div className="SavedPosts mb-20 m-auto ">

                <InfiniteScroll
                    className="grid grid-cols-3 gap-1 my-10 py-4 text-center border-t border-t-gray-800 mx-6"
                    dataLength={SavedPosts.length}
                    next={fetchSavedPosts}
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
                    {SavedPosts.map((post, index) => (
                        <PostCard post={post} index={index} key={post._id} userId={currentlyLoggedUser} />
                    ))}
                </InfiniteScroll>

                {!loading && SavedPosts.length === 0 && (
                    <Link to={"/"} className="cursor-pointer w-full h-[200px] flex flex-col gap-3 items-center justify-center font-bold text-light text-3xl ">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={0.5} stroke="currentColor" className="w-10 sm:w-20 h-10 sm:h-20 text-light/80 " >
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6.827 6.175A2.31 2.31 0 0 1 5.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 0 0-1.134-.175 2.31 2.31 0 0 1-1.64-1.055l-.822-1.316a2.192 2.192 0 0 0-1.736-1.039 48.774 48.774 0 0 0-5.232 0 2.192 2.192 0 0 0-1.736 1.039l-.821 1.316Z" />
                            <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 12.75a4.5 4.5 0 1 1-9 0 4.5 4.5 0 0 1 9 0ZM18.75 10.5h.008v.008h-.008V10.5Z" />
                        </svg>
                        <h1 className='w-[350px] leading-relaxed text-center'>You haven&apos;t Saved any posts.</h1>
                    </Link>
                )}
            </div>
        </div>
    )
}
