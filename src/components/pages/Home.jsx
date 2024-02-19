import { useEffect } from "react";
import { useState } from "react";
import { toast } from "sonner";
import SmartLoader from "../reusable/SmartLoader";
import InfiniteScroll from 'react-infinite-scroll-component';
import FeedPost from "../reusable/FeedPost";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import api from '../../assets/api'

export default function Home() {

  const [feedPosts, setFeedPosts] = useState([]);
  const [offset, setOffset] = useState(0);
  const [hasMore, setHasMore] = useState(true)
  const currentlyLoggedUser = Cookies.get("userId");

  // it contains all the users following status 
  const [following, setFollowing] = useState({});
  const navigate = useNavigate();


  const fetchFeedPosts = async () => {

    try {
      const { data } = await api.get(`/api/feed/${offset}`);

      if (data.success) {
        if (data.feed.length === 0) {
          setHasMore(false);
        }
        else {
          setFeedPosts([...feedPosts, ...data.feed]);
          setOffset(offset + 1);
        }
      } else {
        toast.error(data.status);
      }

    } catch (error) {
      console.error(error);
    }
  }

  const toggleFollow = async (userIdToFollow) => {
    if (!currentlyLoggedUser) {
      toast.error("Login to continue");
      navigate(`/login?callback=${location.pathname}`)
      return;
    }

    try {
      const { data } = await api.put(`/api/toggle-follow`, { userIdToFollow });

      if (data.success) {
        toast.success(data.status);
        setFollowing(prevState => ({
          ...prevState,
          [userIdToFollow]: !prevState[userIdToFollow]
        }));
      }
      else {
        toast.error(data.status)
        navigate(`/login?callback=${location.pathname}`)
      }
    } catch (error) {
      toast.error("Something went wrong....")
    }
  }

  useEffect(() => {
    const initialFollowingState = {};
    feedPosts.forEach(post => {
      initialFollowingState[post.author._id] = post.author.followers.indexOf(currentlyLoggedUser) >= 0;
    });
    setFollowing(initialFollowingState);
  }, [feedPosts, currentlyLoggedUser]);

  useEffect(() => {
    fetchFeedPosts();
  }, [])

  return (
    <div className="w-full min-h-screen bg-zinc-900 text-white">
      <div className="story px-3 flex gap-3 overflow-auto mt-5">
        {/* Your story circles go here */}
      </div>
      <div className="feedPosts mb-20 w-[500px] m-auto">
        <InfiniteScroll
          dataLength={feedPosts.length}
          next={fetchFeedPosts}
          hasMore={hasMore}
          loader={<SmartLoader className="h-[50vh]" />}
          endMessage={
            <div className="text-center">
              Yay!! you reached to the end.
            </div>
          }
        >
          {feedPosts.map((post, index) => (
            <FeedPost key={post._id + index} toggleFollow={toggleFollow} following={following[post.author._id] === undefined ? false : following[post.author._id]} initialPost={post} />
          ))}
        </InfiniteScroll>
      </div>
    </div>
  )
}
