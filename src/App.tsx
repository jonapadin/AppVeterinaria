 {/* import Turns from "./pages/private/Turns" */}
import Footer from "./components/footer/Footer";
import NavBar from "./components/navbar/NavBar";
import Services from "./components/servicios/ServiciosCard";
import Home from "./pages/public/Home";
// import Notificaciones from "./pages/private/Notifications";


function App() {


  return (
    <>
      { <NavBar/>}
       {<Services/>}
       {<Footer/>}
    {/* <Notificaciones /> */}
    {/*  <Turns/> */}
    {/* <Home /> */}
    </>
  )
}

export default App
