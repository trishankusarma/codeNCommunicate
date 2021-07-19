import React, { useState, useEffect, useContext } from "react";
import "./navbar.css";

import { Link, useHistory } from "react-router-dom";

import CommonContext from "../../contexts/common/CommonContext";

import Cookie from "js-cookie";

const Navbar = () => {
  const history = useHistory();

  const { isLogged, logOut ,  activeLi,  setActiveLi } = useContext(CommonContext);

  useEffect(()=>{

    console.log(window.location.pathname)

    switch(window.location.pathname){
       
      case '/':
         setActiveLi(0)
         break
      
      case '/public/doubts':
         setActiveLi(1)
         break
      
      case "/public/add":
        !Cookie.get('authorization') ?  setActiveLi(6) : setActiveLi(2)
        break
      
      case "/public/myCommunity":
        !Cookie.get('authorization') ?  setActiveLi(6) : setActiveLi(3)
        break
      
      case "/public/upcoming":
        setActiveLi(4)
        break

      case "/user":
        !Cookie.get('authorization') ?  setActiveLi(6) : setActiveLi(5)
        break
      
      case "/user/login":
        setActiveLi(6)
        break
    }
},[window.location.pathname])

  const logOUT = async ()=>{

    await logOut()

    if (!isLogged) {
      
      setActiveLi(0)

      setTimeout(()=>{
        history.push("/user/login")
      },2000)
    }
  }

  const activeStyle = {
    borderTop: "4px solid white",
    borderBottom: "4px solid white",
    padding: "6px 0",
  };

  return (
    <div className="navbarContainer">
      <nav
        className="navbar navbar-expand-lg navbar-collapse-md  navbar-dark"
        style={{ backgroundColor: "#0f2c5e", height: "15vh" }}
      >
        <div className="container">
          <div className="logo row">
            <img
              src="https://cdn.dribbble.com/users/25514/screenshots/14753723/coinread_logo_animation.png?compress=1&resize=400x300"
              alt=""
              style={{
                height: "12vh",
                width: "15vh",
                position: "absolute",
                top: "1.5vh",
                left: "0vw",
              }}
            />
            <Link
              className="navbar-brand"
              to="/"
              style={{ color: "white" }}
              style={{ position: "relative", left: "-7vw", fontSize: "2rem" }}
            >
              codeNcommunicate
            </Link>
          </div>

          <div className="collapse navbar-collapse" id="navbarSupportedContent">
            <ul className="navbar-nav mr-auto">
              <li className="nav-item">
                <Link
                  className="nav-link"
                  to="/"
                  onClick={() => setActiveLi(0)}
                  style={activeLi === 0 ? activeStyle : null}
                >
                  <strong>Home</strong>
                </Link>
              </li>

              <li className="nav-item">
                <Link
                  className="nav-link"
                  to="/public/doubts"
                  onClick={() => setActiveLi(1)}
                  style={activeLi === 1 ? activeStyle : null}
                >
                  <strong>Doubts</strong>
                </Link>
              </li>

              <li className="nav-item">
                <Link
                  className="nav-link"
                  to="/public/add"
                  onClick={() => {
                    Cookie.get('authorization') ?
                        setActiveLi(2)   :
                        setActiveLi(6)
                  }}
                  style={activeLi === 2 ? activeStyle : null}
                >
                  <strong>Add_Edit</strong>
                </Link>
              </li>

              <li className="nav-item">
                <Link
                  className="nav-link"
                  to="/public/myCommunity"
                  onClick={() => {
                    Cookie.get('authorization') ?
                    setActiveLi(3)   :
                    setActiveLi(6)
                  }}
                  style={activeLi === 3 ? activeStyle : null}
                >
                  <strong>My Community</strong>
                </Link>
              </li>

              <li className="nav-item">
                <Link
                  className="nav-link"
                  to="/public/upcoming"
                  onClick={() => setActiveLi(4)}
                  style={activeLi === 4 ? activeStyle : null}
                >
                  <strong>Upcoming Contests</strong>
                </Link>
              </li>

              <li className="nav-item">
                <Link
                  className="nav-link"
                  to="/user"
                  onClick={() => {
                    Cookie.get('authorization') ?
                        setActiveLi(5)   :
                        setActiveLi(6)
                  }}
                  style={activeLi === 5 ? activeStyle : null}
                >
                  <strong>Profile</strong>
                </Link>
              </li>
            </ul>
            <ul className="navbar-nav ml-auto">
              {isLogged ? (
                <li className="nav-item">
                  <button onClick={logOUT} style={{backgroundColor:'transparent'}}>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="30"
                      height="30"
                      fill="white"
                      className="bi bi-box-arrow-right"
                      viewBox="0 0 16 16"
                    >
                      <path
                        fill-rule="evenodd"
                        d="M10 12.5a.5.5 0 0 1-.5.5h-8a.5.5 0 0 1-.5-.5v-9a.5.5 0 0 1 .5-.5h8a.5.5 0 0 1 .5.5v2a.5.5 0 0 0 1 0v-2A1.5 1.5 0 0 0 9.5 2h-8A1.5 1.5 0 0 0 0 3.5v9A1.5 1.5 0 0 0 1.5 14h8a1.5 1.5 0 0 0 1.5-1.5v-2a.5.5 0 0 0-1 0v2z"
                      />
                      <path
                        fill-rule="evenodd"
                        d="M15.854 8.354a.5.5 0 0 0 0-.708l-3-3a.5.5 0 0 0-.708.708L14.293 7.5H5.5a.5.5 0 0 0 0 1h8.793l-2.147 2.146a.5.5 0 0 0 .708.708l3-3z"
                      />
                    </svg>
                    <strong style={{padding:'1rem',color:"white"}}>Logout</strong>
                  </button>
                </li>
              ) : (
                <li className="nav-item">
                  <Link
                    className="nav-link"
                    to="/user/login"
                    onClick={() => setActiveLi(6)}
                    style={activeLi === 6 ? activeStyle : null}
                  >
                    <strong>Login_Register</strong>
                  </Link>
                </li>
              )}
            </ul>
          </div>
        </div>
      </nav>
    </div>
  );
};

export default Navbar;
