import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import { logout } from "../../features/auth/authSlice";
import { showSuccessToast, showErrorToast } from "../../lib/notifications";
import type { RootState } from "../../app/store";
import { LogOut, User, Menu, X } from "lucide-react";
import { useAppDispatch } from "@/app/hooks";

const Navbar: React.FC = () => {
  const user = useSelector((state: RootState) => state.auth.user);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

  const handleLogout = () => {
    dispatch(logout())
      .unwrap()
      .then(() => {
        showSuccessToast("¡Sesión cerrada exitosamente!");
        navigate("/login");
      })
      .catch((error: any) => {
        console.error("Logout error:", error);
        if (error?.response?.status === 404) {
          showErrorToast(
            "Error de conexión con el servidor. Intenta nuevamente.",
          );
        } else {
          showErrorToast(
            error?.response?.data?.message ||
              error?.message ||
              "Error al cerrar sesión",
          );
        }
      });
  };

  return (
    <nav className="sticky top-0 z-50 border shadow-lg backdrop-blur-md bg-white/80 border-gray-200/50">
      <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link
                to="/tasks"
                className="flex gap-2 items-center text-xl font-bold transition-opacity gradient-text hover:opacity-80"
              >
                <div className="flex justify-center items-center w-8 h-8 bg-gray-900 rounded-lg">
                  <div className="w-4 h-4 bg-white rounded-sm"></div>
                </div>
                Gestor de Tareas
              </Link>
            </motion.div>
          </div>

          {user && (
            <div className="flex items-center space-x-4">
              {/* Desktop Navigation */}
              <div className="hidden items-center space-x-4 md:flex">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Link
                    to="/tasks"
                    className="px-4 py-2 text-sm font-medium text-gray-700 rounded-lg transition-all duration-200 hover:bg-gray-100 hover:text-gray-900"
                  >
                    Tareas
                  </Link>
                </motion.div>

                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Link
                    to="/tasks/create"
                    className="px-4 py-2 text-sm font-medium text-gray-700 rounded-lg transition-all duration-200 hover:bg-gray-100 hover:text-gray-900"
                  >
                    Nueva Tarea
                  </Link>
                </motion.div>

                <div className="flex items-center pl-4 space-x-3 border-l border-gray-200">
                  <div className="flex items-center space-x-2">
                    <div className="flex justify-center items-center w-8 h-8 bg-gray-900 rounded-full">
                      <User className="w-4 h-4 text-white" />
                    </div>
                    <span className="text-sm font-medium text-gray-900">
                      {user.name}
                    </span>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleLogout}
                    className="flex gap-2 items-center px-4 py-2 text-sm font-medium text-gray-700 rounded-lg transition-all duration-200 hover:bg-red-50 hover:text-red-600"
                  >
                    <LogOut className="w-4 h-4" />
                    Cerrar sesión
                  </motion.button>
                </div>
              </div>

              {/* Mobile Menu Button */}
              <div className="md:hidden">
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                  className="p-2 text-gray-700 rounded-lg transition-colors hover:bg-gray-100"
                >
                  {isMobileMenuOpen ? (
                    <X className="w-6 h-6" />
                  ) : (
                    <Menu className="w-6 h-6" />
                  )}
                </motion.button>
              </div>
            </div>
          )}
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMobileMenuOpen && user && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="border-t backdrop-blur-md md:hidden border-gray-200/50 bg-white/80"
            >
              <div className="px-4 py-4 space-y-2">
                <Link
                  to="/tasks"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block px-4 py-2 text-base font-medium text-gray-700 rounded-lg transition-colors hover:bg-gray-100"
                >
                  Tareas
                </Link>
                <Link
                  to="/tasks/create"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block px-4 py-2 text-base font-medium text-gray-700 rounded-lg hover:bg-gray-100 hover:text-gray-900"
                >
                  Nueva Tarea
                </Link>
                <div className="pt-2 border-t border-gray-200">
                  <div className="flex justify-between items-center px-4 py-2">
                    <div className="flex items-center space-x-2">
                      <div className="flex justify-center items-center w-8 h-8 bg-gray-900 rounded-full">
                        <User className="w-4 h-4 text-white" />
                      </div>
                      <span className="text-sm font-medium text-gray-900">
                        {user.name}
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      handleLogout();
                      setIsMobileMenuOpen(false);
                    }}
                    className="flex gap-2 justify-center items-center px-4 py-2 mt-2 w-full text-base font-medium text-red-600 rounded-lg transition-colors hover:bg-red-50"
                  >
                    <LogOut className="w-4 h-4" />
                    Cerrar sesión
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </nav>
  );
};

export default Navbar;
