import { Link } from 'react-router-dom'
import { useCallback, useContext, useEffect, useState } from 'react';
import { toast } from 'sonner';
import PostCard from '../reusable/PostCard'
import { Context } from '../../context/Store';
import {
    Dialog,
    DialogContent,
    DialogTrigger,
} from "@/components/ui/dialog"
import SmartLoader from '../reusable/SmartLoader';
import FollowButton from '../reusable/FollowButton';
import filePath from '../../assets/filePath';
import { showFollowsAPI, userDataAPI } from '../../utility/apiUtils';

const Profile = () => {
    
    const [followData, setFollowData] = useState([]);
    const [followTitle, setfollowTitle] = useState("");
    const [followLoading, setFollowLoading] = useState(false);

    const { logOut } = useContext(Context);

    const [loading, setLoading] = useState(false);
    const [followUsers, setFollowUsers] = useState(followData);
    const [query, setQuery] = useState("");

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
        liked: []
    })

    const fetchLoggedUser = async () => {
        setLoading(true);
        try {
            const { data } = await userDataAPI(true);

            if (data.success) {
                setUser(data.user)
            }

        } catch (error) {
            console.log(error);
        }
        setLoading(false);
    }

    const showFollow = async (route) => {
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



    // for searching user within the following or followers dialog
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


    useEffect(() => {
        fetchLoggedUser();
    }, [])

    // fetchLoggedUser

    return (
        <Dialog className="">
            <DialogContent className="h-[65vh] rounded-md w-[95vw] sm:w-[450px] bg-dark text-light border-none block ">
                <div className='flex flex-col gap-1.5 mb-4'>
                    <h1 className="text-xl sm:text-2xl font-semibold sm:font-bold">{followTitle}</h1>
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

                            const initialFollowStatus = user.following.indexOf(User._id) !== -1

                            return (
                                <div key={User._id} className='flex items-center hover:bg-zinc-800 bg-zinc-800/50 rounded-lg my-1 justify-between w-full py-3 px-2'>
                                    <Link to={`/user/${User.username}`} className="follow bottom-0 flex items-center gap-3 transition-all">
                                        <img src={`${filePath}/${User.dp}`} className="h-10 w-10 sm:h-12 sm:w-12 rounded-full border border-zinc-700" alt={User.name} />
                                        <div className="flex flex-col text-light">
                                            <h3 className="text-sm sm:text-base capitalize sm:font-semibold">{User.name}</h3>
                                            <p className="text-xs sm:text-sm sm:font-semibold">@{User.username}</p>
                                        </div>
                                    </Link>
                                    <FollowButton fetchLoggedUser={fetchLoggedUser} initialFollowStatus={initialFollowStatus} userToFollow={User._id} />
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
                <div>
                    <h1 className='pl-6 text-lg capitalize'>{user.username}</h1>
                </div>
                <div className="flex flex-col sm:flex-row items-start sm:items-center pl-6 pr-[12vw] mt-8 gap-6 sm:gap-16 md:gap-20">
                    <div className="w-[120px] h-[120px] sm:w-[150px] sm:h-[150px] md:w-[200px] md:h-[200px] bg-sky-100 rounded-full">
                        <img
                            className="h-full w-full object-cover rounded-full border border-light"
                            src={user.dp && `${filePath}/${user.dp}`}
                            alt={`${user.username}'s profile picture`}
                        />
                    </div>
                    <div className="stats font-semibold text-lg grid grid-cols-3 gap-2 items-center justify-between ">
                        <a href={'#posts'}
                            className="flex bg-zinc-800/20 flex-col items-center justify-center hover:bg-zinc-800 p-3 rounded-lg cursor-pointer transition-all text-sm sm:text-xl">
                            <h3>{user.posts?.length}</h3>
                            <h4>Posts</h4>
                        </a>
                        <DialogTrigger onClick={() => {
                            setfollowTitle("Followers")
                            showFollow("followers");
                        }} className="flex flex-col items-center justify-center bg-zinc-800/20 hover:bg-zinc-800 p-3 rounded-lg cursor-pointer transition-all text-sm sm:text-xl">
                            <h3>{user.followers?.length}</h3>
                            <h4>Followers</h4>
                        </DialogTrigger>
                        <DialogTrigger onClick={() => {
                            setfollowTitle("Following")
                            showFollow("following");
                        }} className="flex flex-col items-center justify-center bg-zinc-800/20 hover:bg-zinc-800 p-3 rounded-lg cursor-pointer transition-all text-sm sm:text-xl">
                            <h3>{user.following?.length}</h3>
                            <h4>Following</h4>
                        </DialogTrigger>
                    </div>
                </div>
                <div className="dets px-6 mt-5">
                    <h3 className="text-lg mb-1 capitalize">{user.name}</h3>
                    <p className="text-xs tracking-tight opacity-50">{user.bio}</p>
                </div>

                <div className='flex flex-col sm:flex-row items-start sm:items-center justify-between mt-5 px-6'>
                    <div className="flex items-center justify-start gap-3">
                        <Link to="/edit" className="px-3 py-2 bg-zinc-800 rounded-md">Edit Profile
                        </Link>
                        <button onClick={logOut} className="bg-red-800 px-3 py-2 rounded-md">Log Out
                        </button>
                    </div>
                    <div className="hidden sm:flex items-center justify-center gap-5 ">
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

                <div id='posts' className="posts relative min-h-screen grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 my-10 py-4 text-center border-t-2 border-t-zinc-700 mx-6">
                    {!loading && user.posts.map((post, index) => (
                        <PostCard post={post} index={index} key={index} userId={user._id} />
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

export default Profile;
