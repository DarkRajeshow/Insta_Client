import axios from 'axios';
import { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom'
import { toast } from 'sonner';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Context } from '../../context/Store';

const Signup = () => {

    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const { setLoggedUserData } = useContext(Context);

    const handleSubmit = async (event) => {
        event.preventDefault();
        setLoading(true);

        const formData = new FormData(event.target);
        const name = formData.get('name');
        const email = formData.get('email');
        const username = formData.get('username');
        const password = formData.get('password');
        const gender = formData.get('gender');

        // can you add the password rules such as it should be 6 char or more and it must contains a special char

        const passwordRegex = /^(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{6,}$/; // This regex ensures password has at least 6 characters and contains at least one special character
        const isPasswordValid = passwordRegex.test(password);

        if (!isPasswordValid) {
            toast.warning("Password must be 6+ characters long and contain a special character like !@#$%^&*")
            setLoading(false);
            return;
        }

        const userData = { name, email, username, password, gender };

        try {
            const { data } = await axios.post("/api/register", userData);
            if (data.success) {
                setLoading(false);
                toast.success(data.status);
                navigate("/");
                setLoggedUserData(data.user);
            }
            else {
                setLoading(false);
                toast.error(data.status);
            }
        } catch (error) {
            setLoading(false);
            console.log(error);
            toast.error("Something went wrong.");
        }
        // Add your registration logic here
    };
    return (
        <div className="w-full min-h-screen bg-zinc-900 text-white py-5 flex flex-col items-center justify-center">
            <div className="w-full bg-zinc-900 text-white flex flex-col items-center justify-center">
                <main className="flex flex-col justify-center items-center">
                    <div className="sm:border border-zinc-800 rounded-sm min-w-[400px] flex items-center flex-col p-10 pb-2">
                        <img className='w-[174px] pb-10' src={'./logo.png'} alt='instagram'></img>
                        <div className='flex flex-col gap-1.5 w-full '>
                            <form onSubmit={handleSubmit} className="w-full text-white">
                                <input
                                    required
                                    className="px-3 mt-2 py-2 border-2 border-zinc-800 rounded-md block w-full bg-zinc-900 "
                                    type="text"
                                    placeholder="Name"
                                    name="name"
                                />
                                <Select name="gender" className="px-3 mt-2 py-2 rounded-md block bg-zinc-900 relative w-full">
                                    <SelectTrigger className="text-gray-400 w-full bg-dark border-zinc-800 border-2 mt-2">
                                        <SelectValue placeholder="Gender" />
                                    </SelectTrigger>
                                    <SelectContent className="text-light bg-dark border-zinc-800 border-2 w-[94%] absolute right-0">
                                        <SelectItem className="bg-dark text-light cursor-pointer" value="male">Male</SelectItem>
                                        <SelectItem className="bg-dark text-light cursor-pointer" value="female">Female</SelectItem>
                                    </SelectContent>
                                </Select>
                                <input
                                    required
                                    className="px-3 mt-2 py-2 border-2 border-zinc-800 rounded-md block w-full bg-zinc-900"
                                    type="email"
                                    placeholder="Email"
                                    name="email"
                                />
                                <input
                                    required
                                    className="px-3 mt-2 py-2 border-2 border-zinc-800 rounded-md block w-full bg-zinc-900"
                                    type="text"
                                    placeholder="Username"
                                    name="username"
                                />
                                <input
                                    required
                                    className="px-3 mt-2 py-2 border-2 border-zinc-800 rounded-md block w-full bg-zinc-900"
                                    type="password"
                                    placeholder="Password"
                                    name="password"
                                />
                                <button className="w-full bg-blue-500 px-3 py-3 rounded-md mt-4 flex gap-3 items-center justify-center" type="submit">
                                    {loading && <span className='h-8 w-8 rounded-full border-[3px] border-light border-t-blue-500 spin' />}
                                    <span className='font-semibold'>Create new account</span>
                                </button>
                            </form>
                            <div className='relative mt-10 mb-4'>
                                <hr className="border-zinc-800" />
                                <span className='absolute left-1/2 text-xs px-4 font-semibold -top-2 text-zinc-500 bg-zinc-900 -translate-x-1/2 '>Insta</span>
                            </div>
                        </div>
                    </div>
                    <div className='sm:border border-zinc-800 rounded-sm mt-3 min-w-[400px] flex items-center flex-col w-[300px] py-5'>
                        <p className='text-sm'> Already have an account? <Link className='text-[#0095F6] font-bold' to="/login">Login</Link></p>
                    </div>

                    <div className='mx-auto overflow-y-visible flex-wrap justify-center footer text-xs text-gray-500 flex items-center gap-4 pt-10'>
                        <span>Meta</span>
                        <span>About</span>
                        <span>Blog</span>
                        <span>Jobs</span>
                        <span>Help</span>
                        <span>API</span>
                        <span>Privacy</span>
                        <span>Terms</span>
                        <span>Locations</span>
                        <span>Instagram Lite</span>
                        <span>Threads</span>
                        <span>Contact Uploading & Non-Users</span>
                        <span>Meta Verified</span>
                    </div>

                    <div className='text-xs text-gray-500 pt-5 mb-10'>
                        <span className='px-4'>English</span> © 2023 Instagram from Meta
                    </div>
                </main>
            </div>
        </div>
    );
};

export default Signup;
