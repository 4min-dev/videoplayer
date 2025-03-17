import React from "react";
import { createBrowserRouter } from "react-router-dom";
import Home from "../components/pages/home/Home";

export const router = createBrowserRouter([
    {
        path:'/',
        element:<Home/>
    }
])