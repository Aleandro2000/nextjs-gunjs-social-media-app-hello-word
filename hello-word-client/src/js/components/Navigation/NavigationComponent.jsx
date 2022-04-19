import * as React from "react";
import Image from "next/image";

export default function ButtonAppBar() {
    return (
        <nav className="navbar navbar-expand-lg navbar-light bg-light shadow">
            <div className="container container-fluid">
                <a className="navbar-brand" href="#">
                    <Image src="/media/logo.png" width={110} height={55} />
                </a>
                <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbar" aria-controls="navbar" aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse" id="navbar">
                    <div className="navbar-nav ms-auto text-center">
                        <a className="nav-link" href="#">Login</a>
                        <a className="nav-link" href="#">Register</a>
                    </div>
                </div>
            </div>
        </nav>
    );
}