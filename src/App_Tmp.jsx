import "./App.css";
import { createBrowserRouter } from "react-router-dom";
import { RouterProvider } from "react-router-dom";
import Signin from "./pages/Signin";
import Dashboard from "./pages/Dashboard";
import Beranda from "./pages/Beranda";
import Profil from "./pages/Profil";
import Dokumen from "./pages/Dokumen";
import Content from "./pages/Content";
import Register from "./pages/Register";



const router = createBrowserRouter([
  {
    path: "/",
    element: <Register />,
  },
  { path: "/register", element: <Register/> },
  { path: "/signin", element: <Signin /> },
  {
    path: "/dashboard",
    element: <Dashboard />,
    children: [
      { path: "/dashboard", element: <Content /> },
      { path: "/dashboard/beranda", element: <Beranda /> },
       { path: "/dashboard/content", element: <Content/> },
      { path: "/dashboard/profil", element: <Profil /> },
      { path: "/dashboard/dokumen", element: <Dokumen /> },
    ],
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;