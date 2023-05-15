import Login from "./components/Login"
import RegisterPage from "./components/Register";
import ListPage from "./components/ListPage.js"
import React, { useEffect,useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";



export default function Routing() {

  const [cookie,setCookie] = useState(null);


  return (
    <div>
      <BrowserRouter>
        <Routes>
         <Route exact path='/' element={<ListPage setCookie={setCookie} cookie={cookie}/>}/>
         <Route exact path='/login' element={<Login setCookie={setCookie} cookie={cookie} />}/>
         <Route exact path='/register' element={<RegisterPage setCookie={setCookie} cookie={cookie} />}/>
        </Routes>
      </BrowserRouter>
    </div>
  );
}