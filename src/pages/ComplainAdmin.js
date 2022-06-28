import NavbarPartial from "../partials/NavbarPartial";
import masTampan from "../assets/image/MASTAMPAN.png";
import sendIcon from "../assets/image/icon/send-icon.png";
import { io } from"socket.io-client";
import { useState, useEffect, useContext } from "react";
import { UserContext }  from "../context/UserContext";



let socket;
export default function ComplainAdmin() {
    document.title  = "Complain";

    const [contact, setContact] = useState(null); // data contact yang di klik
    const [contacts, setContacts] = useState([]); // data contact dari server hasil kita klik
    const [messages, setMessages] = useState([]);


    const { user }   = useContext(UserContext);

    useEffect(() =>{
        socket = io(process.env.REACT_APP_SERVER_URL || 'http://localhost:5000', {
            auth: {
                token: localStorage.getItem("token") // we must set options to get access to socket server
            },
            query: {
                id: user?.id
            }
        });
        socket.on("new message", () => {
            console.log("contact : ", contact);
            socket.emit("load messages", contact?.id);
        });

        loadContacts();
        loadMessages();
    
        // listen error sent from server
        socket.on("connect_error", (err) => {
            console.error(err.message); // not authorized
        });
        
        return () => {
            socket.disconnect()
        }
    }, [messages]);


    const loadContacts  = () => {
        socket.emit("load customer contacts");

        socket.on("customer contacts", (data) => {
            let dataContacts    = data.map(item => ({
                ...item,
                message : "Click here to start message"
            }));
            setContacts(dataContacts);
        });
    }

    const onClickContact  = (data) => {
        setContact(data);
        socket.emit("load messages", data.id);
    }

    const loadMessages = () => {
        socket.on("messages", (data) => {
            if (data.length > 0) {
                const dataMessages = data.map((item) => ({
                    idSender: item.sender.id,
                    message: item.message
                }))
                setMessages(dataMessages);
            }
            loadContacts();
        });
    }

    const onSendMessage = (e) => {
        if (e.key === 'Enter') {
            const data = {
                idRecipient: contact.id,
                message: e.target.value
            }

            socket.emit("send message", data);
            e.target.value = "";
        }
    }

    return (
        <>
            <NavbarPartial />
            <div className="box-content mt-5 mb-5 ms-auto me-auto">
                <div className="d-flex gap-5">

                    {contacts.length > 0 && (
                    <>
                    <div style={{ width: "30%" }} className="mt-4">
                    <div className="list-group" style={{ backgroundColor: "#DFDFDF", borderRadius: 10 }}>
                    {contacts.map(item => (
                            <div key={item?.id}>
                                <div className="d-flex p-3">
                                    <img src={item?.image || masTampan} className="rounded-circle" alt="av" width={55} height={55} />
                                    <button type="button" onClick={onClickContact.bind(this, item)} className="user-button list-group-item list-group-item-action">
                                        {item?.fullname}
                                    </button>
                                </div>
                                <hr className="text-secondary ms-3 my-0 pembatas mb-4" style={{ width: "85%" }} />
                            </div>
                        ))}
                        </div>
                    </div>
                    </>
                    )}

                    <div style={{ width: "70%" }} className="mt-4">
                        {contact 
                        &&
                        (
                        <div style={{ backgroundColor: "#C4C4C4", borderRadius: "10px 10px 0 0" }}>
                            <div className="d-flex p-3">
                                <img src={contact?.image} className="rounded-circle" alt="av" width={55} height={55} />
                                <div className="d-flex ms-3 flex-column">
                                    <h4 className="mb-2">{contact?.fullname}</h4>
                                    <p className="my-0">🟢 online</p>
                                </div>
                            </div>
                        </div>
                        )}
                        
                        <div className="d-flex flex-column justify-content-end" style={{ backgroundColor: "#DFDFDF", height: "70vh", borderRadius: "0 0 10px 10px" }}>

                            {contact 
                            ? (
                                <>
                                <div className="chat-canvas mt-3">
                                        {messages.map((item, index) => (
                                            <div key={index}>
                                            {item.idSender === user.id
                                            ?
                                            (
                                            <div className="d-flex  me-5 justify-content-end" >
                                                <p className="bg-white p-2" style={{ borderRadius: 10, fontWeight: 500 }}>{item.message}</p>
                                            </div>
                                            )
                                            :
                                            (
                                            <div className="d-flex ms-5 " >
                                                <p className="bg-white p-2" style={{ borderRadius: 10, fontWeight: 500 }}>{item.message}</p>
                                            </div>
                                            )}
                                            </div>
                                        ))}
                                </div>
                                    <div className="d-flex gap-2 mt-3">
                                        <input type="text" onKeyDown={onSendMessage} name="messageInput" id="messageId" className="mb-5 ms-5 col-md-9 p-3 input-chat" placeholder="Write your message here ..."/>
                                        <button className="btn" style={{ height: 53, borderRadius: 10, backgroundColor: "#8AD0D0" }}>
                                            <img src={sendIcon} alt="sIcn" className="px-3" />
                                        </button>
                                    </div>
                                </>
                            )
                        :(
                            <>
                                <h1 className="ms-5">Click Contact First!</h1>
                            </>
                        )}

                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}