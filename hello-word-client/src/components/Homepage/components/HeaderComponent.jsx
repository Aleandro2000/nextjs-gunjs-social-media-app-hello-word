import React from "react";

export default function HeaderComponent() {
    return (
        <div className="container mt-5 p-5">
            <div className="columns is-centered">
                <div className="column">
                    <div className="box has-background-white-ter">
                        <div className="is-size-1">
                            Hello Word!
                        </div>
                        <div className="is-size-4">
                            And welcome to the only truly decentralized social media platform! From now, you may own your data without any big tech company. ;)
                        </div>
                    </div>
                </div>
                <div className="column">
                    <img alt="Cat in space" className="shake" src="/media/catinspace.png" />
                </div>
            </div>
        </div>
    );
}