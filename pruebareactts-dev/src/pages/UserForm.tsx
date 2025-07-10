import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import { AuthService } from "../services/AuthService";
import { Role } from "../models/Role";
import { useAuth } from "../hooks/useAuth";

type Inputs = {
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  role_id: number;
  password?: string;
};

export const UserForm = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user, isAuthenticated, doLogout, loading } = useAuth();
  const [roles, setRoles] = useState<Role[]>([]);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<Inputs>();

  useEffect(() => {
    if (loading) return;

    if (!isAuthenticated) {
      navigate("/login");
      return;
    }

    if (!user || user.role?.name !== "super_admin") {
      alert("No tienes permisos para acceder a esta página");
      navigate("/");
      return;
    }

    const fetchRoles = async () => {
      try {
        const data = await new AuthService().getRoles();
        setRoles(data);
      } catch (error: any) {
        console.error(error);
        if (error.response?.status === 401) doLogout();
      }
    };
    fetchRoles();

    if (id) {
      const fetchUser = async () => {
        try {
          const u = await new AuthService().getUserById(Number(id));
          reset({
            username: u.username,
            email: u.email,
            first_name: u.first_name,
            last_name: u.last_name,
            role_id: u.role?.id || 0,
            // No seteamos password por seguridad
          });
        } catch (error: any) {
          console.error(error);
          if (error.response?.status === 401) doLogout();
        }
      };
      fetchUser();
    } else {
      // Si es crear nuevo, reset formulario
      reset({
        username: "",
        email: "",
        first_name: "",
        last_name: "",
        role_id: 0,
        password: "",
      });
    }
  }, [id, isAuthenticated, user, loading, navigate, doLogout, reset]);

  const onSubmit = async (data: Inputs) => {
    try {
      if (id) {
        await new AuthService().updateUser(Number(id), data);
        alert("Usuario actualizado");
      } else {
        await new AuthService().createUser(data);
        alert("Usuario creado");
      }
      navigate("/users");
    } catch (error) {
      alert("Error guardando usuario");
      console.error(error);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-gray-600 text-xl">Cargando...</p>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto mt-10 bg-white p-8 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-center">
        {id ? "Editar Usuario" : "Crear Usuario"}
      </h2>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <div>
          <label className="block mb-1 font-medium">Usuario</label>
          <input
            type="text"
            {...register("username", { required: "El usuario es obligatorio" })}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 ${
              errors.username ? "border-red-500 focus:ring-red-400" : "border-gray-300 focus:ring-blue-500"
            }`}
          />
          {errors.username && <p className="text-red-500 text-sm mt-1">{errors.username.message}</p>}
        </div>

        <div>
          <label className="block mb-1 font-medium">Email</label>
          <input
            type="email"
            {...register("email", { required: "El email es obligatorio" })}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 ${
              errors.email ? "border-red-500 focus:ring-red-400" : "border-gray-300 focus:ring-blue-500"
            }`}
          />
          {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
        </div>

        <div>
          <label className="block mb-1 font-medium">Nombre</label>
          <input
            type="text"
            {...register("first_name")}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block mb-1 font-medium">Apellido</label>
          <input
            type="text"
            {...register("last_name")}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block mb-1 font-medium">Rol</label>
          <select
            {...register("role_id", {
              required: "El rol es obligatorio",
              valueAsNumber: true,
            })}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 ${
              errors.role_id ? "border-red-500 focus:ring-red-400" : "border-gray-300 focus:ring-blue-500"
            }`}
          >
            <option value={0}>Seleccione un rol</option>
            {roles.map((r) => (
              <option key={r.id} value={r.id}>
                {r.name}
              </option>
            ))}
          </select>
          {errors.role_id && <p className="text-red-500 text-sm mt-1">{errors.role_id.message}</p>}
        </div>

        <div>
          <label className="block mb-1 font-medium">
            Contraseña {id ? "(dejar vacío para no cambiar)" : ""}
          </label>
          <input
            type="password"
            {...register("password")}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white font-semibold py-2 rounded-md hover:bg-blue-700 transition"
        >
          {id ? "Actualizar" : "Crear"}
        </button>
      </form>
    </div>
  );
};
