 {/* import Turns from "./pages/private/Turns" */}
import Footer from "./components/footer/Footer";
import Hero from "./components/hero/Hero";
import NavBar from "./components/navbar/NavBar";
import Services from "./components/servicios/ServiciosCard";
import Home from "./pages/public/Home";
// import Notificaciones from "./pages/private/Notifications";


function App() {


  return (
    <>
      { <NavBar/>}
     { <Hero />} 
       {<Footer/>}
    {/* <Notificaciones /> */}
    {/*  <Turns/> */}
    {/* <Home /> */}
    
     {/*   {<Services/>} */}
    </>
  )
}

export default App
