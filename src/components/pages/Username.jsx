import { Link, useLocation, useNavigate, useParams } from 'react-router-dom'
import { useCallback, useContext, useEffect, useState } from 'react';
import { toast } from 'sonner';
import PostCard from '../reusable/PostCard'
import Profile from './Profile'
import Page404 from '../special/Page404'
import SmartLoader from '../reusable/SmartLoader';
import {
    Dialog,
    DialogContent,
    DialogTrigger,
} from "@/components/ui/dialog"
import filePath from '../../assets/filePath';
import { Context } from '../../context/Store';
import { getUserId, showFollowsAPI, toggleFollowAPI, userByUsernameAPI } from '../../utility/apiUtils';
import FollowButton from '../reusable/FollowButton';


const Username = () => {

    const location = useLocation();

    const { username } = useParams();

    const navigate = useNavigate();


    const [userId, setUserId] = useState(false);

    const findUserId = async () => {
        const userIdStatus = await getUserId();
        console.log(userIdStatus);
        setUserId(userIdStatus)
    }

    useEffect(() => {
        findUserId();
    }, [])

    const [followData, setFollowData] = useState([]);
    const [followTitle, setfollowTitle] = useState("");
    const [followLoading, setFollowLoading] = useState(false);
    const [followUsers, setFollowUsers] = useState(followData);
    const [loading, setLoading] = useState(false);
    const [query, setQuery] = useState("");

    const [userNotExists, setUserNotExists] = useState(false);

    const { setSelectedUserForChat } = useContext(Context);

    const [user, setUser] = useState({
        _id: "",
        username: '',
        email: '',
        password: '',
        name: '',
        bio: 'Hey, I am using Instagram!',
        dp: '',
        followers: [],
        following: [],
        posts: [],
        liked: [],
        saved: [],
        comments: []
    })


    const SearchUsers = useCallback(
        (follow) => {
            if (!follow) {
                return;

            }
            const searchResult = followData.filter((user) => {
                const reqEx = new RegExp(query, "i");
                return reqEx.test(user.name) || reqEx.test(user.username);
            });
            setFollowUsers(searchResult);
        }, [followData, query]);


    useEffect(() => {
        SearchUsers(followTitle.toLocaleLowerCase());
    }, [SearchUsers, followTitle]);


    const fetchWithUsername = useCallback((async () => {
        setLoading(true);
        try {
            const { data } = await userByUsernameAPI(username);

            if (data.success) {
                setUser(data.user)
            }

            else {
                setUserNotExists(true);
            }

        } catch (error) {
            console.log(error);
        }
        setLoading(false);
    }), [username]);

    const toggleFollow = async () => {
        console.log(userId);
        if (!userId) {
            toast.error("Login to continue");
            navigate(`/login?callback=${location.pathname}`)
            return;
        }

        try {
            const { data } = await toggleFollowAPI(user._id);

            console.log(data);
            if (data.success) {
                toast.success(data.status);
                await fetchWithUsername();
            }
            else {
                toast.error(data.status)
                navigate(`/login?callback=${location.pathname}`)
            }
        } catch (error) {
            console.log(error);
            toast.error("Something went wrong....")
        }
    }

    const showFollows = async (route) => {
        setFollowLoading(true);

        try {
            const { data } = await showFollowsAPI(route, user._id);

            if (data.success) {
                setFollowData(data.users)
            }

            else {
                toast.error("Something went wrong.");
            }

        } catch (error) {
            console.log(error);
            toast.error("Client error.");
        }

        setFollowLoading(false);
    }


    const openMessage = () => {
        setSelectedUserForChat(user);
        navigate("/messages");
    }

    useEffect(() => {
        fetchWithUsername();
    }, [username, fetchWithUsername])



    if (userNotExists) {
        return (
            <Page404 />
        )
    }

    if (userId === user._id) {
        return (
            <Profile />
        )
    }


    return (

        <Dialog >
            <DialogContent className="h-[65vh] w-[450px] bg-dark text-light border-none block">
                <div className='flex flex-col gap-1.5 mb-4'>
                    <h1 className="text-2xl font-bold">{followTitle}</h1>
                    <div className="search flex text-xs sm:text-sm text-light items-center gap-2 px-2 border border-light/10 focus-within:border-light/30  rounded-sm focus-within:border-b-green-400">
                        <i className="ri-search-line py-2"></i>
                        <input
                            value={query}
                            onChange={(e) => {
                                setQuery(e.target.value);
                            }}
                            type="text"
                            className="py-2 bg-transparent w-[90%] focus:outline-none outline-none"
                            placeholder="Search user"
                        />
                    </div>
                </div>
                <div className="mt-1 h-[90%]">
                    {
                        !followLoading && followData && followUsers.map((User) => {

                            const initialFollowStatus = userId ? User.followers.indexOf(userId) !== -1 : false;

                            return (
                                <div key={User._id} className='flex items-center hover:bg-zinc-800 bg-zinc-800/50 rounded-lg my-1 justify-between w-full py-3 px-2'>
                                    <Link to={`/user/${User.username}`} className="follow bottom-0 flex items-center gap-3 transition-all">
                                        <img src={`${filePath}/${User.dp}`} className="h-12 w-12 rounded-full border border-zinc-700" alt={User.name} />
                                        <div className="flex flex-col text-light">
                                            <h3 className="text-base font-semibold">{User.name}</h3>
                                            <p className="text-sm font-semibold">@{User.username}</p>
                                        </div>
                                    </Link>

                                    {User._id === userId ? (
                                        <button className='bg-zinc-800 px-4 py-1.5 rounded-full flex text-gray-300 items-center justify-center gap-1 transition-all hover:bg-blue-700'>You</button>
                                    ) :
                                        (
                                            <FollowButton fetchLoggedUser={fetchWithUsername} initialFollowStatus={initialFollowStatus} userToFollow={User._id} />
                                        )}

                                </div>

                            )
                        })
                    }
                    {
                        followLoading && (
                            <SmartLoader className='h-full' />
                        )
                    }
                    {
                        !followLoading && followData.length === 0 && (
                            <div className='text-lg text-gray-200 font-semibold text-center flex items-center justify-center h-full'>
                                <p>0 {followTitle}.</p>
                            </div>
                        )
                    }
                </div>
            </DialogContent>

            <div className="w-full min-h-screen bg-zinc-900 text-white py-5 ">
                <div className="nav flex justify-between items-center px-6">
                    <h3 className="text-lg">{user.username}</h3>
                </div>
                <div className="flex items-center pl-6 pr-[12vw] mt-8 gap-20">
                    <div className="w-[12vw] h-[12vw] bg-sky-100 rounded-full">
                        <img
                            className="h-full w-full border border-light object-cover rounded-full"
                            src={user.dp ? `${filePath}/${user.dp}` : ""}
                            alt={`${user.username}'s profile picture`}
                        />
                    </div>
                    <div className="stats font-semibold text-lg grid grid-cols-3 gap-2 items-center justify-between ">
                        <a href={'#posts'}
                            className="flex bg-zinc-800/20 flex-col items-center justify-center hover:bg-zinc-800 p-3 rounded-lg cursor-pointer transition-all">
                            <h3>{user.posts?.length}</h3>
                            <h4>Posts</h4>
                        </a>
                        <DialogTrigger onClick={() => {
                            setfollowTitle("Followers")
                            showFollows("followers");
                        }} className="flex flex-col items-center justify-center bg-zinc-800/20 hover:bg-zinc-800 p-3 rounded-lg cursor-pointer transition-all">
                            <h3>{user.followers?.length}</h3>
                            <h4>Followers</h4>
                        </DialogTrigger>
                        <DialogTrigger onClick={() => {
                            setfollowTitle("Following")
                            showFollows("following");
                        }} className="flex flex-col items-center justify-center bg-zinc-800/20 hover:bg-zinc-800 p-3 rounded-lg cursor-pointer transition-all">
                            <h3>{user.following?.length}</h3>
                            <h4>Following</h4>
                        </DialogTrigger>
                    </div>
                </div>
                <div className="dets px-6 mt-5">
                    <h3 className="text-lg mb-1">{user.name}</h3>
                    <p className="text-xs tracking-tight opacity-50">{user.bio}</p>
                </div>

                <div className='flex items-center justify-between mt-5 px-6'>
                    <div className="flex items-center justify-start gap-3">
                        <button onClick={openMessage} className="px-3 py-2 bg-zinc-800 rounded-md flex items-center justify-center gap-3 hover:bg-zinc-700 transition-all">
                            Message
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 9.75a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H8.25m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H12m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0h-.375m-13.5 3.01c0 1.6 1.123 2.994 2.707 3.227 1.087.16 2.185.283 3.293.369V21l4.184-4.183a1.14 1.14 0 0 1 .778-.332 48.294 48.294 0 0 0 5.83-.498c1.585-.233 2.708-1.626 2.708-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0 0 12 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018Z" />
                            </svg>
                        </button>
                        <button onClick={toggleFollow} className="bg-blue-600 px-3 py-2 rounded-md flex items-center justify-center gap-3 transition-all hover:bg-blue-700">
                            {
                                user.followers.indexOf(userId) >= 0 ? "Following" : "Follow"
                            }
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M18 7.5v3m0 0v3m0-3h3m-3 0h-3m-2.25-4.125a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0ZM3 19.235v-.11a6.375 6.375 0 0 1 12.75 0v.109A12.318 12.318 0 0 1 9.374 21c-2.331 0-4.512-.645-6.374-1.766Z" />
                            </svg>
                        </button>
                    </div>
                    <div className="flex items-center justify-center gap-5 ">
                        <button onClick={() => {
                            window.history.back();
                        }} className='bg-dark hover:bg-zinc-800 text-light font-bold px-3 py-2 rounded-md flex items-center gap-2'>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M9 15 3 9m0 0 6-6M3 9h12a6 6 0 0 1 0 12h-3" />
                            </svg>
                            Back
                        </button>
                        <Link to={"/"} className='bg-light text-black font-bold px-3 py-2 rounded-md flex items-center gap-2'>
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                                <path d="M11.47 3.841a.75.75 0 0 1 1.06 0l8.69 8.69a.75.75 0 1 0 1.06-1.061l-8.689-8.69a2.25 2.25 0 0 0-3.182 0l-8.69 8.69a.75.75 0 1 0 1.061 1.06l8.69-8.689Z" />
                                <path d="m12 5.432 8.159 8.159c.03.03.06.058.091.086v6.198c0 1.035-.84 1.875-1.875 1.875H15a.75.75 0 0 1-.75-.75v-4.5a.75.75 0 0 0-.75-.75h-3a.75.75 0 0 0-.75.75V21a.75.75 0 0 1-.75.75H5.625a1.875 1.875 0 0 1-1.875-1.875v-6.198a2.29 2.29 0 0 0 .091-.086L12 5.432Z" />
                            </svg>
                            Home
                        </Link>
                    </div>
                </div>

                <div id='followStatus'>

                    {((user.followers.indexOf(userId) >= 0 && (user.following.indexOf(userId)) >= 0))
                        ?
                        <div className="px-6 flex items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 text-blue-400">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M13.19 8.688a4.5 4.5 0 0 1 1.242 7.244l-4.5 4.5a4.5 4.5 0 0 1-6.364-6.364l1.757-1.757m13.35-.622 1.757-1.757a4.5 4.5 0 0 0-6.364-6.364l-4.5 4.5a4.5 4.5 0 0 0 1.242 7.244" />
                            </svg>
                            <h3 className='text-sm my-4 mx-1 text-zinc-300'>{user.name} and you both are following each other.</h3>
                        </div>
                        :
                        user.following.indexOf(userId) >= 0
                            ? <div className="px-6 flex items-center">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 text-blue-400">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.19 8.688a4.5 4.5 0 0 1 1.242 7.244l-4.5 4.5a4.5 4.5 0 0 1-6.364-6.364l1.757-1.757m13.35-.622 1.757-1.757a4.5 4.5 0 0 0-6.364-6.364l-4.5 4.5a4.5 4.5 0 0 0 1.242 7.244" />
                                </svg>
                                <h3 className='text-sm my-4 mx-1 text-zinc-300'>{user.name} is following you.</h3>
                            </div>
                            : ""
                    }

                </div>

                <div id='posts' className="posts relative min-h-screen grid grid-cols-3 gap-1 my-10 py-4 text-center border-t-2 border-t-zinc-700 mx-6">
                    {!loading && user.posts.map((post, index) => (
                        <PostCard post={post} index={index} key={index} saved={user.saved} userId={userId} />
                    ))}
                    {!loading && user.posts.length === 0 && (
                        <div className="absolute h-full w-full rounded-3xl my-3 bg-zinc-800/40 cursor-pointer flex flex-col gap-3 items-center justify-center font-bold text-light text-3xl ">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={0.5} stroke="currentColor" className="w-10 sm:w-20 h-10 sm:h-20 text-light/80 " >
                                <path strokeLinecap="round" strokeLinejoin="round" d="M6.827 6.175A2.31 2.31 0 0 1 5.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 0 0-1.134-.175 2.31 2.31 0 0 1-1.64-1.055l-.822-1.316a2.192 2.192 0 0 0-1.736-1.039 48.774 48.774 0 0 0-5.232 0 2.192 2.192 0 0 0-1.736 1.039l-.821 1.316Z" />
                                <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 12.75a4.5 4.5 0 1 1-9 0 4.5 4.5 0 0 1 9 0ZM18.75 10.5h.008v.008h-.008V10.5Z" />
                            </svg>
                            <h1 className='w-60 leading-relaxed text-center'>No posts uploaded yet.</h1>
                        </div>
                    )}
                </div>

            </div>
        </Dialog >
    );
};

export default Username;
