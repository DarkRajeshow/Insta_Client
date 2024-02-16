import axios from "axios";
import Cookies from "js-cookie";

const isLoggedIn = async () => {

    const userId = Cookies.get("userId");

    if (!userId) {
        return false;
    }

    else {
        const { data } = await axios.get("/api/isloggedin");
        console.log(data.success);
        if (!data.success) {
            return false;
        }
    }
    return true;
}

export default isLoggedIn;