import { useContext, useEffect, useState } from "react";
import NavbarPartial from "../partials/NavbarPartial";
import clipIcon from "../assets/image/icon/clip-icon.png";
import NotFoundImage from "../assets/image/NotFoundImage.jpg";
import { useMutation, useQuery } from "react-query";
import { API } from "../config/api";
import { useNavigate, useParams } from "react-router-dom";
import { UserContext } from "../context/UserContext";


export default function UpdateProfilePage() {
    document.title  = "Profile | Update";

    const { id }    = useParams();
    const { user }  = useContext(UserContext);
    const [isLoading, setIsLoading]   = useState(false);
    const [form, setForm]   = useState({
        image       : "",
        fullname    : "",
        postcode    : "",
        phone       : "",
        address     : "",
        gender      : ""
    });
    
    const navigate  = useNavigate();

    const [notif, setNotif] = useState({
        success : '',
        error   : ''
    });

    const [preview, setPreview] = useState(null);

    const { data: profileData } = useQuery("profileCache", async () => {
        const response  = await API.get("/profiles/" + id);
        return response.data.data.profile;
    });


    const handleChange = (e) => {
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
                method  : "PATCH",
                headers : {
                    'Content-Type'  : "multipart/form-data"
                }
            }
            const config2    = {
                method  : "PATCH",
                headers : {
                    'Content-Type'  : "application/json"
                }
            }

            const formData  = new FormData();
            // const formDataUser  = new FormData();
            if (typeof form.image === "object"){
                formData.set('image', form.image[0], form.image[0].name);
            }else {
                formData.set('image', form.image);
            }
            // formDataUser.set('fullname', form.fullname);
            formData.set('postcode', form.postcode);
            formData.set('phone', form.phone);
            formData.set('address', form.address);
            formData.set('gender', form.gender);
            await API.patch("/users/" + id, { fullname: form.fullname }, config2);
            const response  = await API.patch("/profiles/" + id, formData, config);
            if (response) {
                setTimeout(() => {
                    setIsLoading(false);
                }, 1500);
                setTimeout(() => {
                    setNotif(
                        {
                            error: "",
                            success: "Success Update Profile"
                        }
                        );
                }, 1000);
                setTimeout(() => {
                    const taga      = document.createElement('a');
                    taga.href       = "/profile";
                    taga.click();
                }, 2000);
            }
        } catch (error) {
            if (error) {
                setTimeout(() => {
                    setIsLoading(false);
                    setNotif(
                        {
                            success: "",
                            error: error.response.data.message
                        }
                        );
                }, 500);
            }

        }
    });
    useEffect(() => {
        setForm({
            fullname    : user.name || "",
            postcode    : profileData?.postcode || "",
            phone       : profileData?.phone || "",
            address     : profileData?.address || "",
            gender      : profileData?.gender || ""
        });
        setPreview(process.env.REACT_APP_SERVER_URL_FILE + profileData?.image);
    }, [profileData]);


    return(
        <>
            <NavbarPartial />
            <div className="box-content mt-5 mb-5 ms-auto me-auto">
                <h1 className="mt-5 profile-title">Edit Profile</h1>
                <form className="mt-5" onSubmit={(event) => handlerSubmit.mutate(event)}>
                    <div className="container">
                        <div className="row">
                            <div className="d-flex justify-content-center">
                                <img src={preview || NotFoundImage} alt="nfi" width={236} height={255}/>
                            </div>
                        </div>
                    </div>
                    <div className="mb-3 col-md-5 position-relative mt-5">
                        <p className="mt-2 ms-2 file-placeholder">Photo</p>
                        <img src={clipIcon} alt="cl-icon" className="clip-icon me-3" width={20}  style={{ marginTop: 12 }}/>
                        <input name="image" onChange={handleChange} type="file" className="form-input p-2 mb-1 input-file" autoComplete="current-image" id="imageId" />
                    </div>
                    <div className="mb-3">
                        <input name="fullname" value={form.fullname} onChange={handleChange} type="text" className="form-input p-2 mb-1" autoComplete="current-fullname" id="fullnameId" placeholder="Full Name" />
                    </div>
                    <div className="mb-3">
                        <input name="postcode" min={0} value={form.postcode} onChange={handleChange} type="number" className="form-input p-2 mb-1" autoComplete="current-postcode" id="postcodeId" placeholder="postcode" />
                    </div>
                    <div className="mb-3">
                        <input name="phone" min={0} value={form.phone} onChange={handleChange} type="number" className="form-input p-2 mb-1" autoComplete="current-phone" id="phoneId" placeholder="phone" />
                    </div>
                    <div className="mb-3">
                        <textarea name="address" value={form.address} onChange={handleChange} id="addressId" className="form-input desc-holder p-2" autoComplete="current-address" cols="5" placeholder="Address" rows="4"></textarea>
                    </div>
                    <div className="mb-3">
                        <input name="gender" value={form.gender} onChange={handleChange} type="text" className="form-input p-2 mb-1" autoComplete="current-gender" id="genderId" placeholder="Gender" />
                    </div>
                    <div className="d-flex justify-content-center">
                        <div>
                            <div>
                                {notif.error && (<p className="text-danger text-center me-2 mt-2 fs-5" style={{ fontWeight: 500 }}>{notif.error}</p>)}
                                {notif.success && (<p className="text-success text-center mt-2 me-2 fs-5" style={{ fontWeight: 500 }}>{notif.success}</p>)}
                            </div>
                            {isLoading 
                            ?
                            (
                            <div className="d-flex justify-content-center">
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
                                <button type="submit" className="btn-active-waysbeans btn-waysbeans" style={{ width: 260, height: 40, fontSize: 20 }}>Edit Profile</button>
                            </div>
                            )
                            }
                            
                        </div>
                    </div>
                </form>
            </div>
            
        </>
    )
}