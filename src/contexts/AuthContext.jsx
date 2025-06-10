import { createContext, useContext, useState } from "react";
import { useSelector } from "react-redux";

const AuthContext = createContext({
    user: null,
    token: null,
    schema: null,
    setUser: () => { },
    setToken: () => { },
    setSchema: () => { }
})

export const ContextProvider = ({ children }) => {
    const [user, setUser] = useState(null)
    const [token, _setToken] = useState(localStorage.getItem('ACCESS_TOKEN'))
    const [schema, _setSchema] = useState(localStorage.getItem('SCHEMA'))
    function setToken(token) {
        _setToken(token)
        if (token) {
            localStorage.setItem('ACCESS_TOKEN', token)
        } else {
            localStorage.removeItem('ACCESS_TOKEN')
        }
    }

    function setSchema(schema) {
        _setSchema(schema)
        if (schema) {
            localStorage.setItem('SCHEMA', schema)
        } else {
            localStorage.removeItem('SCHEMA')
        }
    }

    return <>
        <AuthContext.Provider value={{ user, setUser, token, setToken, schema, setSchema }}>
            {children}
        </AuthContext.Provider>
    </>
}
export const useAuthContext = () => useContext(AuthContext)