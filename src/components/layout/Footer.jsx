import Cookies from "js-cookie";
import { useEffect, useState } from "react";
import { useLocation, Link } from "react-router-dom";
import PropTypes from 'prop-types'
import filePath from '../../assets/filePath'
import { getUserAPI } from "../../utility/apiUtils";


export default function Footer({ showFooter }) {
    const [user, setUser] = useState(null);

    const location = useLocation();

    const fetchLoggedUser = async () => {
        if (!Cookies.get("jwt")) {
            return;
        }
        try {
            const { data } = await getUserAPI();
            if (data.success) {
                setUser(data.user)
            }
        } catch (error) {
            console.log(error);
        }
    }


    useEffect(() => {
        fetchLoggedUser();
    }, [location.pathname]);

    return (
        <main className={`items-center justify-center mt-24 ${showFooter ? "flex" : "flex sm:hidden"}`}>
            {user && <footer className="footer max-w-[500px] w-screen text-white bg-zinc-900 flex justify-between items-center fixed bottom-0 z-[10] px-10 py-3">
                <Link to="/"><i className="text-[1.4rem] ri-home-line"></i></Link>
                <Link to="/search"><i className="text-[1.4rem] ri-search-line"></i></Link>
                <Link to="/upload"><i className="text-[1.4rem] ri-add-box-line"></i></Link>
                <Link to="/profile">
                    <div className="w-6 h-6 bg-zinc-300 rounded-full overflow-hidden">
                        <img src={`${filePath}/${user.dp}`} alt="" />
                    </div>
                </Link>
            </footer>}
        </main>

    )
}


Footer.propTypes = {
    showFooter: PropTypes.bool.isRequired
}