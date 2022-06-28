import { NavLink } from "react-router-dom";

export default function NavDashboardPartial() {
    return(
        <ul className="nav nav-tabs">
            <li className="nav-item">
                <NavLink className="nav-link text-decoration-none text-black fs-5" to={'/dashboard'}>Products</NavLink>
            </li>
            <li className="nav-item">
                <NavLink className="nav-link text-decoration-none text-black fs-5" to={'/transaction'}>Transactions</NavLink>
            </li>
        </ul>
    );
}