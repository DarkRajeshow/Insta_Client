import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

const UserInfo = ({ user, currentLoggedUserId }) => {
    return (
        <Link to={`/user/${user.username}`} className="follow bottom-0 py-3 pl-2 flex items-center gap-2 hover:bg-zinc-800 bg-zinc-800/50 rounded-lg my-1 transition-all" key={user._id}>
            <img src={`/api/uploads/${user.dp}`} className="h-10 w-10 rounded-full" alt={user.name} />
            <div className="flex flex-col text-light/90">
                <h3 className="text-sm text-zinc-300">{currentLoggedUserId === user._id ? "You" : user.name}</h3>
                <p className="text-xs">@{user.username}</p>
            </div>
        </Link>
    );
};

UserInfo.propTypes = {
    user: PropTypes.shape({
        _id: PropTypes.string.isRequired,
        dp: PropTypes.string.isRequired,
        name: PropTypes.string.isRequired,
        username: PropTypes.string.isRequired,
    }).isRequired,
    currentLoggedUserId: PropTypes.string.isRequired
};

export default UserInfo;
