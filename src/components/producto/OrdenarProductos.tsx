import type { Dispatch, SetStateAction } from "react";

interface OrdenarProductosProps {
  orden:  "menor-mayor" | "mayor-menor" | "a-z" | "z-a";
  onChange: Dispatch<SetStateAction<"menor-mayor" | "mayor-menor" | "a-z" | "z-a">>;
}

export default function OrdenarProductos({ orden, onChange }: OrdenarProductosProps) {
  const opciones = [

    { label: "Menor a mayor", value: "menor-mayor" },
    { label: "Mayor a menor", value: "mayor-menor" },
    { label: "A-Z", value: "a-z" },
    { label: "Z-A", value: "z-a" },
  ];

  return (
    <div className="flex flex-col items-end  mb-6 xl:px-8 md:px-10">
      <label className="font-semibold text-base mb-2 px-6">Ordenar por:</label>
      <select
        value={orden}
        onChange={(e) => onChange(e.target.value as typeof orden)}
        className="border-3 border-[#8F108D] rounded-lg  xl:px-3 py-1 xl:w-[150px] md:w-[140px] md:text-xs text-sm 
         font-semibold
          text-[#8F108D]
          bg-white
         "
      >
        {opciones.map((op) => (
          <option key={op.value} value={op.value}>
            {op.label}
          </option>
        ))}
      </select>
    </div>
  );
}
