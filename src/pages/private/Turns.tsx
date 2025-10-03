import Footer from "../../components/footer/Footer"
import FormTurns from "../../components/Forms/FormTurns"
import NavBar from "../../components/navbar/NavBar"

function Turns() {
  return (
    <>
    <NavBar />
    <main className="flex flex-col items-center justify-center">
    <FormTurns/>
    </main>

    <Footer />
    </>
  )
}

export default Turns