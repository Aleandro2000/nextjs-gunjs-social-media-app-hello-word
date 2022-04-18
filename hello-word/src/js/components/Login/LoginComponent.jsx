import React from "react";
import Image from "next/image";
import Link from "next/link";

export default function LoginComponent() {
    return (
        <div className="shadow container mt-5 card text-center">
            <div className="card-body">
                <Image src="/media/logo.png" width={200} height={100} />
                <form>
                    <div className="input-group mb-3 mt-5">
                        <div className="input-group-prepend">
                            <span className="input-group-text" id="basic-addon1">Email</span>
                        </div>
                        <input type="email" name="email" className="form-control" aria-label="username" aria-describedby="basic-addon1" />
                    </div>
                    <div className="input-group mb-3">
                        <div className="input-group-prepend">
                            <span className="input-group-text" id="basic-addon1">Password</span>
                        </div>
                        <input type="password" name="password" className="form-control" aria-label="username" aria-describedby="basic-addon1" />
                    </div>
                    <button type="submit" className="btn btn-primary mb-3"><i className="fa fa-sign-in" /> LOGIN</button>
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