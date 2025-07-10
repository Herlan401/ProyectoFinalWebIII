// pages/EmpadronarForm.tsx

import { useEffect, useState } from "react";
import { Container } from "../components/Container";
import { Menu } from "../components/Menu";
import { Input } from "../components/Input";
import { Button } from "../components/Button"; 
import { useNavigate } from "react-router";

interface Recinto {
  id: number;
  nombre: string;
}

export const EmpadronarForm = () => {
  const [ci, setCi] = useState("");
  const [nombreCompleto, setNombreCompleto] = useState("");
  const [direccion, setDireccion] = useState("");
  const [recintoId, setRecintoId] = useState("");
  const [recintos, setRecintos] = useState<Recinto[]>([]);
  const [fotoAnverso, setFotoAnverso] = useState<File | null>(null);
  const [fotoReverso, setFotoReverso] = useState<File | null>(null);
  const [fotoVotante, setFotoVotante] = useState<File | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetch("http://localhost:8000/padron/recintos/")
      .then((res) => res.json())
      .then((data) => setRecintos(data));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const token = localStorage.getItem("access_token");
    const formData = new FormData();
    formData.append("ci", ci);
    formData.append("nombre_completo", nombreCompleto);
    formData.append("direccion", direccion);
    formData.append("recinto_id", recintoId);
    if (fotoAnverso) formData.append("foto_ci_anverso", fotoAnverso);
    if (fotoReverso) formData.append("foto_ci_reverso", fotoReverso);
    if (fotoVotante) formData.append("foto_votante", fotoVotante);

    try {
      const response = await fetch("http://localhost:8000/padron/electores/", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (!response.ok) throw new Error("Error al crear el elector");

      alert("Elector empadronado correctamente");
      navigate("/padron/lista");
    } catch (error) {
      alert("Error al empadronar elector");
    }
  };

  return (
    <>
      <Menu />
      <Container>
        <form onSubmit={handleSubmit} className="space-y-4">
          <h2 className="text-xl font-bold">Formulario de Empadronamiento</h2>

          <Input type="text" placeholder="CI" value={ci} onChange={(e) => setCi(e.target.value)} required />
          <Input type="text" placeholder="Nombre Completo" value={nombreCompleto} onChange={(e) => setNombreCompleto(e.target.value)} required />
          <Input type="text" placeholder="Dirección" value={direccion} onChange={(e) => setDireccion(e.target.value)} required />

          <select
            value={recintoId}
            onChange={(e) => setRecintoId(e.target.value)}
            className="w-full p-2 border rounded"
            required
          >
            <option value="">Selecciona un recinto</option>
            {recintos.map((r) => (
              <option key={r.id} value={r.id}>{r.nombre}</option>
            ))}
          </select>

          <div>
            <label>Foto CI Anverso:</label>
            <input type="file" onChange={(e) => setFotoAnverso(e.target.files?.[0] || null)} required />
          </div>

          <div>
            <label>Foto CI Reverso:</label>
            <input type="file" onChange={(e) => setFotoReverso(e.target.files?.[0] || null)} required />
          </div>

          <div>
            <label>Foto del Votante:</label>
            <input type="file" onChange={(e) => setFotoVotante(e.target.files?.[0] || null)} required />
          </div>

          <Button type="submit">Empadronar</Button>
        </form>
      </Container>
    </>
  );
};
