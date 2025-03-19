import React from "react";
import { createBrowserRouter } from "react-router-dom";
import Home from "../components/pages/home/Home";
import Editor from "../components/pages/editor/Editor";

export const router = createBrowserRouter([
    {
        path:'/',
        element:<Home/>
    },
    {
        path:'/editor',
        element:<Editor/>
    }
])