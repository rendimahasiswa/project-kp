import "./App.css";
import { createBrowserRouter } from "react-router-dom";
import { RouterProvider } from "react-router-dom";
import Signin from "./pages/Signin";
import Dashboard from "./pages/Dashboard";
import Beranda from "./pages/Beranda";
import Profil from "./pages/Profil";
import Register from "./pages/Register";
import RegisterAdmin from "./pages/RegisterAdmin";
import EditUsers from "./pages/EditUsers";
import Documents from "./pages/Documents";
import Upload from "./pages/Upload";
import DecryptFile from "./pages/DecryptFile";
import DecryptedList from "./pages/DecryptedList";


const router = createBrowserRouter([
  {
    path: "/",
    element: <Dashboard />,
  },
  { path: "/register", element: <Register /> },
  { path: "/registeradmin", element: <RegisterAdmin /> },
  { path: "/signin", element: <Signin /> },

  {
    path: "/dashboard",
    element: <Dashboard />,
    children: [
      { path: "/dashboard", element: <Content /> },
      { path: "/dashboard/beranda", element: <Beranda /> },
      { path: "/dashboard/content", element: <Content /> },
      { path: "/dashboard/profil", element: <Profil /> },
      { path: "/dashboard/editusers", element: <EditUsers /> },
      { path: "/dashboard/decrypt", element: <DecryptFile /> },
      { path: "/dashboard/upload", element: <Upload /> },
      { path: "/dashboard/open-files", element: <DecryptedList /> },
      { path: "documents", element: <Documents /> },
    ],
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;