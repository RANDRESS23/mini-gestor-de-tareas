import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { motion } from "framer-motion";
import { login, clearError } from "../features/auth/authSlice";
import {
  showSuccessToast,
  showErrorToast,
  triggerConfetti,
} from "../lib/notifications";
import type { RootState } from "../app/store";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";
import ModernCard from "../components/ui/modern-card";
import ModernSpinner from "../components/ui/modern-spinner";
import { Lock, Mail } from "lucide-react";
import { useAppDispatch } from "@/app/hooks";

const Login: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const { status } = useSelector((state: RootState) => state.auth);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(clearError());
  }, [dispatch]);

  const validateForm = () => {
    let isValid = true;

    setEmailError("");
    setPasswordError("");

    if (!email) {
      setEmailError("El correo es requerido");
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      setEmailError("El correo es inválido");
      isValid = false;
    }

    if (!password) {
      setPasswordError("La contraseña es requerida");
      isValid = false;
    }

    return isValid;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    dispatch(login({ email, password }))
      .unwrap()
      .then(() => {
        showSuccessToast("¡Inicio de sesión exitoso!");
        triggerConfetti();
        navigate("/tasks");
      })
      .catch((error) => {
        showErrorToast(error || "Error al iniciar sesión");
      });
  };

  return (
    <div className="flex justify-center items-center px-4 py-12 min-h-screen sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <div className="mb-8 text-center">
          <h2 className="mb-2 text-3xl font-bold text-gray-900">
            Inicia sesión
          </h2>
          <p className="text-gray-600">
            O{" "}
            <Link
              to="/register"
              className="font-medium text-gray-700 transition-colors hover:text-gray-900"
            >
              crea una nueva cuenta
            </Link>
          </p>
        </div>

        <ModernCard className="glass-morphism" hover={true}>
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="flex relative gap-x-3 justify-center items-center w-full">
              <Mail className="w-5 h-5 text-gray-400" />
              <Input
                label="Correo electrónico"
                type="email"
                value={email}
                onChange={setEmail}
                error={emailError}
                placeholder="Ingresa tu correo"
                required
                className="w-full"
              />
            </div>

            <div className="flex relative gap-x-3 justify-center items-center w-full">
              <Lock className="w-5 h-5 text-gray-400" />
              <Input
                label="Contraseña"
                type="password"
                value={password}
                onChange={setPassword}
                error={passwordError}
                placeholder="Ingresa tu contraseña"
                required
                className="w-full"
              />
            </div>

            <Button
              type="submit"
              disabled={status === "loading"}
              className="flex-1 bg-gray-900 hover:bg-gray-800 text-white font-semibold py-2 w-full rounded-lg transition-all duration-300 transform hover:scale-[1.02]"
            >
              {status === "loading" ? (
                <div className="flex justify-center items-center">
                  <ModernSpinner size="sm" className="mr-2" />
                  Iniciando sesión...
                </div>
              ) : (
                "Iniciar sesión"
              )}
            </Button>
          </form>
        </ModernCard>
      </motion.div>
    </div>
  );
};

export default Login;
