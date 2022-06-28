import { useState } from "react";
import { useMutation, useQuery } from "react-query";
import { Link } from "react-router-dom";
import { API } from "../config/api";
import NavbarPartial from "../partials/NavbarPartial";
import NavDashboardPartial from "../partials/NavDashboardPartial";

export default function DashboardPage() {
    document.title  = "Dashboard | Products";

    const [product, setProduct] = useState([]);
    const [productId, setProductId] = useState(null);
    const {refetch} = useQuery("productCache", async () => {
        const response  = await API.get("/products");
        setProduct(response.data.data.product);
    });

    const formatterPrice    = new Intl.NumberFormat("id-ID", {
        style       : "currency",
        currency    : "IDR"
    });

    const deleteHandler     = useMutation(async (e) => {
        e.preventDefault();
        try {
            const response  = await API.delete("/products/" + productId);
            if(response){
                refetch();
                setProductId(null);
            }
        } catch (error) {
            console.log(error);
        }
    });

    

    return(
        <>
        <NavbarPartial />
        <div className="box-content mt-5 mb-5 ms-auto me-auto">
            <NavDashboardPartial />
        </div>
        <div className="container">
            <div className="row">
                <div className="d-flex justify-content-between">
                    <h1 className="table-title product-name mt-5">List products</h1>
                    <Link to="add-product" className="text-decoration-none btn btn-primary mt-5 mb-4">Add</Link>
                </div>
            </div>
        </div>
        <div className="box-content mt-3 mb-5 ms-auto me-auto">
            <table className="table table-hover table-bordered">
                <thead>
                    <tr className="table-header">
                        <th scope="col">No</th>
                        <th scope="col">Photo</th>
                        <th scope="col">Product Name</th>
                        <th scope="col">Product Desc</th>
                        <th scope="col">Price</th>
                        <th scope="col">Qty</th>
                        <th scope="col" className="text-center">Action</th>
                    </tr>
                </thead>
                <tbody>
                    {product && product?.map((item, index) => (
                        <tr style={{ fontWeight: 600 }} key={item?.id}>
                            <td>{index + 1}</td>
                            <td>{item?.name}</td>
                            <td><a href={process.env.REACT_APP_SERVER_URL_FILE + item?.image} target="_blank" rel="noreferrer" className="text-secondary">{String(process.env.REACT_APP_SERVER_URL_FILE + item?.image).slice(0,15)}...</a></td>
                            <td>{String(item?.description).length > 15 ? String(item?.description).slice(0,15) + "..." : item?.description}</td>
                            <td>{formatterPrice.format(item?.price)}</td>
                            <td>{item?.stock}</td>
                            <td className="text-center">
                                <Link to={"edit-product/" + item?.id} className="text-decoration-none btn btn-sm btn-success safe me-2">Edit</Link>
                                <button className="text-decoration-none btn btn-sm btn-danger danger ms-2" onClick={() => setProductId(item?.id)} data-bs-toggle="modal" data-bs-target="#deleteModal">Delete</button>
                            </td>
                        </tr>
                    ))}
                    
                </tbody>
            </table>
            <div className="modal fade" id="deleteModal" tabIndex="-1" aria-labelledby="deleteModalLabel" aria-hidden="true">
                <div className="modal-dialog modal-dialog-centered">
                    <div className="modal-content">
                        <div className="modal-body text-black mt-3 mb-3">
                            <h4 className='fw-bold'>Deleted Data</h4>
                            <p>Are you sure you want to delete this data?</p>
                        </div>
                        <div className="d-flex justify-content-end mb-4 gap-3" style={{ width: '95%' }}>
                            <button type='button' onClick={e => deleteHandler.mutate(e)} id='delete' data-bs-dismiss="modal" className="btn editbtn" style={{ width: '25%' }}>Yes</button>
                            <button type="button" className="btn cancelbtn" data-bs-dismiss="modal" style={{ width: '25%'}}>No</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        </>
    );
}