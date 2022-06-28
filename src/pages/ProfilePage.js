import NavbarPartial from "../partials/NavbarPartial";
import pencilIcon   from "../assets/image/icon/pencil-icon.png";
import WaysBeansLogo from "../assets/image/WaysBeans_Logo.png";
import qrcode from "../assets/image/qrcode.png";
import { Link } from "react-router-dom";
import NotFoundImage from "../assets/image/NotFoundImage.jpg";
import { useContext, useEffect, useState } from "react";
import { UserContext } from "../context/UserContext";
import { useQuery } from "react-query";
import { API } from "../config/api";
import dateformat from "dateformat";


export default function ProfilePage() {
    document.title  = "Profile";
    const { user }  = useContext(UserContext);
    const [form, setForm]  = useState({
        fullname    : "",
        email       : "",
        phone       : "",
        gender      : "",
        address     : "",
        image       : ""
    });

    const {data: profileData}   = useQuery("profileDataCache", async () => {
        const response  = await API.get("/profiles/" + user?.id);
        return response.data?.data?.profile;
    });

    const {data: transactionData}    = useQuery("transactionCache", async () => {
        const response  = await API.get("/transactions/" + user?.id);
        return response.data?.data;
    });

    useEffect(() => {
        setForm({
            fullname    : user?.name,
            email       : user?.email,
            image       : user?.image,
            phone       : profileData?.phone,
            gender      : profileData?.gender,
            address     : profileData?.address
        });
    }, [profileData]);

    const formatterPrice    = new Intl.NumberFormat('id-ID', {
        style       : 'currency',
        currency    : 'IDR'
    });

    return(
        <>
            <NavbarPartial />
            <div className="box-content mt-5 mb-5 ms-auto me-auto">
                <div className="d-flex gap-4">
                    <div style={{ flex: "6" }}>
                        <h1 className="profile-title mt-5">My Profile</h1>
                        <div className="d-flex">
                            <img className="mt-4" src={process.env.REACT_APP_SERVER_URL_FILE + form.image || NotFoundImage} alt="tmpnJPG" width={260} height={280} />
                            <div className="d-flex ms-4 mt-3 flex-column position-relative" style={{ width: "49%" }}>
                                <h3 className="profile-describe">Full Name</h3>
                                <h4 className="mt-2">{form.fullname || "-"}</h4>
                                <h3 className="profile-describe mt-5">Email</h3>
                                <h4 className="mt-2">{form.email || "-"}</h4>
                                <h3 className="profile-describe mt-5">Phone</h3>
                                <h4 className="mt-2">{form.phone || "-"}</h4>
                                <h3 className="profile-describe mt-5">Gender</h3>
                                <h4 className="mt-2">{form.gender || "-"}</h4>
                                <h3 className="profile-describe mt-5">Address</h3>
                                <h4 className="mt-2">{form.address || "-"}</h4>
                                <Link to={"/update-profile/" + user.id} className="text-decoration-none position-absolute" style={{ right: 0 }}>
                                    <img className="p-2 rounded-3" src={pencilIcon} alt="pncIcn" width={50} height={50} style={{ backgroundColor: "#dee2e6" }} />
                                </Link>
                            </div>
                        </div>
                    </div>
                    <div style={{ flex: "5" }}>
                        <h1 className="profile-title mt-5">My Transactions</h1>
                        <div className="transaction-canvas">
                            {transactionData?.length !== 0
                            ?
                            transactionData?.map(item => 
                            (<div className="d-flex transaction mt-2 p-3 ps-4 w-100" key={item?.id}>
                                <div className="flex-grow-2">
                                    <img className='img-fluid img-transaction' src={item?.product?.image} alt="ProductImage" />
                                </div>
                                <div className="d-flex flex-column flex-grow-1 m-2 ms-3">
                                    <h5 className='transaction-title'>{item?.product?.name}</h5>
                                    <small className='transaction-sub-title'>{dateformat(item?.createdAt, "dddd, d mmmm yyyy HH:MM")} WIB</small>
                                    <p className='transaction-price'>Price : {formatterPrice.format(item?.price)}</p>
                                    <h5 className='fw-bold' style={{ fontSize: '15px', color: "var(--waysbeans-price-color)" }}>Sub Total : {formatterPrice.format(item?.price)}</h5>
                                </div>
                                <div className="flex-grow-2 pe-1">
                                    <div className="d-flex flex-column">
                                    <img className='img-fluid' width='75px' height='75px' src={WaysBeansLogo} alt="WaysBeansLogo" />
                                    <img className='img-fluid' width='75px' height='75px' src={qrcode} alt="qrcode" />
                                    </div>
                                    <div className={"status-"+ item?.status +" mt-1 me-0"}>{item?.status}</div>
                                </div>
                            </div>))
                            :
                            (<h3 className='text-white text-center mt-5'>No data transactions</h3>)
                            }
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}