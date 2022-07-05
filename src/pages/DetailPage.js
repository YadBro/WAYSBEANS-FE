import { useQuery } from "react-query";
import { useParams } from "react-router-dom";
import { API } from "../config/api";
import NavbarPartial from "../partials/NavbarPartial";
import { useShoppingCart } from "use-shopping-cart";


export default function DetailPage() {
    document.title  = "Detail Product";

    const { id }    = useParams();
    const { addItem }   = useShoppingCart();
    const { data: productData } = useQuery("productCache", async () => {
        const response  = await API.get("/products/" + id);
        return response.data.data.product;
    });
    const formatterPrice    = new Intl.NumberFormat('id-ID', {
        style       : 'currency',
        currency    : 'IDR'
    });


    const handleCart = (e) => {
        e.preventDefault();
        addItem({
            id          : productData.id,
            description : productData.description,
            name        : productData.name,
            currency    : 'USD',
            price       : productData.price,
            image       : process.env.REACT_APP_SERVER_URL_FILE + productData?.image
        });
    }



    return (
        <>
            <NavbarPartial/>
            <div className="box-content mt-5 mb-5 ms-auto me-auto">
                <div className="d-flex gap-5">
                    <div style={{ width: '49%' }} className="mt-5">
                        <img className="img-fluid" src={process.env.REACT_APP_SERVER_URL_FILE + productData?.image} alt="ProductImage" width={500}/>
                    </div>
                    <div className="d-flex flex-column mt-5" style={{ width: '60%' }}>
                        <h1 className='detail-title mt-4'>{productData?.name}</h1>
                        <div className="detail-product mt-3">
                            <p className='text-price-color fs-4 mt-2' style={{ lineHeight: '1px', fontWeight: 400 }}>Stock : {productData?.stock}</p>
                            <p className='text-black' style={{ fontWeight: 400, fontSize: 18, lineHeight: 1.5, textAlign: "justify", marginTop: 100 }}>
                                {productData?.description}
                            </p>
                            <div className="d-flex justify-content-end mt-4 mb-4">
                                <h2 className='detail-price'>{formatterPrice.format(productData?.price)}</h2>
                            </div>
                            <button onClick={handleCart} className='btn-waysbeans btn-active-waysbeans w-100 pt-2 pb-4' style={{ fontWeight: '700', fontSize: '18px', color: '#FFFFFF', lineHeight: '21.83px' }}>Add To Cart</button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}