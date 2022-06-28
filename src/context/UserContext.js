import { useState, createContext } from "react";


const UserContext   = createContext();


function UserProvider({children}) {
    const [user, setUser]   = useState({empty : true});

    return(
        <UserContext.Provider value={{ user, setUser }}>
            {children}
        </UserContext.Provider>
    );
}


export { UserContext, UserProvider };