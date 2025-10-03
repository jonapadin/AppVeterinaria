import { FaDog } from "react-icons/fa";
import { FaCat } from "react-icons/fa";
import { Button } from "../button/Button";
import { PiBirdFill } from "react-icons/pi";
import { FaQuestion } from "react-icons/fa";
import { MyCalendar } from "../calendar/Calendar";

function FormTurns() {
  return (
    <form className="flex flex-col items-center justify-center text-center">
      <h1 className="text-2xl font-bold">Crear Turno</h1>
      <div>
        <p>Para quien es?</p>
        <div className="flex flex-row gap-4">
          <div>
            <Button className="rounded-full border-1 border-black p-2">
              <FaDog />
            </Button>
            <p>Perro</p>
          </div>

          <div>
            <Button className="rounded-full border-1 border-black p-2">
              <FaCat />
            </Button>
            <p>Gato</p>
          </div>
          <div>
            <Button className="rounded-full border-1 border-black p-2">
              <PiBirdFill />
            </Button>
            <p>Ave</p>
          </div>

          <div>
            <Button className="rounded-full border-1 border-black p-2">
              <FaQuestion />
            </Button>
            <p>Otro</p>
          </div>
        </div>
      </div>
      <div>
        <p>Para cuando?</p>
        <MyCalendar />
      </div>
      <div>
        <p>¿Cuál es la consulta?</p>
        <div>
          <select
            className="    block
    w-full
    rounded-md
    border
    border-gray-300
    bg-white
    py-2
    px-3
    text-base
    text-gray-700
    focus:gray-700
    focus:outline-none
    focus:ring-1
    focus:gray-700
    cursor-pointer"
            id="tipoTurno"
          >
            <option selected disabled>
              Selecciona una opción
            </option>
            <option value="Consulta general">Consulta general</option>
            <option value="Chequeo médico">Chequeo médico</option>
            <option value="Vacunación">Vacunación</option>
            <option value="Castración">Castración</option>
          </select>
        </div>
      </div>
      <button className="bg-blue-600     
    text-white          
    font-semibold       
    py-2                
    px-4                
    rounded             
    hover:bg-blue-700   
    focus:outline-none  
    focus:ring-2        
    focus:ring-blue-500 
    transition        
    duration-200  my-4" type="submit">Crear Turno</button>
    </form>
  );
}
export default FormTurns;
