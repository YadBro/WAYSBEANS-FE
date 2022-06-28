import NavbarPartial from "../partials/NavbarPartial";
import WaysBeans_LP_Logo from "../assets/image/WaysBeans_LP_Logo.png";
import waves1 from "../assets/image/waves1.png";
import WaysBeans_Ingridient from "../assets/image/WaysBeans_Ingridient.jpg";
import { Link } from "react-router-dom";
import { useQuery } from "react-query";
import { API } from "../config/api";
import { useContext, useState } from "react";
import { LoginContext } from "../context/AuthenticatedContext";


export default function Home() {
    document.title  = "Home";

    const serverUrlUploads = process.env.REACT_APP_SERVER_URL_FILE;
    const [product, setProduct] = useState([]);
    const { isLogin }   = useContext(LoginContext);

    useQuery("productCache", async () => {
        const response  = await API.get("/products");
        setProduct(response.data.data.product);
    });

    const formatterPrice    = new Intl.NumberFormat("id-ID", {
        style       : "currency",
        currency    : "IDR"
    });

    return(
        <>
            <NavbarPartial/>

            <div className="box-content position-relative">

                {/* {HEADER START} */}
                <div className="box-content-header">
                    <div className="d-flex p-5">
                        <div className="d-flex flex-column">
                            <img src={WaysBeans_LP_Logo} alt="wbheaderlogo" className="img-fluid" width={478} height={145}/>
                            <p className="content-slogan my-2" style={{ fontSize: 25 }}>BEST QUALITY COFFEE BEANS</p>
                            <p className="content-slogan my-2" style={{ fontSize: 18 }}>Quality freshly roasted coffee made just for you.<br />Pour, brew and enjoy</p>
                        </div>
                        <div className="d-flex align-items-end">
                            <img src={waves1} alt="wbheaderlogo" className="img-fluid position-absolute" width={352} height={99} style={{ top: 240 }}/>
                            <img src={WaysBeans_Ingridient} alt="wbilogo" className="img-fluid position-absolute" width={440} height={272} style={{ top: 20, right: 26 }}/>
                        </div>
                    </div>
                </div>
                {/* {HEADER END} */}
            
                <div className="d-flex flex-wrap">

                    {/* {PRODUCTS START} */}
                    {isLogin ?
                    product?.map(item => (
                        <Link to={"/product-detail/" + item?.id} key={item?.id} className="card-layouts text-decoration-none">
                            <div className="card mt-5" style={{width: '15.5rem'}}>
                                <img src={serverUrlUploads + item?.image} className="card-img-top" width={241} height={312} alt="beansprdct"/>
                                <div className="card-body">
                                    <h5 className="card-title">{item?.name}</h5>
                                    <p className="card-text">{formatterPrice.format(item?.price)}</p>
                                    <p className="card-text2">Stock : {item?.stock}</p>
                                </div>
                            </div>
                        </Link>
                    ))
                    :
                    (
                        product?.map(item => (
                            <button type="button" className="card-layouts" data-bs-toggle="modal" data-bs-target="#loginModal" style={{ border: "none", backgroundColor: "transparent", textAlign: "left"}}>
                                <div className="card mt-5" style={{width: '15.5rem'}}>
                                    <img src={serverUrlUploads + item?.image} className="card-img-top img-fluid w-100" height={312} alt="beansprdct"/>
                                    <div className="card-body">
                                        <h5 className="card-title">{item?.name}</h5>
                                        <p className="card-text">{formatterPrice.format(item?.price)}</p>
                                        <p className="card-text2">Stock : {item?.stock}</p>
                                    </div>
                                </div>
                            </button>
                        ))
                    )}
                    {/* {PRODUCTS END} */}

                </div>


            </div>

        </>
    );
}