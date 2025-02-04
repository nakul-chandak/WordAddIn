import React from "react";
import { Navigate, Outlet } from "react-router-dom";

function ProtectedRoute () {
    const isAuthenticated = window.localStorage.getItem("LoggedIn");
    return isAuthenticated === 'true' ? <Outlet/> : <Navigate to ="/login"/>
}

export default ProtectedRoute;