import NavbarPartial from "../../partials/NavbarPartial";
import clipIcon from "../../assets/image/icon/clip-icon.png";
import NotFoundImage from "../../assets/image/NotFoundImage.jpg";
import { useState } from "react";
import { useMutation } from "react-query";
import { API } from "../../config/api";

export default function AddProduct() {
    document.title  = "Dashboard | Add Product";

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

    const [isLoading, setIsLoading] = useState(false);
    const [preview, setPreview]     = useState(null);

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
    const handlerSubmit = useMutation( async (e) => {
        try {
            e.preventDefault();
            setIsLoading(true);
            const config    = {
                method  : "POST",
                headers : {
                    'Content-Type'  : "multipart/form-data"
                }
            }
            const imgId = document.getElementById("imageId");

            const formData  = new FormData();
            if (typeof form.image === "object" && form.name && form.stock && form.price && form.description) {
                formData.set('image', form.image[0], form.image[0].name);
            }
            formData.set('name', form.name);
            formData.set('stock', form.stock);
            formData.set('price', form.price);
            formData.set('description', form.description);
            const response  = await API.post("/products", formData, config);

            if (response) {
                setTimeout(() => {
                    setIsLoading(false);
                    setNotif(
                        {
                            success: "Success Add Product",
                            error: ""
                        }
                        );
                    setForm({
                            name            : '',
                            stock           : '',
                            price           : '',
                            description     : '',
                            image           : ''
                        });
                    setPreview(null);
                    imgId.value = "";
                }, 1500);
            }
        } catch (error) {
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
                            <h1 className="product-name mt-5 mb-3">Add Product</h1>
                        <form className="mt-5" onSubmit={(event) => handlerSubmit.mutate(event)}>
                            <div className="mb-3">
                                <input name="name" value={form.name} onChange={handleChange} type="text" className="form-input p-2 mb-1" autoComplete="current-name" id="nameId" placeholder="Product Name" />
                            </div>
                            <div className="mb-3">
                                <input name="stock" value={form.stock} onChange={handleChange} type="number" className="form-input p-2 mb-1" autoComplete="current-stock" id="stockId" placeholder="Stock" />
                            </div>
                            <div className="mb-3">
                                <input name="price" value={form.price} onChange={handleChange} type="number" className="form-input p-2 mb-1" autoComplete="current-price" id="priceId" placeholder="Price" />
                            </div>
                            <div className="mb-3">
                                <textarea name="description" value={form.description} onChange={handleChange} id="descriptionId" className="form-input desc-holder p-2" autoComplete="current-desc" cols="5" placeholder="Description Product" rows="4"></textarea>
                            </div>
                            <div className="mb-3 col-md-5 position-relative">
                                <p className="mt-2 ms-2 file-placeholder">Photo Product</p>
                                <img src={clipIcon} alt="cl-icon" className="clip-icon me-3" width={20}  style={{ marginTop: 12 }}/>
                                <input name="image" onChange={handleChange} type="file" className="form-input p-2 mb-1 input-file" autoComplete="current-image" id="imageId" />
                            </div>
                            <div className="d-flex justify-content-center">
                                <div>
                                    {notif.error && (<p className="text-danger text-center mt-2 me-2 fs-5" style={{ fontWeight: 500 }}>{notif.error}</p>)}
                                    {notif.success && (<p className="text-success text-center mt-2 me-2 fs-5" style={{ fontWeight: 500 }}>{notif.success}</p>)}
                                    {isLoading 
                                    ?
                                    (
                                    <div className="d-flex justify-content-center mt-5">
                                        <button type="submit" className="btn-active-waysbeans position-relative btn-waysbeans" style={{ width: 260, height: 40, fontSize: 20 }}>
                                            <div className="spinner-border text-light position-absolute" role="status" style={{ top: 2, left: "43%"}}>
                                                <span className="visually-hidden">Loading...</span>
                                            </div>
                                        </button>
                                    </div>
                                    )
                                    :
                                    (
                                        <div className="d-flex justify-content-center">
                                            <button type="submit" className="btn-active-waysbeans btn-waysbeans mt-5" style={{ width: 260, height: 40, fontSize: 20 }}>Add Product</button>
                                        </div>
                                    )}
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