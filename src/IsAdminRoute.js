import { Navigate, Outlet } from "react-router-dom";
import { useContext } from 'react';
import { UserContext } from "./context/UserContext";

export default function IsAdminRoute(){
    let { user } = useContext(UserContext);
    if(user?.status === 'seller'){
        return ( <Outlet />);
    }else{
        return (<Navigate to='/'/>)
    }
}