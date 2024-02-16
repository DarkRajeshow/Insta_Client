import Cookies from 'js-cookie';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import FollowButton from './FollowButton';

export default function UserSearchCard({ user }) {

    const currentlyLoggedUser = Cookies.get("userId");

    return (
        <div key={user.username} className="flex items-center justify-between fade-in-5 animate-in p-4 rounded-full bg-zinc-700/15">
            <Link to={`/user/${user.username}`} className="outline-none">
                <div className="text-white flex items-center gap-4">
                    <div className="image w-[60px] h-[60px] rounded-full bg-sky-100 border border-zinc-600">
                        <img
                            className="h-full w-full object-cover rounded-full"
                            src={`/api/uploads/${user.dp}`}
                            alt={`${user.username}'s profile picture`}
                        />
                    </div>
                    <div className="text flex flex-col gap-1">
                        <h3 className='text-xl'>{user.username}</h3>
                        <h4 className="text-xs opacity-30 leading-none">{user.name}</h4>
                    </div>
                </div>
            </Link>
            <div className='select-none'>
                {
                    user._id === currentlyLoggedUser ? (
                        <button className="bg-zinc-700/70 px-4 py-3 rounded-full flex text-gray-300 items-center justify-center gap-1 transition-all">
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