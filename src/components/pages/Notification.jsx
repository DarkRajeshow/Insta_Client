import { useCallback, useContext, useEffect, useState } from 'react';
import PropTypes from 'prop-types'
import { allNotificationsAPI, clearNotificationsAPI, notificationsReadAPI } from '../../utility/apiUtils';
import SmartLoader from '../reusable/SmartLoader';
import { toast } from 'sonner';
import { Context } from '../../context/Store';
import NotificationCell from '../reusable/NotificationCell';

const NotificationsPage = ({ userId }) => {

  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);
  const { fetchUnReadNotifications } = useContext(Context);

  const fetchNotifications = useCallback((async () => {
    setLoading(true);
    try {
      const { data } = await allNotificationsAPI();

      if (data.success) {
        setNotifications(data.notifications)
      }
    } catch (error) {
      console.log(error);
    }
    setLoading(false);
  }), []);

  const clearAllNotifications = async () => {
    setLoading(true);
    try {
      const { data } = await clearNotificationsAPI();

      if (data.success) {
        toast.success(data.status);
        setNotifications([]);
      }
    } catch (error) {
      console.log(error);
    }
    setLoading(false);
  };

  const markNotificationsAsRead = useCallback(async (notificationIds) => {
    try {
      const { data } = await notificationsReadAPI(notificationIds);
      if (data.success) {
        await fetchUnReadNotifications(userId);
      }
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  }, [fetchUnReadNotifications, userId]);

  useEffect(() => {
    const unReadNotificationIds = notifications.filter(notification => !notification.read).map(notification => notification._id);
    markNotificationsAsRead(unReadNotificationIds);
  }, [notifications, markNotificationsAsRead]);

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications])
  return (

    <>
      <div className='flex gap-1.5 mb-4 items-center justify-between my-5 px-2'>
        <h1 className="text-2xl font-bold">Notifications</h1>
        <button disabled={notifications.length === 0} onClick={clearAllNotifications} className={` ${notifications.length === 0 && "text-gray-500 hover:text-gray-500 hover:no-underline"}text-red-300 hover:text-red-500`}>Clear all</button>
      </div>
      <div className="mt-1 h-[78%] overflow-auto px-2">
        {
          !loading && notifications.map((notification) => {

            return (
              <NotificationCell notification={notification} key={notification._id} />
            )
          })
        }
        {
          loading && (
            <SmartLoader className='h-full' />
          )
        }
        {
          !loading && notifications.length === 0 && (
            <div className='text-lg text-gray-200 font-semibold text-center flex items-center justify-center h-full'>
              <p>No notifications.</p>
            </div>
          )
        }
      </div>
    </>
  );
};

NotificationsPage.propTypes = {
  fetchUnReadNotifications: PropTypes.func.isRequired,
  userId: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.bool,
  ]).isRequired,
};

export default NotificationsPage;
