import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import FollowButton from './FollowButton';
import filePath from '../../assets/filePath';
import { useEffect, useState } from 'react';
import { getUserId } from '../../utility/apiUtils';

export default function UserSearchCard({ user }) {

    const [currentlyLoggedUser, setCurrentlyLoggedUser] = useState(false);

    const findUserId = async () => {
        const currentlyLoggedUserStatus = await getUserId();
        setCurrentlyLoggedUser(currentlyLoggedUserStatus)
    }

    useEffect(() => {
        findUserId();
    }, [])

    return (
        <div key={user.username} className="flex items-center justify-between fade-in-5 animate-in p-2 pr-3 sm:p-4 rounded-full bg-zinc-700/15">
            <Link to={`/user/${user.username}`} className="outline-none">
                <div className="text-white flex items-center gap-3 sm:gap-4">
                    <div className="image w-14 h-14 sm:w-[60px] sm:h-[60px] rounded-full bg-sky-100 border border-zinc-600">
                        <img
                            className="h-full w-full object-cover rounded-full"
                            src={`${filePath}/${user.dp}`}
                            alt={`${user.username}'s profile picture`}
                        />
                    </div>
                    <div className="text flex flex-col gap-1">
                        <h3 className='text-base sm:text-xl'>{user.username}</h3>
                        <h4 className="text-xs opacity-30 leading-none">{user.name}</h4>
                    </div>
                </div>
            </Link>
            <div className='select-none'>
                {
                    user._id === currentlyLoggedUser ? (
                        <button className="bg-zinc-700/70 text-sm sm:text-base px-3 py-2 sm:px-4 sm:py-3 rounded-full flex text-gray-300 items-center justify-center gap-1 transition-all">
                            You
                        </button>
                    ) : (
                        <FollowButton size='big' initialFollowStatus={user.followers.indexOf(currentlyLoggedUser) >= 0} userToFollow={user._id} />
                    )
                }
            </div>
        </div>
    )
}

UserSearchCard.propTypes = {
    user: PropTypes.shape({
        _id: PropTypes.string.isRequired,
        username: PropTypes.string.isRequired,
        name: PropTypes.string.isRequired,
        dp: PropTypes.string.isRequired,
        followers: PropTypes.arrayOf(PropTypes.string).isRequired,
    }).isRequired,
};