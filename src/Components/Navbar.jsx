import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";

export function Navbar() {

  // hooks for checking current url and setting current active url
  const location = useLocation();
  const [activeLink, setActiveLink] = useState("");

  useEffect(() => {
    // checks current url, utilizes useState to set active link
    switch(location.pathname)
    {
      case "/":
        setActiveLink("main");
        break;
      case "/data":
        setActiveLink("data");
        break;
      case "/sources":
        setActiveLink("sources");
        break;
    }
  }, [location.pathname]); // runs useEffect each time location.pathname changes 

  return (
    <nav id="nav">
      <Link
        id="mainNavLink"
        to="/"
        style={{backgroundColor: activeLink === "main" ? "#222" : ""}}
      >
        <div>Main</div>
      </Link>
      <Link
        id="dataNavLink"
        to="/data"
        style={{backgroundColor: activeLink === "data" ? "#222" : ""}}
      >
        <div>Data</div>
      </Link>
      <Link
        id="sourcesNavLink"
        to="/sources"
        style={{backgroundColor: activeLink === "sources" ? "#222" : ""}}
      >
        <div>Sources</div>
      </Link>
    </nav>
  );
}
