"use client";

import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  IconButton,
  InputAdornment,
  TextField,
  Typography,
  Link as MuiLink,
} from "@mui/material";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import CloseIcon from "@mui/icons-material/Close";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

interface AuthFormProps {
  isMobile?: boolean;
  onClose?: () => void;
}

const loginSchema = z.object({
  email: z.string().min(1, "O e-mail é obrigatório").email("E-mail inválido"),
  password: z.string().min(6, "A senha deve ter pelo menos 6 caracteres"),
});

const registerSchema = loginSchema.extend({
  name: z.string().min(3, "O nome deve ter pelo menos 3 caracteres"),
  age: z.coerce
    .number()
    .min(14, "A idade mínima é 14 anos")
    .max(100, "Idade inválida"),
  role: z.enum(["APRENDIZ", "MENTOR"]).default("APRENDIZ"),
});

type LoginFormData = z.infer<typeof loginSchema>;
type RegisterFormData = z.infer<typeof registerSchema>;

const translateError = (err: string) => {
  if (!err) return "Ocorreu um erro inesperado.";
  const lower = err.toLowerCase();
  if (lower.includes("invalid credentials")) return "E-mail ou senha incorretos.";
  if (lower.includes("email_already_exists") || lower.includes("already exists")) return "Este e-mail já está cadastrado.";
  if (lower.includes("weak_password")) return "A senha é muito fraca (mínimo de 6 caracteres).";
  if (lower.includes("invalid_role")) return "O tipo de conta selecionado é inválido.";
  return "Ocorreu um erro inesperado.";
};

export default function AuthForm({ isMobile = false, onClose }: AuthFormProps) {
  const [mode, setMode] = useState<"login" | "register">("login");
  const [showPassword, setShowPassword] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [formSuccess, setFormSuccess] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    let timeout: NodeJS.Timeout;
    if (formError) {
      timeout = setTimeout(() => setFormError(null), 5000);
    }
    return () => clearTimeout(timeout);
  }, [formError]);

  useEffect(() => {
    let timeout: NodeJS.Timeout;
    if (formSuccess) {
      timeout = setTimeout(() => setFormSuccess(null), 5000);
    }
    return () => clearTimeout(timeout);
  }, [formSuccess]);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<RegisterFormData>({
    resolver: zodResolver(mode === "login" ? loginSchema : registerSchema),
  });

  const onSubmit = (data: RegisterFormData | LoginFormData) => {
    setFormError(null);
    setFormSuccess(null);

    if (mode === "login") {
      // call login
      fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })
        .then((r) => r.json())
        .then((json) => {
          if (json.success && json.data) {
            // store tokens
            localStorage.setItem("accessToken", json.data.accessToken);
            localStorage.setItem("refreshToken", json.data.refreshToken);
            if (json.data.user) {
              localStorage.setItem("user", JSON.stringify(json.data.user));
            }
            window.dispatchEvent(new Event("auth-changed"));
            if (onClose) onClose();
            router.push("/");
          } else {
            setFormError(translateError(json.error));
          }
        })
        .catch(() => setFormError("Erro de conexão"));
    } else {
      // register
      fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })
        .then((r) => r.json())
        .then((json) => {
          if (json.success) {
            setFormSuccess("Cadastro realizado com sucesso! Entrando...");
            
            // Auto-login com delay
            setTimeout(() => {
              fetch("/api/auth/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email: data.email, password: data.password }),
              })
                .then((lr) => lr.json())
                .then((ljson) => {
                  if (ljson.success && ljson.data) {
                    localStorage.setItem("accessToken", ljson.data.accessToken);
                    localStorage.setItem("refreshToken", ljson.data.refreshToken);
                    if (ljson.data.user) {
                      localStorage.setItem("user", JSON.stringify(ljson.data.user));
                    }
                    window.dispatchEvent(new Event("auth-changed"));
                    if (onClose) onClose();
                    router.push("/");
                  } else {
                    setFormSuccess("Cadastro realizado com sucesso! Faça login para continuar.");
                    setMode("login");
                    reset();
                  }
                })
                .catch(() => {
                  setFormSuccess("Cadastro realizado com sucesso! Faça login para continuar.");
                  setMode("login");
                  reset();
                });
            }, 2000);
          } else {
            setFormError(translateError(json.error));
          }
        })
        .catch(() => setFormError("Erro de conexão"));
    }
  };

  const handleTogglePasswordVisibility = () => {
    setShowPassword((show) => !show);
  };

  const handleBack = () => {
    if (mode === "register") {
      setMode("login");
      setFormError(null);
      setFormSuccess(null);
      reset(); // Clear errors when switching modes
    } else {
      if (isMobile) {
        router.push("/");
      } else if (onClose) {
        onClose();
      }
    }
  };

  const switchMode = (newMode: "login" | "register") => {
    setMode(newMode);
    setFormError(null);
    setFormSuccess(null);
    reset(); // Clear errors when switching modes
  };

  const textFieldStyles = {
    "& .MuiOutlinedInput-root": {
      borderRadius: 2, // slightly rounded
      ...(formError && {
        animation: "inputErrorBlink 1.5s infinite",
      }),
    },
    "@keyframes inputErrorBlink": {
      "0%": { boxShadow: "0 0 0 0 transparent" },
      "50%": { boxShadow: "0 0 8px 1px #FF5252" },
      "100%": { boxShadow: "0 0 0 0 transparent" },
    },
  };

  return (
    <Box
      sx={{
        position: "relative",
        width: "100%",
        maxWidth: 450,
        backgroundColor: "background.paper",
        borderRadius: 8, // rounded modal rectangle
        p: 4,
        boxShadow: 24,
      }}
    >
      {/* Header with Back/Close buttons */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 3,
        }}
      >
        {/* Back button logic */}
        {mode === "register" || isMobile ? (
          <IconButton onClick={handleBack} color="inherit">
            <ArrowBackIcon />
          </IconButton>
        ) : (
          <Box sx={{ width: 40 }} /> // Placeholder for alignment
        )}

        <Typography variant="h5" fontWeight="bold">
          {mode === "login" ? "Entrar" : "Criar Conta"}
        </Typography>

        {/* Close button only on desktop */}
        {!isMobile && onClose ? (
          <IconButton onClick={onClose} color="inherit">
            <CloseIcon />
          </IconButton>
        ) : (
          <Box sx={{ width: 40 }} /> // Placeholder for alignment
        )}
      </Box>

      {/* Form Fields */}
      <Box
        component="form"
        noValidate
        onSubmit={handleSubmit(onSubmit)}
        sx={{ display: "flex", flexDirection: "column", gap: 2.5 }}
      >
        {mode === "register" && (
          <>
            <TextField
              label="Nome completo"
              variant="outlined"
              fullWidth
              sx={textFieldStyles}
              {...register("name")}
              error={!!errors.name}
              helperText={errors.name?.message}
            />
            <TextField
              label="Idade"
              type="number"
              variant="outlined"
              fullWidth
              sx={textFieldStyles}
              {...register("age")}
              error={!!errors.age}
              helperText={errors.age?.message}
            />
            <TextField
              select
              label="Tipo"
              defaultValue="APRENDIZ"
              {...register("role")}
              SelectProps={{ native: true }}
            >
              <option value="APRENDIZ">Aprendiz</option>
              <option value="MENTOR">Mentor</option>
            </TextField>
          </>
        )}

        <TextField
          label="E-mail"
          type="email"
          variant="outlined"
          fullWidth
          sx={textFieldStyles}
          {...register("email")}
          error={!!errors.email}
          helperText={errors.email?.message}
        />

        <TextField
          label="Senha"
          type={showPassword ? "text" : "password"}
          variant="outlined"
          fullWidth
          sx={textFieldStyles}
          {...register("password")}
          error={!!errors.password}
          helperText={errors.password?.message}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  aria-label="toggle password visibility"
                  onClick={handleTogglePasswordVisibility}
                  edge="end"
                >
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            ),
          }}
        />

        {formError && (
          <Typography
            variant="body2"
            sx={{
              color: "#FF5252",
              fontWeight: "bold",
              textAlign: "center",
              animation: "blink 1.5s infinite",
              "@keyframes blink": {
                "0%": { opacity: 1 },
                "50%": { opacity: 0.4 },
                "100%": { opacity: 1 },
              },
            }}
          >
            {formError}
          </Typography>
        )}
        {formSuccess && (
          <Typography
            color="success.main"
            variant="body2"
            sx={{
              textAlign: "center",
              animation: "blink 1.5s infinite",
              "@keyframes blink": {
                "0%": { opacity: 1 },
                "50%": { opacity: 0.4 },
                "100%": { opacity: 1 },
              },
            }}
          >
            {formSuccess}
          </Typography>
        )}

        <Button
          type="submit"
          variant="contained"
          color="primary"
          size="large"
          fullWidth
          sx={{ mt: 2, borderRadius: 2, py: 1.5, fontSize: 16 }}
        >
          {mode === "login" ? "Entrar" : "Cadastrar"}
        </Button>

        {/* Toggle Mode Link */}
        <Box sx={{ textAlign: "center", mt: 2 }}>
          {mode === "login" ? (
            <Typography variant="body2" color="text.secondary">
              Não tem uma conta?{" "}
              <MuiLink
                component="button"
                type="button"
                variant="body2"
                onClick={() => switchMode("register")}
                sx={{
                  color: "primary.main",
                  fontWeight: "bold",
                  textDecoration: "none",
                }}
              >
                Cadastre-se
              </MuiLink>
            </Typography>
          ) : (
            <Typography variant="body2" color="text.secondary">
              Já tem uma conta?{" "}
              <MuiLink
                component="button"
                type="button"
                variant="body2"
                onClick={() => switchMode("login")}
                sx={{
                  color: "primary.main",
                  fontWeight: "bold",
                  textDecoration: "none",
                }}
              >
                Faça login
              </MuiLink>
            </Typography>
          )}
        </Box>
      </Box>
    </Box>
  );
}
