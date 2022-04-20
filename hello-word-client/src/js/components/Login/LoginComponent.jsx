import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { login } from "../../utils";

export default function LoginComponent() {
    const [loading, setLoading] = useState(false);

    const handleSubmit =  async e => {
        e.preventDefault();
        const { username, password } = e.target;

        setLoading(true);
        await login(username.value, password.value, true);
        setLoading(false);
    };

    return (
        <div className="shadow container mt-5 card text-center">
            <div className="card-body">
                <Image src="/media/logo.png" width={200} height={100} />
                <form onSubmit={handleSubmit}>
                    <div className="input-group mb-3 mt-5">
                        <div className="input-group-prepend">
                            <span className="input-group-text" id="basic-addon1">Username</span>
                        </div>
                        <input type="text" name="username" className="form-control" aria-label="username" aria-describedby="basic-addon1" />
                    </div>
                    <div className="input-group mb-3">
                        <div className="input-group-prepend">
                            <span className="input-group-text" id="basic-addon1">Password</span>
                        </div>
                        <input type="password" name="password" className="form-control" aria-label="username" aria-describedby="basic-addon1" />
                    </div>
                    <button type="submit" className="btn btn-primary mb-3">
                        {
                            loading ? <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true" /> : <i className="fa fa-sign-in" />
                        } LOGIN    
                    </button>
                    <hr />
                    <div className="my-3">
                        <Link href="/register">
                            Are you not registred?
                        </Link>
                    </div>
                </form>
            </div>
        </div>
    );
}