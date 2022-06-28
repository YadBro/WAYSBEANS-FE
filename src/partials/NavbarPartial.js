import { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import WaysBeansLogo from "../assets/image/WaysBeans_Logo.png";
import { useMutation } from "react-query";
import { API } from "../config/api";
import { UserContext } from "../context/UserContext";
import { LoginContext } from "../context/AuthenticatedContext";
import masTampanIMG from "../assets/image/MASTAMPAN.png";
import profileIconPNG from "../assets/image/icon/profile-icon.png";
import bijiKopiPNG from "../assets/image/icon/biji-kopi-icon.png";
import complainPNG from "../assets/image/icon/complain-icon.png";
import logoutPNG from "../assets/image/icon/logout-icon.png";
import cartPNG from "../assets/image/icon/cart-icon.png";
import { useShoppingCart } from "use-shopping-cart";

export default function NavbarPartial() {

    const { isLogin }   = useContext(LoginContext);
    const { user }      = useContext(UserContext);
    const { cartDetails, clearCart } = useShoppingCart();
    const cartData = Object.entries(cartDetails);
    const [notif, setNotif] = useState({
        error   : null,
        success : null
    });
    

    const [isLoading, setIsLoading] = useState(false);
    const [formLogin, setFormLogin] = useState({
        email : '',
        password : ''
    });
    const [formRegister, setFormRegister] = useState({
        email : '',
        password : '',
        fullname : ''
    });

    const [preview, setPreview] = useState(null);

    const freshStates   = (e) =>{
        e.preventDefault();
        setFormLogin({
            email : '',
            password : ''
        });
        setFormRegister({
            email : '',
            password : '',
            fullname : ''
        });
        setIsLoading(false);
        setNotif({
            error   : null,
            success : null
        });
    }

    const onChangeLogin = (e) => {
        setFormLogin({
            ...formLogin,
            [e.target.name] : e.target.value
        });
        setNotif({
            error   : null,
            success : null
        });
    }

    const onChangeRegister = (e) => {
        setFormRegister({
            ...formRegister,
            [e.target.name] : e.target.value
        });
        setNotif({
            error   : null,
            success : null
        });
    }

    const handlerLogin  = useMutation( async (e) => {
        try {
            e.preventDefault();

            setIsLoading(true);
            const config    = {
                headers : {
                    'Content-Type'  : 'application/json'
                }
            }
            const taga      = document.createElement('a');
            taga.href       = "/";
            const response  = await API.post('/login', JSON.stringify(formLogin), config);
            // console.log(response.data.data.user.token);
            const token     = response.data.data.user.token;
            if(response) {
                setTimeout(()=>{
                    setIsLoading(false);
                    localStorage.setItem("token", token);
                    taga.click();
                }, 2000);
            }
        } catch (error) {
            if (error) {
                setTimeout(() => {
                    setIsLoading(false);
                    setNotif(
                        {
                            ...notif,
                            error: error?.response?.data?.message
                        }
                        );
                }, 500);
            }
        }
    });

    const handlerRegister  = useMutation( async (e) => {
        try {
            e.preventDefault();

            setIsLoading(true);
            const config    = {
                headers : {
                    'Content-Type'  : 'application/json'
                }
            }
            const response  = await API.post('/register', JSON.stringify(formRegister), config);
            // const token     = response.data.data.user.token;c
            if(response) {
                setTimeout(()=>{
                    setIsLoading(false);
                    setNotif(
                    {
                        ...notif,
                        success: response.data.message
                    }
                    );
                }, 2000);
            }
        } catch (error) {
            if (error) {
                setTimeout(() => {
                    setIsLoading(false);
                    setNotif(
                        {
                            ...notif,
                            error: error?.response?.data?.message
                        }
                        );
                }, 500);
            }
        }
    });

    function logoutHandler() {
        localStorage.removeItem("token");
        clearCart();
        const taga      = document.createElement('a');
        taga.href       = "/";
        taga.click();
    }
    useEffect(()=>{
        setPreview(process.env.REACT_APP_SERVER_URL_FILE + user?.image);
    }, [user]);
    return(
        <nav className="navbar shadow-lg navbar-expand-lg navbar-light bg-light">
            <div className="container">
            <Link className="navbar-brand" to={"/"}>
                <img src={WaysBeansLogo} alt="wblogo" width={180} height={55} />
            </Link>
                <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon" />
                </button>
                <div className="collapse justify-content-end navbar-collapse" id="navbarNav">
                    <ul className="navbar-nav">
                        {isLogin === true
                        ?
                        (
                        <li className="nav-item me-4">
                            <div className="dropdown">
                                <Link to="/mycart" className="btnDrop me-3 text-decoration-none">
                                    <img src={cartPNG} alt="wblogo" style={{ width: 35, height: 35 }} />
                                    <sup className="bg-danger text-white rounded-circle fs-6 position-absolute py-2 px-1" style={{ top: 15, right: 80}}>{cartData.length}</sup>
                                </Link>
                                <button type="button" className="btnDrop" id="dropdownMenuButton2" data-bs-toggle="dropdown" aria-expanded="false">
                                    <img className="rounded-circle" src={preview || masTampanIMG} alt="wblogo" style={{ width: 100, height: 100 }} />
                                </button>
                                <ul className="mt-4 shadow dropdown-menu dropdown-menu-light dropdown-menu-end" aria-labelledby="dropdownMenuButton2" style={{ borderRadius: 10, width: 200, border: "none" }}>
                                    {user?.status === "seller" && isLogin === true &&
                                    (
                                    <>
                                        <li>
                                            <Link className="dropdown-item ms-1 p-3 fs-5" to={"/dashboard"} style={{ fontWeight: 600 }}><img src={bijiKopiPNG} alt="prlogo" style={{ width: 35 }} className="me-2" /> Dashboard</Link>
                                        </li>
                                        <li>
                                            <hr className="dropdown-divider"/>
                                        </li>
                                    </>
                                    )
                                    }
                                    <li>
                                        <Link to={"/profile"} className="dropdown-item ms-1 p-3 fs-5" style={{ fontWeight: 600 }}><img src={profileIconPNG} alt="prlogo" style={{ width: 35 }} className="me-2" /> Profile</Link>
                                    </li>
                                    <li>
                                        <hr className="dropdown-divider"/>
                                    </li>
                                    {user?.status === "seller" && isLogin === true ?
                                    (
                                    <>
                                    <li>
                                        <Link to={"/complain-admin"} className="dropdown-item ms-1 p-3 fs-5" type="button" style={{ fontWeight: 600 }}><img src={complainPNG} alt="prlogo" style={{ width: 35 }} className="me-2" /> Complain</Link>
                                    </li>
                                    </>
                                    )
                                    :
                                    (
                                    <>
                                    <li>
                                        <Link to={"/complain"} className="dropdown-item ms-1 p-3 fs-5" type="button" style={{ fontWeight: 600 }}><img src={complainPNG} alt="prlogo" style={{ width: 35 }} className="me-2" /> Complain</Link>
                                    </li>
                                    </>
                                    )
                                    }
                                    <li>
                                        <hr className="dropdown-divider"/>
                                    </li>
                                    <li>
                                        <button onClick={logoutHandler} className="dropdown-item ms-1 p-3 fs-5" type="button" style={{ fontWeight: 600 }}><img src={logoutPNG} alt="prlogo" style={{ width: 35 }} className="me-2" /> Logout</button>
                                    </li>
                                </ul>
                            </div>

                        </li>
                        )
                        :(
                            <>
                        <li className="nav-item">
                            {/* LOGIN BUTTON */}
                            <button type="button" className="nav-link btn-waysbeans" data-bs-toggle="modal" data-bs-target="#loginModal">Login</button>

                            {/* MODAL LOGIN BUTTON */}
                            <div className="modal fade" id="loginModal" tabIndex={-1} aria-labelledby="loginModalLabel" aria-hidden="true">
                                <div className="modal-dialog modal-dialog-centered">
                                    <div className="modal-content login-box">
                                        <div className="modal-body m-3">
                                            <h1 className="modal-heading-text mb-5">Login</h1>
                                            <form onSubmit={(event) => handlerLogin.mutate(event)}>
                                                <div className="mb-3">
                                                    <input onChange={onChangeLogin} value={formLogin.email} name="email" type="email" className="form-input p-3 mb-1" autoComplete="current-email" id="emailId" placeholder="Email" />
                                                </div>
                                                <div className="mb-3">
                                                    <input onChange={onChangeLogin} value={formLogin.password} name="password" type="password" className="form-input p-3 mt-1 mb-3" autoComplete="current-password" id="passwordId" placeholder="Password" />
                                                </div>
                                                {notif.error && (<p className="text-danger text-center fs-5" style={{ fontWeight: 500 }}>{notif.error}</p>)}
                                                {
                                                    isLoading
                                                ?
                                                (
                                                    <button type="button" className="btn-waysbeans position-relative btn-active-waysbeans w-100 fs-4 p-4">
                                                        <div className="spinner-border text-light position-absolute" role="status" style={{ top: 10, left: "45%" }}>
                                                            <span className="visually-hidden">Loading...</span>
                                                        </div>
                                                    </button>
                                                )
                                                :
                                                (
                                                    <button type="submit" className="btn-waysbeans btn-active-waysbeans w-100 fs-4 p-4">Login</button>
                                                )
                                                }
                                                <div className="d-flex justify-content-center mt-3">
                                                    <p className="login-help">Don't have an account? Click <Link onClick={freshStates} className="text-decoration-none login-help-link" to={'#'} data-bs-toggle="modal" data-bs-target="#registerModal">Here</Link></p>
                                                </div>
                                            </form>
                                        </div>
                                    </div>
                                </div>
                            </div>

                        </li>
                        <li className="nav-item">
                            <button type="button" className="nav-link btn-active-waysbeans btn-waysbeans ms-3" data-bs-toggle="modal" data-bs-target="#registerModal">Register</button>

                            {/* MODAL LOGIN BUTTON */}
                            <div className="modal fade" id="registerModal" tabIndex={-1} aria-labelledby="registerModalLabel" aria-hidden="true">
                                <div className="modal-dialog modal-dialog-centered">
                                    <div className="modal-content login-box">
                                        <div className="modal-body m-3">
                                            <h1 className="modal-heading-text mb-5">Register</h1>
                                            <form onSubmit={event => handlerRegister.mutate(event)}>
                                                <div className="mb-3">
                                                    <input onChange={onChangeRegister} value={formRegister.email} name="email" type="email" className="form-input p-3 mb-1" autoComplete="current-email" id="@emailId" placeholder="Email" />
                                                </div>
                                                <div className="mb-3">
                                                    <input onChange={onChangeRegister} value={formRegister.password} name="password" type="password" className="form-input p-3 mt-1 mb-2" autoComplete="current-password" id="@passwordId" placeholder="Password" />
                                                </div>
                                                <div className="mb-3">
                                                    <input onChange={onChangeRegister} value={formRegister.fullname} name="fullname" type="text" className="form-input p-3 mb-3" id="fullnameId" autoComplete="current-fullname" placeholder="Full Name" />
                                                </div>
                                                {
                                                    isLoading
                                                ?
                                                (
                                                    <button type="button" className="btn-waysbeans position-relative btn-active-waysbeans w-100 fs-4 p-4">
                                                        <div className="spinner-border text-light position-absolute" role="status" style={{ top: 10, left: "45%" }}>
                                                            <span className="visually-hidden">Loading...</span>
                                                        </div>
                                                    </button>
                                                )
                                                :
                                                (
                                                    <>
                                                        {notif.success && (<p className="text-success text-center fs-5" style={{ fontWeight: 500 }}>{notif.success}</p>)}
                                                        {notif.error && (<p className="text-danger text-center fs-5" style={{ fontWeight: 500 }}>{notif.error}</p>)}
                                                        <button type="submit" className="btn-waysbeans btn-active-waysbeans w-100 fs-4 p-4">Register</button>
                                                    </>
                                                )
                                                }
                                                <div className="d-flex justify-content-center mt-3">
                                                    <p className="login-help">Already have an account? Click <Link onClick={freshStates} className="text-decoration-none login-help-link" to={'#'} data-bs-toggle="modal" data-bs-target="#loginModal">Here</Link></p>
                                                </div>
                                            </form>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </li>
                        </>
                        )}
                    </ul>

                </div>
            </div>
        </nav>
    )
}