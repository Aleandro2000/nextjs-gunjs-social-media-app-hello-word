import React from "react";
import NavbarTemplate from "../Templates/NavbarTemplate";
import HeaderComponent from "./components/HeaderComponent";

export default function Homepage() {
    return (
        <div className="fadeIn">
            <NavbarTemplate />
            <HeaderComponent />
        </div>
    );
}