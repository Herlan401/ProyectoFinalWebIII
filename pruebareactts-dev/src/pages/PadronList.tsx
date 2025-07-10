import { useEffect, useState } from "react";
import { Menu } from "../components/Menu";
import { Container } from "../components/Container";
import { Card } from "../components/Card";
import { useAuth } from "../hooks/useAuth";
import { Input } from "../components/Input"; // Asegúrate de tener este componente

interface Recinto {
  nombre: string;
  latitud: number;
  longitud: number;
}

interface Elector {
  uuid: string;
  ci: string;
  nombre_completo: string;
  direccion?: string;
  recinto: String;
}

const PadronList = () => {
  useAuth();
  const [electores, setElectores] = useState<Elector[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [busqueda, setBusqueda] = useState("");

  const getElectores = async () => {
    const token = localStorage.getItem("access_token");

    try {
      const response = await fetch("http://localhost:8000/padron/electores/", {
        // headers: {
        //   Authorization: `Bearer ${token}`,
        //   "Content-Type": "application/json",
        // },
      });

      if (!response.ok) {
        throw new Error("No autorizado. Token inválido o expirado.");
      }

      let data: Elector[] = await response.json();

      // Ordena alfabéticamente por nombre_completo
      data.sort((a, b) =>
        a.nombre_completo.localeCompare(b.nombre_completo, "es", {
          sensitivity: "base",
        })
      );

      setElectores(data);
    } catch (err: any) {
      setError(err.message);
      alert(err.message);
    }
  };

  useEffect(() => {
    getElectores();
  }, []);

  const electoresFiltrados = electores.filter((e) =>
    e.nombre_completo.toLowerCase().includes(busqueda.toLowerCase())
  );

  return (
    <>
      <Menu />
      <Container>
        <Card title="Lista de Electores Empadronados">
          <div className="mb-4">
            <Input
              type="text"
              placeholder="Buscar por nombre..."
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
            />
          </div>

          {error ? (
            <p className="text-red-500">{error}</p>
          ) : electoresFiltrados.length === 0 ? (
            <p>No se encontraron electores.</p>
          ) : (
            <ul className="space-y-3">
              {electoresFiltrados.map((elector) => (
                <li
                  key={elector.uuid}
                  className="p-4 border rounded-md shadow-sm bg-white"
                >
                  <p><strong>CI:</strong> {elector.ci}</p>
                  <p><strong>Nombre:</strong> {elector.nombre_completo}</p>
                  {elector.direccion && <p><strong>Dirección:</strong> {elector.direccion}</p>}
                  {elector.recinto ? (
                    <p><strong>Recinto:</strong> {elector.recinto}</p>
                  ) : (
                    <p className="text-yellow-600">Este elector aún no tiene un recinto asignado.</p>
                  )}
                </li>
              ))}
            </ul>
          )}
        </Card>
      </Container>
    </>
  );
};

export default PadronList;
