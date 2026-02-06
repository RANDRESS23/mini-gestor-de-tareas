import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  fetchTasks,
  clearTasksError,
  deleteTask,
} from "../features/tasks/tasksSlice";
import { showSuccessToast, showErrorToast } from "../lib/notifications";
import type { RootState } from "../app/store";
import Navbar from "../components/layout/Navbar";
import Button from "../components/ui/Button";
import ModernCard from "../components/ui/modern-card";
import ModernSpinner from "../components/ui/modern-spinner";
import {
  Plus,
  Edit2,
  Trash2,
  CheckCircle,
  Clock,
  AlertCircle,
} from "lucide-react";
import { useAppDispatch } from "@/app/hooks";

const TasksList: React.FC = () => {
  const { tasks, loading, error } = useSelector(
    (state: RootState) => state.tasks,
  );
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(fetchTasks());
  }, [dispatch]);

  const handleDelete = (id: number) => {
    if (window.confirm("¿Estás seguro de que quieres eliminar esta tarea?")) {
      dispatch(deleteTask(id))
        .unwrap()
        .then(() => {
          showSuccessToast("Tarea eliminada exitosamente");
        })
        .catch((error) => {
          showErrorToast(error || "Error al eliminar tarea");
        });
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "in_progress":
        return "bg-blue-100 text-blue-800";
      case "done":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending":
        return <Clock className="w-4 h-4" />;
      case "in_progress":
        return <AlertCircle className="w-4 h-4" />;
      case "done":
        return <CheckCircle className="w-4 h-4" />;
      default:
        return null;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "pending":
        return "Pendiente";
      case "in_progress":
        return "En progreso";
      case "done":
        return "Completada";
      default:
        return "Desconocido";
    }
  };

  return (
    <div className="min-h-screen">
      <Navbar />

      <div className="py-6 mx-auto max-w-7xl sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex justify-between items-center mb-8"
          >
            <div>
              <h1 className="mb-2 text-4xl font-bold gradient-text">
                Mis Tareas
              </h1>
              <p className="text-gray-600">
                Gestiona tus tareas de forma eficiente
              </p>
            </div>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link to="/tasks/create">
                <Button className="flex-1 bg-gray-900 hover:bg-gray-800 text-white font-semibold py-2 px-6 flex justify-center items-center gap-x-2 rounded-lg transition-all duration-300 transform hover:scale-[1.02]">
                  <Plus className="w-5 h-5" />
                  Crear Tarea
                </Button>
              </Link>
            </motion.div>
          </motion.div>

          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="flex justify-between items-center px-4 py-3 mb-4 text-red-700 bg-red-50 rounded-lg border border-red-200"
              >
                <span>{error}</span>
                <button
                  onClick={() => dispatch(clearTasksError())}
                  className="font-bold text-red-500 hover:text-red-700"
                >
                  ×
                </button>
              </motion.div>
            )}
          </AnimatePresence>

          {loading ? (
            <div className="flex justify-center py-20">
              <ModernSpinner size="lg" />
            </div>
          ) : tasks.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
            >
              <ModernCard className="py-20 text-center">
                <h3 className="mb-4 text-2xl font-bold text-gray-900">
                  Aún no tienes tareas
                </h3>
                <p className="mx-auto mb-8 max-w-md text-gray-600">
                  Comienza creando tu primera tarea para organizar tu trabajo de
                  manera eficiente.
                </p>
                <Link to="/tasks/create">
                  <Button className="flex-1 bg-gray-900 hover:bg-gray-800 text-white font-semibold py-3 rounded-lg transition-all duration-300 transform hover:scale-[1.02]">
                    Crear Primera Tarea
                  </Button>
                </Link>
              </ModernCard>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="grid gap-6 md:grid-cols-2 lg:grid-cols-3"
            >
              <AnimatePresence>
                {tasks.map((task, index) => (
                  <motion.div
                    key={task.id}
                    initial={{ opacity: 0, scale: 0.8, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.8, y: -20 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                  >
                    <ModernCard className="hover:shadow-2xl hover:scale-[1.02] transition-all duration-300">
                      <div className="space-y-4">
                        <div>
                          <h3 className="mb-2 text-xl font-semibold text-gray-900">
                            {task.title}
                          </h3>
                          {task.description && (
                            <p className="text-gray-600 line-clamp-2">
                              {task.description}
                            </p>
                          )}
                        </div>

                        <div className="flex justify-between items-center">
                          <span
                            className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                              task.status,
                            )}`}
                          >
                            {getStatusIcon(task.status)}
                            {getStatusText(task.status)}
                          </span>
                        </div>

                        <div className="flex gap-2">
                          <motion.div
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                          >
                            <Link to={`/tasks/${task.id}/edit`}>
                              <Button
                                variant="secondary"
                                className="flex gap-2 items-center px-4 py-2 font-semibold !text-white !bg-cyan-900 !hover:bg-cyan-800"
                              >
                                <Edit2 className="w-4 h-4" />
                                Editar
                              </Button>
                            </Link>
                          </motion.div>
                          <motion.div
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                          >
                            <Button
                              variant="secondary"
                              onClick={() => handleDelete(task.id)}
                              className="flex gap-2 items-center px-4 py-2 font-semibold !text-white !bg-red-900 !hover:bg-red-800"
                            >
                              <Trash2 className="w-4 h-4" />
                              Eliminar
                            </Button>
                          </motion.div>
                        </div>
                      </div>
                    </ModernCard>
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TasksList;
