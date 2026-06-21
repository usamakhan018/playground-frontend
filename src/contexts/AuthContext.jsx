import { createContext, useContext, useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { getUser, setUser as setReduxUser } from "@/stores/features/authFeature";

const AuthContext = createContext({
    user: null,
    token: null,
    schema: null,
    setUser: () => { },
    setToken: () => { },
    setSchema: () => { }
})

export const ContextProvider = ({ children }) => {
    const dispatch = useDispatch();
    const user = useSelector((state) => state.auth.user);
    const [token, _setToken] = useState(localStorage.getItem('ACCESS_TOKEN'))
    const [schema, _setSchema] = useState(localStorage.getItem('SCHEMA'))

    useEffect(() => {
        if (token && !user) {
            dispatch(getUser());
        }
    }, [token, user, dispatch]);

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

    function setUser(user) {
        dispatch(setReduxUser(user));
    }

    return <>
        <AuthContext.Provider value={{ user, setUser, token, setToken, schema, setSchema }}>
            {children}
        </AuthContext.Provider>
    </>
}
export const useAuthContext = () => useContext(AuthContext)
