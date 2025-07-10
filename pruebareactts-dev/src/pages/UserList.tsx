import React, { useEffect, useState } from "react";
import { User } from "../models/User";
import { AuthService } from "../services/AuthService";
import { useAuth } from "../hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { Menu } from "../components/Menu";

export const UserList = () => {
  const [users, setUsers] = useState<User[]>([]);
  const { user, isAuthenticated, doLogout, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (loading) return;

    if (!isAuthenticated) {
      navigate("/login");
      return;
    }

    if (!user || user.role?.name !== "super_admin") {
      alert("No tienes permisos para ver esta página");
      navigate("/");
      return;
    }

    const fetchUsers = async () => {
      try {
        const data = await new AuthService().getUsers();
        setUsers(data);
      } catch (error: any) {
        console.error("Error al cargar usuarios:", error);
        if (error.response?.status === 401) doLogout();
      }
    };

    fetchUsers();
  }, [isAuthenticated, loading, user?.role?.name, navigate, doLogout]);

  const handleDelete = async (id: number) => {
    if (window.confirm("¿Eliminar usuario?")) {
      try {
        await new AuthService().deleteUser(id);
        setUsers(prevUsers => prevUsers.filter(u => u.id !== id));
      } catch {
        alert("Error al eliminar usuario");
      }
    }
  };

  if (loading) {
    return (
      <>
        <Menu />
        <div className="text-center text-gray-500 mt-10">Cargando usuarios...</div>
      </>
    );
  }

  if (users.length === 0) {
    return (
      <>
        <Menu />
        <div className="max-w-5xl mx-auto mt-10 p-4 text-center text-gray-600">
          No hay usuarios para mostrar.
        </div>
      </>
    );
  }

  return (
    <>
      <Menu />
      <div className="max-w-7xl mx-auto mt-8 px-4">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold text-blue-800">Lista de Usuarios</h2>
          <button
            onClick={() => navigate("/users/create")}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition"
          >
            Crear Usuario
          </button>
        </div>

        <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {users.map((u) => (
            <div
              key={u.id}
              className="bg-white rounded-xl shadow-md p-6 flex flex-col justify-between"
            >
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-1">{u.username}</h3>
                <p className="text-gray-600 mb-1">{u.email}</p>
                <p className="text-sm text-gray-500">Rol: {u.role?.name || "-"}</p>
              </div>
              <div className="mt-4 flex justify-between">
                <button
                  onClick={() => navigate(`/users/${u.id}/edit`)}
                  className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600 transition"
                >
                  Editar
                </button>
                <button
                  onClick={() => handleDelete(u.id)}
                  className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition"
                >
                  Eliminar
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};
