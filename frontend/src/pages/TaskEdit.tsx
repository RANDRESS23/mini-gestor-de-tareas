import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import {
  fetchTasks,
  updateTask,
  clearTasksError,
  setSelectedTask,
} from "../features/tasks/tasksSlice";
import {
  showSuccessToast,
  showErrorToast,
  triggerConfetti,
} from "../lib/notifications";
import type { RootState } from "../app/store";
import Navbar from "../components/layout/Navbar";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";
import ModernCard from "../components/ui/modern-card";
import ModernSpinner from "../components/ui/modern-spinner";
import { Edit, FileText, Calendar, Save, ArrowLeft } from "lucide-react";
import { Spinner } from "@/components/ui";
import { useAppDispatch } from "@/app/hooks";

const TaskEdit: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState<"pending" | "in_progress" | "done">(
    "pending",
  );
  const [titleError, setTitleError] = useState("");
  const [loading, setLoading] = useState(true);

  const {
    tasks,
    loading: tasksLoading,
    error,
  } = useSelector((state: RootState) => state.tasks);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    if (id) {
      const task = tasks.find((t) => t.id === parseInt(id));

      if (task) {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setTitle(task.title);
        setDescription(task.description || "");
        setStatus(task.status);
        dispatch(setSelectedTask(task));
        setLoading(false);
      } else {
        dispatch(fetchTasks())
          .unwrap()
          .then(() => {
            setLoading(false);
          })
          .catch(() => {
            setLoading(false);
          });
      }
    }
  }, [id, tasks, dispatch]);

  useEffect(() => {
    dispatch(clearTasksError());
  }, [dispatch]);

  const validateForm = () => {
    let isValid = true;

    setTitleError("");

    if (!title) {
      setTitleError("El título es requerido");
      isValid = false;
    }

    return isValid;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm() || !id) return;

    setLoading(true);
    dispatch(
      updateTask({
        id: parseInt(id),
        taskData: { title, description, status },
      }),
    )
      .unwrap()
      .then(() => {
        showSuccessToast("¡Tarea actualizada exitosamente!");
        triggerConfetti();
        navigate("/tasks");
      })
      .catch((error: any) => {
        console.error("Error updating task:", error);
        if (error?.response?.status === 401) {
          showErrorToast(
            "Tu sesión ha expirado. Por favor inicia sesión nuevamente.",
          );
          setTimeout(() => navigate("/login"), 2000);
        } else {
          showErrorToast(
            error?.response?.data?.message ||
              error?.message ||
              "Error al actualizar tarea",
          );
        }
        setLoading(false);
      });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="flex justify-center py-12">
          <Spinner size="lg" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Navbar />

      <div className="py-6 mx-auto max-w-7xl sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-8"
          >
            <div className="flex gap-3 items-center mb-2">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 260, damping: 20 }}
                className="flex justify-center items-center w-8 h-8 bg-gray-900 rounded-lg"
              >
                <Edit className="w-6 h-6 text-white" />
              </motion.div>
              <div>
                <h1 className="mb-1 text-3xl font-bold text-gray-900">
                  Editar Tarea
                </h1>
                <p className="text-gray-600">
                  Actualiza los detalles de tu tarea
                </p>
              </div>
            </div>
          </motion.div>

          <ModernCard className="mx-auto max-w-xl glass-morphism" hover={true}>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="flex relative gap-x-3 justify-center items-center w-full">
                <FileText className="w-5 h-5 text-gray-400" />
                <Input
                  label="Título de la Tarea"
                  type="text"
                  value={title}
                  onChange={setTitle}
                  error={titleError}
                  placeholder="Ingresa el título de la tarea"
                  required
                  className="w-full"
                />
              </div>

              <div className="flex relative gap-x-3 justify-center items-center w-full">
                <FileText className="w-5 h-5 text-gray-400" />
                <div className="w-full">
                  <label
                    htmlFor=""
                    className="block mb-1 text-sm font-medium text-gray-700"
                  >
                    Descripción:
                  </label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Ingresa la descripción de la tarea (opcional)"
                    rows={4}
                    className="px-3 py-2 w-full rounded-lg border border-gray-300 backdrop-blur-sm resize-none focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent bg-white/50"
                  />
                </div>
              </div>

              <div className="flex relative gap-x-3 justify-center items-center w-full">
                <Calendar className="w-5 h-5 text-gray-400" />
                <div className="w-full">
                  <label
                    htmlFor=""
                    className="block mb-1 text-sm font-medium text-gray-700"
                  >
                    Estado de la tarea:
                    <span className="ml-1 text-red-500">*</span>
                  </label>
                  <select
                    value={status}
                    onChange={(e) =>
                      setStatus(
                        e.target.value as "pending" | "in_progress" | "done",
                      )
                    }
                    className="px-3 py-2 w-full rounded-lg border border-gray-300 backdrop-blur-sm appearance-none focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent bg-white/50"
                  >
                    <option value="pending">Pendiente</option>
                    <option value="in_progress">En progreso</option>
                    <option value="done">Completada</option>
                  </select>
                </div>
              </div>

              <AnimatePresence>
                {error && (
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    className="px-4 py-3 text-red-700 bg-red-50 rounded-lg border border-red-200"
                  >
                    {error}
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="flex gap-4 justify-end">
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={() => navigate("/tasks")}
                    className="flex-1 bg-white-900 hover:bg-white-800 text-black font-semibold py-2 rounded-lg transition-all duration-300 transform hover:scale-[1.02]"
                  >
                    <div className="flex gap-2 justify-center items-center">
                      <ArrowLeft className="w-5 h-5" />
                      Cancelar
                    </div>
                  </Button>
                </motion.div>

                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Button
                    type="submit"
                    disabled={tasksLoading}
                    className="flex-1 bg-gray-900 hover:bg-gray-800 text-white font-semibold py-2 rounded-lg transition-all duration-300 transform hover:scale-[1.02]"
                  >
                    {tasksLoading ? (
                      <div className="flex justify-center items-center">
                        <ModernSpinner size="sm" className="mr-2" />
                        Actualizando...
                      </div>
                    ) : (
                      <div className="flex gap-2 justify-center items-center">
                        <Save className="w-5 h-5" />
                        Actualizar Tarea
                      </div>
                    )}
                  </Button>
                </motion.div>
              </div>
            </form>
          </ModernCard>
        </div>
      </div>
    </div>
  );
};

export default TaskEdit;
