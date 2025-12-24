import {createBrowserRouter} from "react-router-dom";
import App from "./App.jsx";
import Signin from "./pages/Signin.jsx";
import Register from "./pages/Register.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import Beranda from "./pages/Beranda.jsx";
import Profil from "./pages/Profil.jsx";
import Dokumen from "./pages/Dokumen.jsx";  
export const router = createBrowserRouter


([
    {path: "/", element:<App/>},
    {path: "/register", element:<Register/>},  
    {path: "/signin", element:<Signin/>},  
    {path: "/dashboard", element:<Dashboard/>},
    {path: "/beranda", element:<Beranda/>},
    {path: "/profil", element:<Profil/>},
    {path: "/dokumen", element:<Dokumen/>},
]);