import NavbarPartial from "../../partials/NavbarPartial";
import NavDashboardPartial from "../../partials/NavDashboardPartial";
import successIcon  from "../../assets/image/icon/success-icon.png";
import waitingIcon  from "../../assets/image/icon/waiting-icon.png";
import cancelIcon  from "../../assets/image/icon/cancel-icon.png";
import { useQuery } from "react-query";
import { API } from "../../config/api";
import { useState } from "react";

export default function TransactionPage() {
    document.title  = "Dashboard | Transactions";
    const [transactions, setTransactions]  = useState([]);
    const { refetch } = useQuery("transactionCache", async () => {
        const response = await API.get("/transactions");
        setTransactions(response.data?.data?.transactions);
    });

    const changeHandler = async (status, id) => {
        try {
            const config = {
                method  : "PATCH",
                headers : {
                    'Content-Type'  : "application/json"
                }
            }
            const response  = await API.patch("/transactions/" + id, {status}, config);
            if (response) {
                refetch();
            }
        } catch (error) {
            console.log(error);
        }
    }
    return(
        <>
        <NavbarPartial />
        <div className="box-content mt-5 mb-5 ms-auto me-auto">
            <NavDashboardPartial />
        </div>
        <div className="container">
            <div className="row">
                <h1 className="product-name mt-5">Income transaction</h1>
            </div>
        </div>
        <div className="box-content mt-3 mb-5 ms-auto me-auto">
            <table className="table table-hover table-bordered">
                <thead>
                    <tr className="table-header">
                        <th scope="col">No</th>
                        <th scope="col">Name</th>
                        <th scope="col">Product Order</th>
                        <th scope="col">Status</th>
                        <th scope="col" className="text-center">Action</th>
                    </tr>
                </thead>
                <tbody>
                    {transactions && transactions.map((item, index) => (
                        <>
                        <tr style={{ fontWeight: 600 }}>
                            <td>{(index + 1) + index++}</td>
                            <td>{item?.buyer?.fullname}</td>
                            <td>{item?.product?.name}</td>
                            <td className={"status-"+ item?.status + " fs-5"}>{item?.status === "approve" ? "On The Way" : item?.status}</td>
                            {item?.status === "success" && (
                            <td className="text-center">
                                <button onClick={changeHandler.bind(this, "cancel", item?.id)} className="btn btn-sm btn-danger danger">Cancel</button>
                                <button onClick={changeHandler.bind(this, "approve", item?.id)} className="btn btn-sm btn-success safe">Approve</button>
                            </td>
                            )}
                            {item?.status === "cancel" && (
                            <td className="justify-content-center d-flex">
                                <div className="img-icon">
                                    <img src={cancelIcon} className="img-fluid" alt="scsIcon" />
                                </div>
                            </td>
                            )}
                            {item?.status === "approve" && (
                            <td className="justify-content-center d-flex">
                                <div className="img-icon">
                                    <img src={successIcon} className="img-fluid" alt="scsIcon" />
                                </div>
                            </td>
                            )}
                            {item?.status === "pending" && (
                            <td className="justify-content-center d-flex">
                                <div className="img-icon">
                                    <img src={waitingIcon} className="img-fluid" alt="scsIcon" />
                                </div>
                            </td>
                            )}
                        </tr>
                        </>
                    ))}
                    {/* <tr style={{ fontWeight: 600 }}>
                        <td>2</td>
                        <td>Sugeng No Pants</td>
                        <td>RWANDA Beans</td>
                        <td className="text-success">Success</td>
                        <td className="justify-content-center d-flex">
                            <div className="img-icon">
                                <img src={successIcon} className="img-fluid" alt="scsIcon" />
                            </div>
                        </td>
                    </tr>
                    <tr style={{ fontWeight: 600 }}>
                        <td>3</td>
                        <td>Sugeng No Pants</td>
                        <td>RWANDA Beans</td>
                        <td className="text-danger">Cancel</td>
                        <td className="justify-content-center d-flex">
                            <div className="img-icon">
                                <img src={cancelIcon} className="img-fluid" alt="scsIcon" />
                            </div>
                        </td>
                    </tr> */}
                </tbody>
            </table>
        </div>
        </>
    );
}