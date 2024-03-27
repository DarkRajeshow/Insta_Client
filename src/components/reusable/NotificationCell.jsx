import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import filePath from '../../assets/filePath';
import getTimePassed from '../../utility/findTimePassed';
import { DialogClose } from '../ui/dialog';

const NotificationCell = ({ notification }) => {

    const notificationType = notification.type;
    return (
        <>
            <Link to={`${notificationType === "message" ? `/messages/${notification.relatedUser._id}` : "/posts"}`} className=''>
                <DialogClose className='flex items-center hover:bg-zinc-800 bg-zinc-800/20 rounded-lg my-1 justify-between w-full py-3 px-2 relative  cursor-pointer'>
                    <div className="follow bottom-0 flex items-center gap-2 transition-all">
                        <img src={`${filePath}/${notification.relatedUser.dp}`} className="h-12 w-12 rounded-full border object-cover border-zinc-700" alt={notification.relatedUser.name} />
                        <div className="flex flex-col text-left text-light">
                            <p className="capitalize text-sm font-semibold">{notification.message.length > 20 ? notification.message.slice(0, 20) + "..." : notification.message}</p>
                            <p className="text-xs text-zinc-400">Message from {notification.relatedUser.name}</p>
                        </div>
                    </div>
                    <div className='flex flex-col h-full gap-3 justify-between items-end'>
                        <p className={`text-xs font-medium ${notification.read ? "text-zinc-400" : "text-blue-400"}`}>{!notification.read ? 'New' : "Viewed"}</p>
                        <p className="text-xs font-medium text-zinc-400">{getTimePassed(notification.timestamp)}</p>
                    </div>
                </DialogClose>
            </Link>
        </>
    );
};

NotificationCell.propTypes = {
    notification: PropTypes.shape({
        type: PropTypes.string.isRequired,
        message: PropTypes.string.isRequired,
        read: PropTypes.bool.isRequired,
        timestamp: PropTypes.string.isRequired,
        relatedUser: PropTypes.shape({
            _id: PropTypes.string.isRequired,
            dp: PropTypes.string.isRequired,
            name: PropTypes.string.isRequired
        }).isRequired
    }).isRequired
};

export default NotificationCell;
