import { useContext } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { LoginContext } from "./context/AuthenticatedContext";

export default function PrivateRoute() {
    const { isLogin }   = useContext(LoginContext);
    if (isLogin) {
        return ( <Outlet /> );
    }else {
        return ( <Navigate to="/" /> )
    }
}