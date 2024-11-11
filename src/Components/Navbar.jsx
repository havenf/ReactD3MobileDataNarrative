import React from "react";
import { Link } from "react-router-dom";

export function Navbar() {
  return (
    <nav id="nav">
      <Link to={''}>
        <div>
            Main
        </div>
      </Link>
      <Link to={'stuff'}>
        <div>
            Data
        </div>
      </Link>
    </nav>
  )
}