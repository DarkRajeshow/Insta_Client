import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import PropTypes from 'prop-types';
import axios from "axios";
import Cookies from "js-cookie";

export default function Protected(props) {
    const { Component } = props;
    const navigate = useNavigate();
    const location = useLocation();

    const isLoggedIn = async () => {
        const userId = Cookies.get("userId");

        if (!userId) {
            if (location.pathname !== "/login") {
                navigate(`/login?callback=${location.pathname}`)
            }
            navigate(`/login`)
        }

        else {
            const { data } = await axios.get("/api/isloggedin");
            if (!data.success) {
                navigate("/login");
            }
        }
    }

    useEffect(() => {
        isLoggedIn();
    })
    return (
        <div>
            <Component />
        </div>
    )
}

// Define propTypes
Protected.propTypes = {
    Component: PropTypes.elementType.isRequired,
};