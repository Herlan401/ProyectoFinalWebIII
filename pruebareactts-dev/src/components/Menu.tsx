import { useState } from "react";
import { Link, useNavigate } from "react-router-dom"; // ✅ corregido
import { ChevronDown, List } from "react-bootstrap-icons";
import { useAuth } from "../hooks/useAuth";

export const Menu = () => {
  const [showMenu, setShowMenu] = useState(false);
  const { user, doLogout } = useAuth(); // ✅ user en lugar de username
  const navigate = useNavigate(); // ✅ redirección con React Router

  const toggleSubMenu = (id: string) => {
    const subMenu = document.getElementById(id);
    const shownSubMenus = document.getElementsByClassName("submenu-shown");
    for (let i = 0; i < shownSubMenus.length; i++) {
      const element = shownSubMenus[i] as HTMLElement;
      if (element.id !== id) {
        element.classList.add("hidden");
        element.classList.remove("submenu-shown");
      }
    }
    if (subMenu) {
      subMenu.classList.toggle("hidden");
      subMenu.classList.toggle("submenu-shown");
    }
  };

  const onLogoutClick = () => {
    doLogout();            // ✅ limpia tokens y estado de auth
    navigate("/login");    // ✅ redirige correctamente sin recargar
  };

  return (
    <nav className="bg-black shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <span className="text-xl font-bold text-white">Padrón electoral 2025</span>
          </div>
          <div className="flex items-center md:hidden">
            <button onClick={() => setShowMenu(!showMenu)} className="text-white">
              <List />
            </button>
          </div>
          <div className="hidden md:flex items-center space-x-4">

            {/* EMPADRONAR */}
            <div className="relative group">
              <button onClick={() => toggleSubMenu("empadronar")} className="text-white hover:text-blue-600">
                Empadronar <ChevronDown size={10} className="inline" />
              </button>
              <div id="empadronar" className="absolute hidden bg-white shadow-md mt-2 rounded-md z-10">
                <Link to="/padron/lista" className="block px-4 py-2 text-gray-800 hover:bg-gray-100">Lista del padrón</Link>
                <Link to="/padron/crear" className="block px-4 py-2 text-gray-800 hover:bg-gray-100">Empadronar</Link>
              </div>
            </div>

            {/* RECINTOS */}
            <div className="relative group">
              <button onClick={() => toggleSubMenu("Recintos")} className="text-white hover:text-blue-600">
                Recintos <ChevronDown size={10} className="inline" />
              </button>
              <div id="Recintos" className="absolute hidden bg-white shadow-md mt-2 rounded-md z-10">
                <Link to="/recinto/lista" className="block px-4 py-2 text-gray-800 hover:bg-gray-100">Lista de recintos</Link>
              </div>
            </div>

            {/* AUTH */}
            <div className="relative group">
              <button onClick={() => toggleSubMenu("authMenu")} className="text-white hover:text-blue-600">
                usuario: {user?.username || "Desconocido"} <ChevronDown size={10} className="inline" />
              </button>
              <div id="authMenu" className="absolute hidden bg-white shadow-md mt-2 rounded-md z-10 w-64">
                <button onClick={onLogoutClick} className="w-full text-left px-4 py-2 text-gray-800 hover:bg-gray-100 border-t">
                  Cerrar sesión
                </button>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* MENÚ MÓVIL */}
      <div id="mobile-menu" className={(showMenu ? "" : "hidden ") + "md:hidden px-4 pb-4 space-y-2"}>
        <div>
          <button onClick={() => toggleSubMenu("mobileEmpadronar")} className="w-full text-left text-white py-2 flex justify-between items-center">
            Empadronar <ChevronDown size={10} />
          </button>
          <div id="mobileEmpadronar" className="hidden pl-4 space-y-1">
            <Link to="/padron/lista" className="block text-white py-1">Lista del padrón</Link>
            <Link to="/padron/crear" className="block text-white py-1">Empadronar</Link>
          </div>
        </div>

        <div>
          <button onClick={() => toggleSubMenu("mobileRecintos")} className="w-full text-left text-white py-2 flex justify-between items-center">
            Recintos <ChevronDown size={10} />
          </button>
          <div id="mobileRecintos" className="hidden pl-4 space-y-1">
            <Link to="/recinto/lista" className="block text-white py-1">Lista de recintos</Link>
            <Link to="/recinto/crear" className="block text-white py-1">Crear recinto</Link>
          </div>
        </div>

        <button onClick={onLogoutClick} className="block text-white py-2">Cerrar sesión</button>
      </div>
    </nav>
  );
};
