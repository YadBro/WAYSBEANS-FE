import trashIcon from "../assets/image/icon/trash-icon.png";
import NavbarPartial from "../partials/NavbarPartial";
import { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation, useQuery } from "react-query";
import { API } from "../config/api";
import { UserContext } from "../context/UserContext";
import { useShoppingCart } from "use-shopping-cart";

export default function CartPage() {
    document.title  = "Cart";
    const navigate  = useNavigate();
    const { user }  = useContext(UserContext);
    

    const {cartCount, cartDetails, incrementItem, decrementItem, removeItem, totalPrice, clearCart} = useShoppingCart();

    const keys   = Object.keys(cartDetails);
    const entries   = Object.entries(cartDetails);

    const { data: productData } = useQuery("productCache", async () => {
        const response  = await API.get("/products/" + keys[0]);
        return response.data.data.product;
    });

    const formatterPrice    = new Intl.NumberFormat('id-ID', {
        style       : 'currency',
        currency    : 'IDR'
    });

    const {data: profileData}   = useQuery("profileDataCache", async () => {
        const response  = await API.get("/profiles/" + user?.id);
        return response.data?.data?.profile;
    });
    

    const handleBuy     = useMutation(async (e) => {
        e.preventDefault();
        if(profileData?.phone === null){
            return alert("Please complete the profile first")
        };
        try {
            const data  = {
                idProduct   : productData?.id,
                idBuyer     : user?.id,
                idSeller    : productData?.idUser,
                price       : totalPrice
            }

            const body      = JSON.stringify(data);

            const config    = {
                method  : "POST",
                headers : {
                    "Content-type"  : "application/json"
                },
                body
            }

            // Insert transaction data
            const response = await API.post("/transactions", config);
            response && clearCart();
            // const url = response.data.data.payment.redirect_url;
            // if (url) {
            //     const elementA = document.createElement('a');
            //     elementA.href = url;
            //     elementA.target = '_blank';
            //     url && elementA.click();
            // }
            const token = response.data.data.payment.token;
            window.snap.pay(token, {
                onSuccess: function (result) {
                    /* You may add your own implementation here */
                    console.log(result);
                    navigate("/profile");
                },
                onPending: function (result) {
                    /* You may add your own implementation here */
                    console.log(result);
                    navigate("/profile");
                },
                onError: function (result) {
                    /* You may add your own implementation here */
                    console.log(result);
                },
                onClose: function () {
                    /* You may add your own implementation here */
                    alert("you closed the popup without finishing the payment");
                },
            });

        } catch (error) {
            console.log(error);
        }
    });

    useEffect(() => {
        //change this to the script source you want to load, for example this is snap.js sandbox env
        const midtransScriptUrl = "https://app.sandbox.midtrans.com/snap/snap.js";
        //change this according to your client-key
        const myMidtransClientKey = process.env.REACT_APP_MIDTRANS_CLIENT_KEY;

        let scriptTag = document.createElement("script");
        scriptTag.src = midtransScriptUrl;
        // optional if you want to set script attribute
        // for example snap.js have data-client-key attribute
        scriptTag.setAttribute("data-client-key", myMidtransClientKey);

        document.body.appendChild(scriptTag);
        return () => {
            document.body.removeChild(scriptTag);
        };
    }, []);
    
    function CartItem() {

        return (
            <>
                <div className="cart">
                    {entries.map(item => 
                    (
                        <div key={item[1].id}>
                            <div className="d-flex flex-columns py-3">
                                <img className="cart-image" src={item[1].image} alt="crtpct" />
                                <div className="d-flex justify-content-between w-100">
                                    <div className="d-flex flex-column p-3">
                                        <h5 className="cart-name">{item[1].name}</h5>
                                        <div className="d-flex flex-columns">
                                            <button className="cart-calculate" onClick={() => decrementItem(item[1].id)}>-</button>
                                                <span className="px-3 cart-qty">{item[1].quantity}</span>
                                            <button className="cart-calculate" onClick={() => incrementItem(item[1].id)}>+</button>
                                        </div>
                                    </div>
                                    <div className="d-flex flex-column p-3">
                                        <h5 className="cart-price">{formatterPrice.format(item[1].price)}</h5>
                                        <button className="cart-remove position-relative" onClick={() => removeItem(item[0])}>
                                            <img src={trashIcon} alt="trsh" width={20} className="align-self-end mt-2 position-absolute" style={{ right:0 }} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </>
        )
    }
    return(
        <>
            <NavbarPartial/>
            <div className="box-content mt-5 mb-5 ms-auto me-auto">
                <h1 className="table-title product-name mt-5">My Cart</h1>
                <div className="d-flex gap-5">
                    <div className="cart-product" style={{ width: "65%" }}>
                        <h4 className="cart-title mt-5">Review Your Order</h4>
                        {/* {for (const [key, value] of entries) (
                            <div className="cart">
                                <img src={item.image} alt="cartPct" />
                            </div>
                        )} */}
                        <CartItem/>
                    </div>
                    <div style={{ width: "35%", marginTop: 85 , height: 100}}>
                        <div className="d-flex cart flex-column py-3">
                            <div className="d-flex justify-content-between">
                                <h5 className="cart-price">Subtotal</h5>
                                <h5 className="cart-price">{formatterPrice.format(totalPrice)}</h5>
                            </div>
                            <div className="d-flex mt-2 justify-content-between">
                                <h5 className="cart-price">Qty</h5>
                                <h5 className="cart-price">{cartCount}</h5>
                            </div>
                        </div>
                        <div className="d-flex justify-content-between mt-3">
                            <h5 className="cart-price" style={{ fontWeight: 700 }}>Total</h5>
                            <h5 className="cart-price" style={{ fontWeight: 700 }}>{formatterPrice.format(totalPrice)}</h5>
                        </div>
                        
                        <button onClick={(event) => handleBuy.mutate(event)} className='btn-waysbeans btn-active-waysbeans w-100 pt-2 pb-4 mt-3' style={{ fontWeight: '500', fontSize: '20px', color: '#FFFFFF', lineHeight: '21.83px' }}>Pay</button>
                    </div>
                </div>
            </div>
        </>
    )
}