
import { useContext, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom"
import { toast } from "sonner";
import { Context } from "../../context/Store";
import { loginAPI } from "../../utility/apiUtils";

const Login = () => {

    const [searchParams] = useSearchParams();
    const callback = searchParams.get("callback");
    const [loading, setLoading] = useState(false);
    const { setLoggedUserData } = useContext(Context);


    const navigate = useNavigate();
    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);

        const formData = new FormData(e.target);
        const username = formData.get("username")
        const password = formData.get("password")
        const userCredentials = { username, password };

        try {
            const { data } = await loginAPI(userCredentials);

            if (data.success) {
                setLoading(false);
                toast.success(data.status)
                setLoggedUserData(data.user)
                if (callback) {
                    navigate(callback);
                }
                else {
                    navigate("/profile")
                }
            }
            else {
                setLoading(false);
                toast.error(data.status)
            }

        } catch (error) {
            setLoading(false);
            console.log(error);
            toast.error("Something went wrong.")
        }

    }

    return (
        <div className="w-full bg-zinc-900 text-white flex flex-col items-center justify-center">
            <main className="flex flex-col justify-center items-center">
                <div className="sm:border border-zinc-800 rounded-sm min-w-[400px] flex items-center flex-col p-10 pb-2">
                    <img className='w-[174px] pb-10' src={'./logo.png'} alt='instagram'></img>
                    <div className='flex flex-col gap-1.5 w-full '>
                        <form onSubmit={handleLogin} className="w-full text-white" >
                            <input
                                required
                                className="px-3 mt-2 py-2 border-2 border-zinc-800 rounded-md block w-full bg-zinc-900"
                                type="text"
                                placeholder="username"
                                name="username"
                            />
                            <input
                                required
                                className="px-3 mt-2 py-2 border-2 border-zinc-800 rounded-md block w-full bg-zinc-900"
                                type="password"
                                placeholder="password"
                                name="password"
                            />
                            <button className="w-full bg-blue-500 px-3 py-2 rounded-md flex gap-6 mt-4 items-center justify-center" type="submit">
                                {loading && <span className='h-6 w-6 rounded-full border-[3px] border-light border-t-blue-500 spin' />}
                                <span className='font-semibold'>Log In</span>
                            </button>
                        </form>

                        <div className='relative mt-10 mb-4'>
                            <hr className="border-zinc-800" />
                            <span className='absolute left-1/2 text-xs px-4 font-semibold -top-2 text-zinc-500 bg-zinc-900 -translate-x-1/2 '>Insta</span>
                        </div>
                    </div>
                </div>
                <div className='sm:border border-zinc-800 rounded-sm mt-3 min-w-[400px] flex items-center flex-col w-[300px] py-5'>
                    <p className='text-sm'>Don&apos;t have an account? <Link className='text-[#0095F6] font-bold' to="/signup">Sign up</Link></p>
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
    );
};

export default Login;
