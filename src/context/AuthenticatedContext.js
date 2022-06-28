import { useState, createContext } from "react";

const LoginContext  = createContext();

function LoginProvider({children}) {
    const [isLogin, setIsLogin] = useState(false);
    return(
        <LoginContext.Provider value={{ isLogin, setIsLogin }}>
            {children}
        </LoginContext.Provider>
    );
}


export { LoginContext, LoginProvider };