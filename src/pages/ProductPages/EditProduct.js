import NavbarPartial from "../../partials/NavbarPartial";
import clipIcon from "../../assets/image/icon/clip-icon.png";
import NotFoundImage from "../../assets/image/NotFoundImage.jpg";
import { useEffect, useState } from "react";
import { useMutation, useQuery } from "react-query";
import { API } from "../../config/api";
import { useNavigate, useParams } from "react-router-dom";

export default function EditProduct() {
    document.title  = "Dashboard | Edit Product";

    const [form, setForm]   = useState({
        name            : '',
        stock           : '',
        price           : '',
        description     : '',
        image           : ''
    });
    const [notif, setNotif] = useState({
        success : '',
        error   : ''
    });

    const { id } = useParams();

    const [isLoading, setIsLoading] = useState(false);
    const [preview, setPreview]     = useState(null);
    const navigate  = useNavigate();


    const handleChange  = (e) => {
        setForm({
            ...form,
            [e.target.name] : e.target.type === "file" ? e.target.files : e.target.value
        });
        if (e.target.type === 'file') {
            const url = URL.createObjectURL(e.target.files[0]);
            setPreview(url);
        }
        setNotif({
            success : '',
            error   : ''
        });
    }

    const {data: productData} = useQuery("productCache", async() => {
        try {
            const response  = await API.get("/products/" + id);
            return response.data?.data?.product;
        } catch (error) {
            console.log(error);
        }
    });

    useEffect(()=>{
        setForm({
            name            : productData?.name,
            stock           : productData?.stock,
            price           : productData?.price,
            description     : productData?.description
        });
        setPreview(process.env.REACT_APP_SERVER_URL_FILE + productData?.image);
    },[productData]);

    const handlerSubmit = useMutation( async (e) => {
        try {
            e.preventDefault();
            setIsLoading(true);
            const config    = {
                method  : "PATCH",
                headers : {
                    'Content-Type'  : "multipart/form-data"
                }
            }

            const formData  = new FormData();
            if (typeof form.image === "object"){
                formData.set('image', form.image[0], form.image[0].name);
            }else {
                formData.set('image', form.image);
            }
            formData.set('name', form.name);
            formData.set('stock', form.stock);
            formData.set('price', form.price);
            formData.set('description', form.description);
            const response  = await API.patch("/products/" + id, formData, config);
            if (response) {
                setTimeout(() => {
                    setIsLoading(false);
                }, 1500);
                setTimeout(() => {
                    setNotif(
                        {
                            error: "",
                            success: "Success Update Product"
                        }
                        );
                }, 1000);                    
                setTimeout(() => {
                    navigate('/dashboard');
                }, 2000);                    
            }
        } catch (error) {
            console.log(error);
            if (error) {
                setTimeout(() => {
                    setIsLoading(false);
                    setNotif(
                        {
                            success: "",
                            error: error?.response?.data?.message
                        }
                        );
                }, 500);
            }
        }
    });

    return (
        <>
            <NavbarPartial />
            <div className="box-content mt-5 mb-5 ms-auto me-auto">
                <div className="d-flex">
                    <div className="d-flex flex-column w-50">
                            <h1 className="product-name mt-5 mb-3">Edit Product</h1>
                        <form className="mt-5" onSubmit={(event) => handlerSubmit.mutate(event)}>
                            <div className="mb-3">
                                <input name="name" value={form.name} onChange={handleChange} type="text" className="form-input p-2 mb-1" autoComplete="current-name" id="nameId" />
                            </div>
                            <div className="mb-3">
                                <input name="stock" value={form.stock} onChange={handleChange} type="number" className="form-input p-2 mb-1" autoComplete="current-stock" id="stockId" />
                            </div>
                            <div className="mb-3">
                                <input name="price" value={form.price} onChange={handleChange} type="number" className="form-input p-2 mb-1" autoComplete="current-price" id="priceId" />
                            </div>
                            <div className="mb-3">
                                <textarea name="description" value={form.description} onChange={handleChange} id="descriptionId" className="form-input desc-holder p-2" autoComplete="current-desc" cols="5" rows="4"></textarea>
                            </div>
                            <div className="mb-3 col-md-5 position-relative">
                                <p className="mt-2 ms-2 file-placeholder">Photo Product</p>
                                <img src={clipIcon} alt="cl-icon" className="clip-icon me-3" width={20}  style={{ marginTop: 12 }}/>
                                <input name="image" onChange={handleChange} type="file" className="form-input p-2 mb-1 input-file" autoComplete="current-image" id="imageId" />
                            </div>
                            <div className="d-flex justify-content-center">
                                <div>
                                    
                                    {isLoading 
                                    ?
                                    (
                                    <button type="submit" className="btn-active-waysbeans position-relative btn-waysbeans mt-5" style={{ width: 260, height: 40, fontSize: 20 }}>
                                        <div className="spinner-border text-light position-absolute" role="status" style={{ top: 2, left: "43%"}}>
                                            <span className="visually-hidden">Loading...</span>
                                        </div>
                                    </button>
                                    )
                                    :
                                    (
                                    <div className="d-flex justify-content-center">
                                        <button type="submit" className="btn-active-waysbeans btn-waysbeans mt-5" style={{ width: 260, height: 40, fontSize: 20 }}>Edit Product</button>
                                    </div>
                                    )
                                    }
                                    {notif.error && (<p className="text-danger text-center me-2 mt-5 fs-5" style={{ fontWeight: 500 }}>{notif.error}</p>)}
                                    {notif.success && (<p className="text-success text-center mt-5 me-2 fs-5" style={{ fontWeight: 500 }}>{notif.success}</p>)}
                                </div>
                            </div>
                        </form>
                    </div>
                    <div className="w-50">
                        <div className="d-flex justify-content-center">
                            <img src={preview || NotFoundImage} alt="nfi" width={436} height={555} style={{ marginTop: 50, marginLeft: 100 }}/>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}