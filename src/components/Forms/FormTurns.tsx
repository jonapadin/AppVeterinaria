import { FaDog } from "react-icons/fa";
import { FaCat } from "react-icons/fa";

function FormTurns() {
  return (
    <form className="flex flex-col items-center justify-center">
      <h1 className="text-2xl font-bold">Crear Turno</h1>
      <div>
        <p>Para quien es?</p>
        <button className="rounded-full border-1 border-black p-2">
            <FaDog />
        </button>

        <button className="rounded-full border-1 border-black p-2">
            <FaCat />
        </button>
      </div>
      <input type="date" id="date" name="date" required />
      <label htmlFor="time">Hora:</label>
      <input type="time" id="time" name="time" required />
      <button type="submit">Crear Turno</button>
    </form>
  );
}
export default FormTurns;