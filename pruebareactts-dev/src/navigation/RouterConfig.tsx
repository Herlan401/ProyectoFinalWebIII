import { Routes, Route } from "react-router";
import { URLS } from "./CONTANTS";

import { ConsultaForm } from "../pages/ConsultaForm";
import PadronList from "../pages/PadronList";
import { EmpadronarForm } from "../pages/EmpadronarForm";
import { LoginForm } from "../pages/LoginForm";
import { UserList } from "../pages/UserList";
import { UserForm } from "../pages/UserForm";
import { PrivateRoute } from "../components/PrivateRoute"; 

export const RouterConfig = () => {
  return (
    <Routes>
      <Route path="/consulta" element={<ConsultaForm />} />
      <Route path="/padron/lista" element={<PadronList />} />
      <Route path="/padron/crear" element={<EmpadronarForm />} />
      <Route path={URLS.LOGIN} element={<LoginForm />} />

      {/* Rutas protegidas */}
      <Route
        path="/users"
        element={
          <PrivateRoute>
            <UserList />
          </PrivateRoute>
        }
      />
      <Route
        path="/users/create"
        element={
          <PrivateRoute>
            <UserForm />
          </PrivateRoute>
        }
      />
      <Route
        path="/users/:id/edit"
        element={
          <PrivateRoute>
            <UserForm />
          </PrivateRoute>
        }
      />
    </Routes>
  );
};

export default RouterConfig;
