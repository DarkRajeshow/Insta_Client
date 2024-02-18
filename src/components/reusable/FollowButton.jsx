import PropTypes from 'prop-types';
import { useState } from 'react';
import { useContext } from 'react'
import { Context } from '../../context/Store';


export default function FollowButton({ size, userToFollow, fetchLoggedUser, initialFollowStatus }) {
    const [loading, setLoading] = useState(false);
    const [isFollowing, setIsFollowing] = useState(initialFollowStatus);
    const { toggleFollow } = useContext(Context);

    return (
        <button onClick={async () => {
            setLoading(true);
            const success = await toggleFollow(userToFollow)
            if (success) {
                setIsFollowing(!isFollowing);
            }
            setLoading(false);
            if (fetchLoggedUser) {
                fetchLoggedUser();
            }
        }} className={`bg-zinc-800 px-4 py-1.5 rounded-full flex text-gray-300 items-center justify-center gap-1 transition-all hover:bg-blue-700 ${size === "big" ? "py-2" : "text-sm"}`}>
            {
                loading && <span className='h-4 w-4 rounded-full border-[3px] border-light/70 border-t-transparent spin' />
            }

            {isFollowing ? "Unfollow" : "Follow"}
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                <path strokeLinecap="round" strokeLinejoin="round" d="M18 7.5v3m0 0v3m0-3h3m-3 0h-3m-2.25-4.125a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0ZM3 19.235v-.11a6.375 6.375 0 0 1 12.75 0v.109A12.318 12.318 0 0 1 9.374 21c-2.331 0-4.512-.645-6.374-1.766Z" />
            </svg>
        </button>
    )
}

FollowButton.propTypes = {
    size: PropTypes.string,
    userToFollow: PropTypes.string.isRequired,
    initialFollowStatus: PropTypes.bool.isRequired,
    fetchLoggedUser: PropTypes.func
};

