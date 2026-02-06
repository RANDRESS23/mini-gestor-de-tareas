import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { motion } from "framer-motion";
import { register, clearError } from "../features/auth/authSlice";
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
import { Mail, Lock, User } from "lucide-react";
import { useAppDispatch } from "@/app/hooks";

const Register: React.FC = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [nameError, setNameError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");

  const { status } = useSelector((state: RootState) => state.auth);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(clearError());
  }, [dispatch]);

  const validateForm = () => {
    let isValid = true;

    setNameError("");
    setEmailError("");
    setPasswordError("");
    setConfirmPasswordError("");

    if (!name) {
      setNameError("El nombre es requerido");
      isValid = false;
    }

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
    } else if (password.length < 6) {
      setPasswordError("La contraseña debe tener al menos 6 caracteres");
      isValid = false;
    }

    if (!confirmPassword) {
      setConfirmPasswordError("Por favor confirma tu contraseña");
      isValid = false;
    } else if (password !== confirmPassword) {
      setConfirmPasswordError("Las contraseñas no coinciden");
      isValid = false;
    }

    return isValid;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    dispatch(register({ name, email, password }))
      .unwrap()
      .then(() => {
        showSuccessToast("¡Cuenta creada exitosamente!");
        triggerConfetti();
        navigate("/tasks");
      })
      .catch((error) => {
        showErrorToast(error || "Error al crear cuenta");
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
            Crea tu cuenta
          </h2>
          <p className="text-gray-600">
            O{" "}
            <Link
              to="/login"
              className="font-medium text-gray-900 transition-colors hover:text-gray-800"
            >
              inicia sesión en tu cuenta existente
            </Link>
          </p>
        </div>

        <ModernCard className="glass-morphism" hover={true}>
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="flex relative gap-x-3 justify-center items-center w-full">
              <User className="w-5 h-5 text-gray-400" />
              <Input
                label="Nombre completo"
                type="text"
                value={name}
                onChange={setName}
                error={nameError}
                placeholder="Ingresa tu nombre completo"
                required
                className="w-full"
              />
            </div>

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

            <div className="flex relative gap-x-3 justify-center items-center w-full">
              <Lock className="w-5 h-5 text-gray-400" />
              <Input
                label="Confirmar contraseña"
                type="password"
                value={confirmPassword}
                onChange={setConfirmPassword}
                error={confirmPasswordError}
                placeholder="Confirma tu contraseña"
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
                  Creando cuenta...
                </div>
              ) : (
                "Crear cuenta"
              )}
            </Button>
          </form>
        </ModernCard>
      </motion.div>
    </div>
  );
};

export default Register;
