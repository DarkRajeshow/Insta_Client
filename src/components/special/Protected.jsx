import { useCallback, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import PropTypes from 'prop-types';
import { getUserId, isLoggedInAPI } from "../../utility/apiUtils";


export default function Protected(props) {
    const { Component } = props;
    const navigate = useNavigate();
    const location = useLocation();

    const [userId, setUserId] = useState(false);

    const isLoggedIn = useCallback(async () => {
        const currentUserId = await getUserId();

        if (!currentUserId) {
            if (location.pathname !== "/login") {
                navigate(`/login?callback=${location.pathname}`)
            }
            navigate(`/login`);
        }

        else {
            const { data } = await isLoggedInAPI();
            setUserId(currentUserId);
            if (!data.success) {
                navigate("/login");
            }
        }
    }, [location.pathname, navigate])

    useEffect(() => {
        isLoggedIn();
    }, [isLoggedIn])

    useEffect(() => {
        console.log(userId);
    }, [userId])

    return (
        <div>
            <Component userId={userId} />
        </div>
    )
}

// Define propTypes
Protected.propTypes = {
    Component: PropTypes.elementType.isRequired,
};