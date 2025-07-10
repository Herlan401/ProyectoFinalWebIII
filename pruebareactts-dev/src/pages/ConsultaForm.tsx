import { useState } from "react";
import { Container } from "../components/Container";
import { Card } from "../components/Card";
import { Input } from "../components/Input";
import { Button } from "../components/Button";
import { FormField } from "../components/FormField";
import { GoogleMap, Marker, useJsApiLoader } from "@react-google-maps/api";

type ElectorResponse = {
  uuid: string;
  ci: string;
  nombre_completo: string;
  direccion?: string;
  recinto: {
    nombre: string;
    latitud: number;
    longitud: number;
  } | null;
};

const containerStyle = {
  width: '100%',
  height: '300px',
};


export const ConsultaForm = () => {
  const [ci, setCi] = useState("");
  const [resultado, setResultado] = useState<ElectorResponse | null>(null);
  const [error, setError] = useState("");

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: "", //API Key 
  });

  const consultarElector = async () => {
    setResultado(null);
    setError("");

    try {
      const response = await fetch(`http://localhost:8000/padron/verificar/${ci}/`);
      if (!response.ok) throw new Error("Elector no encontrado");
      const data = await response.json();
      setResultado(data);
    } catch (err: any) {
      setError(err.message || "Error en la consulta");
    }
  };

  return (
    <Container>
      <div className="flex justify-center items-center min-h-screen">
        <Card title="Consulta de Elector" className="mx-5 w-full max-w-md">
          <FormField>
            <label htmlFor="ci" className="font-medium text-gray-700">Cédula de Identidad:</label>
            <Input
              id="ci"
              type="text"
              value={ci}
              onChange={(e) => setCi(e.target.value)}
              placeholder="Ej. 12345678"
              className="mt-1"
            />
          </FormField>

          <div className="flex justify-end mt-4">
            <Button title="Consultar" type="button" onClick={consultarElector} />
          </div>

          {error && (
            <p className="text-red-500 mt-4 text-sm font-medium text-center">{error}</p>
          )}

          {resultado && (
            <div className="mt-6 p-4 border rounded bg-gray-50 space-y-2 text-sm">
              <p><strong>Nombre:</strong> {resultado.nombre_completo}</p>
              <p><strong>CI:</strong> {resultado.ci}</p>
              {resultado.recinto ? (
                <>
                  <p><strong>Recinto:</strong> {resultado.recinto.nombre}</p>

                  {isLoaded && (
                    <GoogleMap
                      mapContainerStyle={containerStyle}
                      center={{
                        lat: resultado.recinto.latitud,
                        lng: resultado.recinto.longitud,
                      }}
                      zoom={16}
                    >
                      <Marker
                        position={{
                          lat: resultado.recinto.latitud,
                          lng: resultado.recinto.longitud,
                        }}
                      />
                    </GoogleMap>
                  )}
                </>
              ) : (
                <p className="text-yellow-600">Este elector aún no tiene un recinto asignado.</p>
              )}
            </div>
          )}
        </Card>
      </div>
    </Container>
  );
};
