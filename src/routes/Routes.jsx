import { createBrowserRouter } from "react-router-dom";
import Root from "../layout/Root";
import Login from "../pages/Login";
import Register from "../pages/Register";

export const router = createBrowserRouter([
    {
        path: "/",
        element: <Root />,
        children: [
            {
                index: true,
                element: <Login />
            },
            {
                path:'/register',
                element: <Register/>
            }
        ]
    },
]);