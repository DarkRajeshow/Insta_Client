import { useContext, useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import PropTypes from 'prop-types';
import { BellRing, CircleUserRound, MessageCircle, UploadCloud } from "lucide-react";
import {
    Dialog,
    DialogContent,
    DialogTrigger,
} from "@/components/ui/dialog"
import NotificationsPage from "../pages/Notification";
import { Context } from "../../context/Store";
import { getUserId } from "../../utility/apiUtils";

export default function Navbar({ notShowNav }) {
    const [menuOpen, setMenuOpen] = useState(false);
    const location = useLocation();
    const { socket, fetchUnReadNotifications, fetchUnReadMessages, unReadMessages, unReadNotificationCount, logOut } = useContext(Context)
    const [userId, setUserId] = useState(false);

    const findUserId = async () => {
        const userIdStatus = await getUserId();
        setUserId(userIdStatus)
    }

    useEffect(() => {
        const closeMenuOnOutsideClick = (e) => {
            if (menuOpen && !e.target.closest('.icons')) {
                setMenuOpen(false);
            }
        };
        document.addEventListener('click', closeMenuOnOutsideClick);
        return () => {
            document.removeEventListener('click', closeMenuOnOutsideClick);
        };
    }, [menuOpen]);

    useEffect(() => {
        findUserId();
    }, [location.pathname]);

    useEffect(() => {
        if (userId) {
            fetchUnReadNotifications(userId);
            fetchUnReadMessages(userId);
        }
    }, [fetchUnReadNotifications, fetchUnReadMessages, userId, location.pathname])

    return (
        <Dialog>
            <nav className={`bg-zinc-900 z-50 sticky text-light pt-5 pb-3 sm:py-5 w-full top-0 select-none ${notShowNav && "hidden"}`}>
                <DialogContent className="h-[65vh] rounded-md w-[90vw] sm:w-[450px] bg-dark text-light border-none block overflow-y-auto">
                    <NotificationsPage userId={userId} fetchUnReadNotifications={fetchUnReadNotifications} />
                </DialogContent>
                <div className="nav flex justify-between items-center pl-5 pr-3 sm:px-6">
                    <Link to={"/"} className="flex content-center gap-2">
                        <img src="/logo.png" alt="Logo" className="h-10 mt-2" />
                        {socket && socket.id && <span className="bg-green-300 mt-2 h-1.5 w-1.5 border-blue-500 border rounded-full inline-block"></span>}
                    </Link>
                    <div className="relative icons flex gap-1">
                        <DialogTrigger className="sm:hidden flex items-center justify-center gap-1 hover:bg-zinc-700/20 py-2 rounded-md px-2.5 text-blue-300">
                            {unReadNotificationCount !== 0 && <p className=" font-semibold text-sm">{unReadNotificationCount}</p>}
                            <BellRing strokeWidth={1.5} className="" />
                        </DialogTrigger>

                        <div className="hidden sm:flex gap-1">
                            {!userId ? (
                                <>
                                    <Link to="/login">
                                        <button className="text-sm px-3 py-2 rounded-md bg-zinc-800/50 hover:bg-zinc-700">Login</button>
                                    </Link>
                                    <Link to="/signup">
                                        <button className="text-sm px-3 py-2 rounded-md bg-zinc-800/50 hover:bg-zinc-700">Sign up</button>
                                    </Link>
                                </>
                            ) : (
                                <>
                                    <DialogTrigger className="flex items-center justify-center gap-1 hover:bg-zinc-700/20 py-2 rounded-md px-2.5 text-blue-300">
                                        {unReadNotificationCount !== 0 && <p className=" font-semibold text-sm">{unReadNotificationCount}</p>}
                                        <BellRing strokeWidth={1.5} className="" />
                                    </DialogTrigger>
                                    <Link to={'/messages'} className="flex items-center justify-center gap-1 hover:bg-zinc-700/20 py-2 rounded-md px-2.5 text-green-300">
                                        {unReadMessages !== 0 && <p className=" font-semibold text-sm">{unReadMessages}</p>}
                                        <MessageCircle strokeWidth={1.5} className="" />
                                    </Link>
                                    <Link to={'/profile'} className="flex items-center justify-center gap-1 hover:bg-zinc-700/20 py-2 rounded-md px-2.5 ">
                                        <CircleUserRound strokeWidth={1.5} className="" />
                                    </Link>
                                    <Link to="/upload" className="hover:bg-zinc-700/20 py-2 rounded-md px-2.5 ">
                                        <UploadCloud strokeWidth={1.5} className="" />
                                    </Link>
                                </>
                            )}
                        </div>

                        <div onClick={() => {
                            setMenuOpen(!menuOpen)
                        }}
                            className='cursor-pointer flex items-center hover:bg-zinc-700/20 py-2 rounded-md px-2.5'>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={`w-6 h-6 ${menuOpen ? "rotate-90" : "rotate-0"}`}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 5.25h16.5m-16.5 4.5h16.5m-16.5 4.5h16.5m-16.5 4.5h16.5" />
                            </svg>
                        </div>

                        {menuOpen && (
                            <>
                                {
                                    userId ? <div onClick={() => { setMenuOpen(false); }} className='absolute top-10 right-0 rounded-md bg-zinc-900 border border-zinc-700 w-40 flex flex-col p-1 gap-0.5 text-sm z-50'>
                                        <Link to={"/"} className="text-light/50 py-1 rounded-sm px-2 bg-zinc-800 hover:text-light transition-all flex gap-1"><i className="ri-home-2-line"></i>Home</Link>
                                        <Link to={"/profile"} className="text-light/50 py-1 rounded-sm px-2 bg-zinc-800 hover:text-light transition-all flex gap-1"><i className="ri-user-line"></i>Profile</Link>
                                        <Link to={"/upload"} className="text-light/50 py-1 rounded-sm px-2 bg-zinc-800 hover:text-light transition-all flex gap-1"><i className="ri-upload-cloud-2-line"></i>Upload</Link>
                                        <Link to={"/search"} className="text-light/50 py-1 rounded-sm px-2 bg-zinc-800 hover:text-light transition-all flex gap-1"><i className="ri-search-line"></i>Search</Link>
                                        <Link to={"/explore"} className="text-light/50 py-1 rounded-sm px-2 bg-zinc-800 hover:text-light transition-all flex gap-1"><i className="ri-camera-line"></i>Explore</Link>
                                        <Link to={"/messages"} className="text-light/50 py-1 rounded-sm px-2 bg-zinc-800 hover:text-light transition-all flex gap-1"><i className="ri-chat-1-line"></i>Messages</Link>
                                        <Link to={"/profile/saved"} className="text-light/50 py-1 rounded-sm px-2 bg-zinc-800 hover:text-light transition-all flex gap-1"><i className="ri-link"></i>Saved Posts</Link>
                                        <Link to={"/profile/liked"} className="text-light/50 py-1 rounded-sm px-2 bg-zinc-800 hover:text-light transition-all flex gap-1"><i className="ri-heart-line"></i>Liked Posts</Link>
                                        <button onClick={logOut} className="text-light/50 py-1 hover:text-red-300 rounded-sm px-2 bg-zinc-800 transition-all flex gap-1"><i className="ri-arrow-go-back-fill"></i>Logout</button>
                                    </div> :
                                        <div onClick={() => { setMenuOpen(false); }} className='absolute top-10 right-0 rounded-md bg-zinc-900 border border-zinc-800/40 w-40 flex flex-col p-1 gap-1 text-sm z-50'>
                                            <Link to={"/"} className="text-light/50 py-1 rounded-sm px-2 bg-zinc-800 hover:text-light transition-all flex gap-1"><i className="ri-home-2-line"></i>Home</Link>
                                            <Link to={"/search"} className="text-light/50 py-1 rounded-sm px-2 bg-zinc-800 hover:text-light transition-all flex gap-1"><i className="ri-search-line"></i>Search</Link>
                                            <Link to={"/explore"} className="text-light/50 py-1 rounded-sm px-2 bg-zinc-800 hover:text-light transition-all flex gap-1"><i className="ri-camera-line"></i>Explore</Link>
                                            <Link to={"/signup"} className="text-light/50 py-1 rounded-sm px-2 bg-zinc-800 hover:text-light transition-all flex gap-1"><i className="ri-user-4-line"></i>Sign Up</Link>
                                            <Link to={"/login"} className="text-light/50 py-1 rounded-sm px-2 bg-zinc-800 hover:text-light transition-all flex gap-1"><i className="ri-login-circle-line"></i>Login</Link>
                                        </div>
                                }
                            </>
                        )}
                    </div>
                </div >
            </nav >
        </Dialog>
    )
}

Navbar.propTypes = {
    notShowNav: PropTypes.bool.isRequired
}
