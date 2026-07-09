import { X } from "lucide-react";

const sizeGuideRows = [
  { size: "2", age: "1-2 años", chest: "30 cm", length: "38 cm" },
  { size: "4", age: "3-4 años", chest: "32 cm", length: "42 cm" },
  { size: "6", age: "5-6 años", chest: "34 cm", length: "46 cm" },
  { size: "8", age: "7-8 años", chest: "37 cm", length: "50 cm" },
  { size: "10", age: "9-10 años", chest: "40 cm", length: "54 cm" },
  { size: "12", age: "11-12 años", chest: "43 cm", length: "58 cm" },
];

export function SizeGuide({ onClose }: { onClose: () => void }) {
  return (
    <div
      style={{
        background: "var(--cream-50)",
        border: "1px solid var(--line)",
        borderRadius: "var(--r-lg)",
        marginTop: 12,
        padding: 16,
      }}
    >
      <div
        style={{
          alignItems: "center",
          display: "flex",
          justifyContent: "space-between",
          marginBottom: 12,
        }}
      >
        <strong>Guía de talles</strong>
        <button
          type="button"
          className="icon-btn"
          onClick={onClose}
          aria-label="Cerrar guía"
        >
          <X size={16} />
        </button>
      </div>
      <table
        className="table"
        style={{ background: "transparent", border: "none", borderRadius: 0 }}
      >
        <thead>
          <tr>
            <th>Talle</th>
            <th>Edad</th>
            <th>Pecho</th>
            <th>Largo</th>
          </tr>
        </thead>
        <tbody>
          {sizeGuideRows.map((row) => (
            <tr key={row.size}>
              <td>{row.size}</td>
              <td>{row.age}</td>
              <td>{row.chest}</td>
              <td>{row.length}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <small
        style={{
          color: "var(--ink-500)",
          display: "block",
          marginTop: 8,
        }}
      >
        Medidas aproximadas. Si dudás entre dos talles, recomendamos el más
        grande.
      </small>
    </div>
  );
}
