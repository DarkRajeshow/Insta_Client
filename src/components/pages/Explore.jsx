import { useCallback, useEffect } from "react";
import { useState } from "react";
import InfiniteScroll from 'react-infinite-scroll-component';
import { Skeleton } from "../ui/skeleton";
import ExplorePost from "../reusable/ExplorePost";
import { exporeDataAPI, getUserId, searchPostsAPI } from "../../utility/apiUtils";

export default function Explore() {

    const [explorePosts, setExplorePosts] = useState([]);
    const [offset, setOffset] = useState(0);
    const [hasMore, setHasMore] = useState(true);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [searchLoading, setSearchLoading] = useState(false);

    const [currentlyLoggedUser, setCurrentlyLoggedUser] = useState(false);

    const findUserId = async () => {
        const userIdStatus = await getUserId();
        setCurrentlyLoggedUser(userIdStatus)
    }

    useEffect(() => {
        findUserId();
    }, [])



    const fetchExplorePosts = useCallback(async () => {
        try {
            const { data } = await exporeDataAPI(offset);

            if (data.success) {
                if (data.explore.length === 0) {
                    setHasMore(false);
                }
                else {
                    if (offset === 0) {
                        setExplorePosts(data.explore)
                        setLoading(false);
                        return;
                    }
                    setExplorePosts([...explorePosts, ...data.explore]);
                    setOffset(offset + 1);
                }
            }
        } catch (error) {
            console.error(error);
        }
        setLoading(false);
    }, [offset, explorePosts])


    const searchPosts = useCallback(async () => {
        setSearchLoading(true);
        setOffset(0);
        if (searchQuery === "") {
            fetchExplorePosts();
            return;
        }
        try {
            const { data } = await searchPostsAPI(searchQuery);
            if (data.success) {
                setExplorePosts(data.explore);
                setHasMore(false);
            }
        } catch (error) {
            console.error(error);
        }
        setSearchLoading(false);
    }, [fetchExplorePosts, searchQuery])


    useEffect(() => {
        if (searchQuery === "") {
            fetchExplorePosts();
        }
        else {
            searchPosts();
        }
    }, [searchQuery])

    return (
        <div className="w-full min-h-screen bg-zinc-900 text-white my-6">
            <div className='px-6 max-w-[600px] m-auto'>
                <div className="bg-zinc-800 flex sm:text-xl items-center justify-between rounded-full py-3 px-5 sm:py-4 sm:px-5 gap-1">
                    <i className="text-white ri-search-line text-xl sm:text-2xl"></i>
                    <input
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        autoCapitalize="false"
                        autoComplete="off"
                        id="searchInput"
                        className="ml-1 w-full bg-transparent outline-none text-light placeholder:text-zinc-600"
                        type="text"
                        placeholder="Search with username, name"
                    />
                    {searchLoading &&
                        <i className="ri-refresh-line animate-spin sm:text-2xl text-blue-300"></i>}
                </div>
            </div>
            <div className="explorePosts mb-20 m-auto">
                <InfiniteScroll
                    className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-1 my-10 py-4 text-center border-t border-t-gray-800 mx-6 overflow-hidden"
                    dataLength={explorePosts.length}
                    next={fetchExplorePosts}
                    hasMore={hasMore}
                >
                    {explorePosts.map((post, index) => (
                        <ExplorePost post={post} index={index} key={post._id} userId={currentlyLoggedUser} />
                    ))}
                    {
                        loading &&
                        <>
                            <Skeleton className={`aspect-square`} />
                            <Skeleton className={`aspect-square`} />
                            <Skeleton className={`aspect-square`} />
                            <Skeleton className={`aspect-square`} />
                            <Skeleton className={`aspect-square`} />
                            <Skeleton className={`aspect-square`} />
                            <Skeleton className={`aspect-square`} />
                            <Skeleton className={`aspect-square`} />
                        </>
                    }
                </InfiniteScroll>

                {!loading && explorePosts.length === 0 && searchQuery === "" && (
                    <div className="cursor-pointer w-[70%] m-auto flex flex-col gap-3 items-center justify-center font-bold text-light text-3xl bg-zinc-800/20 min-h-[50vh] rounded-lgs">
                        <i className="ri-signal-wifi-error-line text-light/80 "></i>
                        <h1 className='w-[300px] text-center'>Something went wrong.</h1>
                    </div>
                )}

                {!loading && explorePosts.length === 0 && searchQuery !== "" && (
                    <div className="cursor-pointer w-[70%] m-auto flex flex-col gap-5 items-center justify-center font-bold text-light text-3xl bg-zinc-800/20 min-h-[50vh] rounded-lg">
                        <span className="text-6xl">😔</span>
                        <h1 className='w-[300px] text-center'>No result found.</h1>
                    </div>
                )

                }
            </div>
        </div>
    )
}
