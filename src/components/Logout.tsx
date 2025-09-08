import { useNavigate } from "react-router-dom";
const Logout = ()=>{
    const navigate = useNavigate();
    const handleLogout = ()=>{
        localStorage.clear();
        navigate("/");
    }
    return <>
    <button onClick={handleLogout}>Click here to logout</button>
    </>
}
export default Logout;