import { createBrowserRouter } from "react-router-dom";
import Root from "../layout/Root";
import Login from "../pages/Login";
import Register from "../pages/Register";
import Home from "../pages/Home";
import CashIn from "../pages/CashIn";
import CashOut from "../pages/CashOut";
import SendMoney from "../pages/SendMoney";
import Transactions from "../pages/Transactions";
import Profile from "../pages/Profile";

export const router = createBrowserRouter([
    {
        path: "/",
        element: <Root />,
        children: [
            {
                index: true,
                element: <Home />
            },
            {
                path:'/register',
                element: <Register/>
            },
            {
                path:'/login',
                element: <Login/>
            },
            {
                path:'/cash-in',
                element: <CashIn/>
            },
            {
                path:'/cash-out',
                element: <CashOut/>
            },
            {
                path:'/send-money',
                element: <SendMoney/>
            },
            {
                path:'/transactions',
                element: <Transactions/>
            },
            {
                path:'/profile',
                element: <Profile/>
            },
        ]
    },
]);