import Cookies from "js-cookie";
import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import PropTypes from 'prop-types';
import api from "../../assets/api";

export default function Navbar({ notShowNav }) {
    const [menuOpen, setMenuOpen] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const location = useLocation();
    const navigate = useNavigate();

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
        const userLoggedIn = !!Cookies.get('userId');
        setIsLoggedIn(userLoggedIn);
    }, [location.pathname]);

    const logOut = async () => {
        try {
            Cookies.remove("userId");
            const { data } = await api.get("/api/logout");

            if (data.success) {
                toast.success(data.status)
                navigate("/login");
            }
            else {
                toast.error(data.status)
            }
        } catch (error) {
            console.log(error);
            toast.error("Something went wrong.")
        }
    }


    return (
        <nav className={`bg-transparent text-light mt-5 mb-3 sm:my-5 w-full top-5 select-none ${notShowNav && "hidden"}`}>
            <div className="nav flex justify-between items-center px-6">
                <Link to={"/"}>
                    <img src="/logo.png" alt="Logo" className="h-10" />
                </Link>
                <div className="relative icons flex gap-5">

                    {!isLoggedIn ? (
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
                            <Link to={'/profile'} className="flex items-center justify-center gap-1">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M17.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488 7.488 0 0 0-5.982 2.975m11.963 0a9 9 0 1 0-11.963 0m11.963 0A8.966 8.966 0 0 1 12 21a8.966 8.966 0 0 1-5.982-2.275M15 9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                                </svg>
                            </Link>
                            <Link to="/upload">
                                <i className="text-[1.4rem] ri-add-box-line"></i>
                            </Link>
                        </>
                    )}


                    <div onClick={() => {
                        setMenuOpen(!menuOpen)
                    }}
                        className='cursor-pointer flex items-center'>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={`w-6 h-6 ${menuOpen ? "rotate-90" : "rotate-0"}`}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 5.25h16.5m-16.5 4.5h16.5m-16.5 4.5h16.5m-16.5 4.5h16.5" />
                        </svg>
                    </div>

                    {menuOpen && (
                        <>
                            {
                                isLoggedIn ? <div onClick={() => { setMenuOpen(false); }} className='absolute top-10 right-0 rounded-md bg-zinc-900 border border-zinc-700 w-40 flex flex-col p-1 gap-0.5 text-sm z-50'>
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
    )
}

Navbar.propTypes = {
    notShowNav: PropTypes.bool.isRequired
}
