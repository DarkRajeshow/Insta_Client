import PropTypes from 'prop-types';
import { Link } from "react-router-dom"
import { Skeleton } from "@/components/ui/skeleton"
import { useEffect, useState } from 'react';
import filePath from '../../assets/filePath';

export default function ExplorePost({ post, index, userId }) {

    const [isVisible, setIsVisible] = useState(false);
    const [loading, setLoading] = useState(true);

    const onLoad = () => {
        setLoading(false);
    }

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsVisible(true);
        }, index * 75)

        return () => clearTimeout(timer)
    }, [index])


    return (
        <Link to={`/post/${post._id}`} key={index} className={`relative aspect-square post bg-gray-900 rounded-sm group cursor-pointer flex items-center justify-center ${isVisible && !loading ? `visible animate-in fade-in-5` : "invisible"}`}
        >
            {post.type === "video" ?
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 sm:w-8 h-6 sm:h-8 text-light absolute top-4 right-4 z-40">
                    <path strokeLinecap="round" strokeLinejoin="round" d="m15.75 10.5 4.72-4.72a.75.75 0 0 1 1.28.53v11.38a.75.75 0 0 1-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 0 0 2.25-2.25v-9a2.25 2.25 0 0 0-2.25-2.25h-9A2.25 2.25 0 0 0 2.25 7.5v9a2.25 2.25 0 0 0 2.25 2.25Z" />
                </svg>
                :
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 sm:w-8 h-6 sm:h-8 text-light absolute top-4 right-4 z-40">
                    <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Zm10.5-11.25h.008v.008h-.008V8.25Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
                </svg>
            }
            <Skeleton className={`h-full w-full aspect-square rounded-lg ${isVisible ? "hidden" : ""}`} />
            {post.type === "video" ? (
                <video
                    onMouseEnter={(e) => {
                        e.target.play();
                    }}
                    onMouseLeave={(e) => {
                        e.target.pause();
                    }}
                    onLoadedData={onLoad}
                    id="video"
                    className={`h-full w-full rounded-lg group-hover:opacity-30 object-cover z-20 ${loading ? "opacity-0" : ""}`}
                    alt="Post"
                    muted
                    playsInline
                >
                    <source src={post.media && `${filePath}/${post.media}`} type="video/mp4" />
                </video>
            ) : (
                <img
                    onLoad={onLoad}
                    className={`w-full rounded-lg group-hover:opacity-30 h-full object-cover transition-all ${loading ? "opacity-0" : ""}`}
                    src={post.media && `${filePath}/${post.media}`}
                    alt={`post ${index + 1}`}
                />
            )}



            <div className='absolute top-1/2 left-1/2 flex gap-2 opacity-0 group-hover:opacity-100 transition-all -translate-x-1/2 -translate-y-1/2'>
                <div className="likes flex items-center flex-col justify-center ">
                    {(userId && (post.likes.indexOf(userId) >= 0)) ?
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8 cursor-pointer text-red-500">
                            <path d="m11.645 20.91-.007-.003-.022-.012a15.247 15.247 0 0 1-.383-.218 25.18 25.18 0 0 1-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0 1 12 5.052 5.5 5.5 0 0 1 16.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 0 1-4.244 3.17 15.247 15.247 0 0 1-.383.219l-.022.012-.007.004-.003.001a.752.752 0 0 1-.704 0l-.003-.001Z" />
                        </svg>
                        :
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 cursor-pointer">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" />
                        </svg>
                    }
                    <span className="my-0">{post.likes.length}</span>
                </div>
                <div className="likes flex items-center flex-col justify-center ">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 cursor-pointer">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 12a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H8.25m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H12m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 0 1-2.555-.337A5.972 5.972 0 0 1 5.41 20.97a5.969 5.969 0 0 1-.474-.065 4.48 4.48 0 0 0 .978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25Z" />
                    </svg>
                    <span className="my-0">{post.comments.length}</span>
                </div>
            </div>
        </Link>
    )
}


ExplorePost.propTypes = {
    post: PropTypes.shape({
        _id: PropTypes.string.isRequired,
        type: PropTypes.string.isRequired,
        media: PropTypes.string.isRequired,
        caption: PropTypes.string.isRequired,
        likes: PropTypes.array.isRequired,
        comments: PropTypes.array.isRequired,
    }).isRequired,
    index: PropTypes.number.isRequired,
    userId: PropTypes.string.isRequired
};