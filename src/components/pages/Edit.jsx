import axios from "axios";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

const Edit = () => {

    const navigate = useNavigate();

    const [user, setUser] = useState({
        name: "",
        email: "",
        username: "",
        bio: "",
        gender: "",
        dp: "default-profile.jpg"
    });

    const [loading, setLoading] = useState(false);

    const openFileInput = () => {
        document.getElementById('dpInput').click();
    };

    const fetchUserData = async () => {
        try {
            const { data } = await axios.get("/api/user");
            if (data.success) {
                setUser(data.user);
            }
            else {
                toast.success(data.status)
            }
        } catch (error) {
            console.log("Problem : " + error);
        }
    }

    const previewImage = (event) => {
        const input = event.target;
        const dpView = document.getElementById('dpview');

        if (input.files && input.files[0]) {
            const reader = new FileReader();
            reader.onload = function (e) {
                dpView.src = e.target.result;
            };
            reader.readAsDataURL(input.files[0]);
        }
    };

    const handleChange = (e) => {
        console.log(e.target);
        const attributeName = e.target.name;
        setUser({
            ...user,
            [attributeName]: e.target.value
        })
    }

    const updateData = async (e) => {
        setLoading(true);
        e.preventDefault();
        const formData = new FormData(e.target);

        try {
            const { data } = await axios.put("/api/user", formData);
            if (data.success) {
                toast.success(data.status)
                navigate("/profile");
            }
            else {
                toast.error(data.status)
            }
        } catch (error) {
            console.log(error);
            toast.error("Something went wrong.")
        }
        setLoading(false);
    }

    useEffect(() => {
        fetchUserData();
    }, [])

    return (
        <div className="w-full min-h-screen bg-zinc-900 text-white py-5">
            <div className="flex justify-between items-center px-4">
                <Link to="/profile" className="text-sm text-blue-500">
                    <i className="ri-arrow-left-s-line"></i> profile
                </Link>
                <h2 className="leading-none text-sm">Edit Profile</h2>
                <Link to="/feed" className="text-sm">
                    <i className="ri-home-line"></i> home
                </Link>
            </div>
            <div className="flex flex-col items-center gap-2 mt-20">
                <div className="image w-20 h-20 bg-sky-100 rounded-full">
                    <img
                        id="dpview"
                        className="h-full w-full object-cover rounded-full"
                        src={`/api/uploads/${user.dp}`}
                        alt=""
                    />
                </div>
                <button onClick={openFileInput} className="text-blue-500 capitalize">
                    edit picture
                </button>
            </div>
            <div className="gap-5 px-4 mt-10 w-[600px] m-auto ">
                <h3 className="text-lg leading-none">
                    Edit Account Details{' '}
                </h3>
                <hr className="opacity-30 my-3" />
                <form
                    onSubmit={updateData}
                    className="w-full"
                    encType="multipart/form-data"
                >
                    <input
                        onChange={previewImage}
                        className="hidden"
                        accept="image/*"
                        id="dpInput"
                        type="file"
                        name="file"
                    />
                    <div className="my-8">
                        <label>Username</label>
                        <input
                            className="px-3 mt-2 py-2 border-2 border-zinc-800 rounded-md block w-full bg-zinc-900"
                            onChange={handleChange}
                            value={user.username}
                            type="text"
                            placeholder="username"
                            name="username"
                        />
                    </div>

                    <div className="my-8">
                        <label >Select Gender</label>
                        <Select value={user.gender} onValueChange={(selectedValue) => {
                            setUser({
                                ...user,
                                gender: selectedValue
                            })
                        }} name="gender" className="px-3 mt-2 py-2 rounded-md block w-full bg-zinc-900">
                            <SelectTrigger className="text-light bg-dark border-zinc-800 border-2 mt-2 text-base">
                                <SelectValue placeholder="Gender" />
                            </SelectTrigger>
                            <SelectContent className="text-light bg-dark border-zinc-800 border-2">
                                <SelectItem className="bg-dark text-base text-light cursor-pointer" value="male">Male</SelectItem>
                                <SelectItem className="bg-dark text-base text-light cursor-pointer" value="female">Female</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="my-8">
                        <label >Email</label>
                        <input
                            className="px-3 mt-2 py-2 border-2 border-zinc-800 rounded-md block w-full bg-zinc-900"
                            value={user.email}
                            onChange={handleChange}
                            type="text"
                            placeholder="email"
                            name="email"
                        />
                    </div>

                    <div className="my-8">
                        <label >Name</label>
                        <input
                            className="px-3 mt-2 py-2 border-2 border-zinc-800 rounded-md block w-full bg-zinc-900"
                            value={user.name}
                            onChange={handleChange}
                            type="text"
                            placeholder="name"
                            name="name"
                        />
                    </div>

                    <div className="my-8">
                        <label >Bio</label>
                        <textarea
                            className="px-3 my-2 py-2 border-2 border-zinc-800 rounded-md block w-full bg-zinc-900 resize-none"
                            name="bio"
                            placeholder="Bio"
                            onChange={handleChange}
                            value={user.bio}
                        />
                    </div>

                    <button disabled={loading} className={`w-full px-2 py-2 bg-blue-500 rounded-md flex items-center justify-center gap-4 ${loading ? "cursor-default bg-gray-700" : ""}`} type="submit">
                        {
                            loading && <span className='h-6 w-6 rounded-full border-[3px] border-white border-b-transparent animate-spin' />
                        }
                        <span>Update Profile</span>
                    </button>
                </form>
                <p className="text-gray-200 font-medium text-center my-2 text-sm sm:text-base">
                    <strong className="font-semibold text-gray-50 underline underline-offset-4">
                        Note
                    </strong>{' '}
                    : If you change your username, you will need to log in again using
                    the new username.
                </p>
            </div>
        </div>
    );
};

export default Edit;
