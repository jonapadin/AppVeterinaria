import type { Dispatch, SetStateAction } from "react";

interface OrdenarProductosProps {
  orden: "mas-vendidos" | "menor-mayor" | "mayor-menor" | "a-z" | "z-a";
  onChange: Dispatch<SetStateAction<"mas-vendidos" | "menor-mayor" | "mayor-menor" | "a-z" | "z-a">>;
}

export default function OrdenarProductos({ orden, onChange }: OrdenarProductosProps) {
  const opciones = [
    { label: "Más vendidos", value: "mas-vendidos" },
    { label: "Precio: menor a mayor", value: "menor-mayor" },
    { label: "Precio: mayor a menor", value: "mayor-menor" },
    { label: "A-Z", value: "a-z" },
    { label: "Z-A", value: "z-a" },
  ];

  return (
    <div className="flex flex-col items-end">
      <label className="font-semibold text-sm mb-1">Ordenar por:</label>
      <select
        value={orden}
        onChange={(e) => onChange(e.target.value as typeof orden)}
        className="border-2 border-[#8F108D] rounded-lg px-3 py-1 w-[150px] text-sm"
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
