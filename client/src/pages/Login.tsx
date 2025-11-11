import { useState, type ChangeEvent, type FormEvent } from "react";
import useAuth from "../context/useAuth";
import {
  TextInput,
  PasswordInput,
  Button,
  Paper,
  Title,
  Stack,
} from "@mantine/core";
import { useNavigate } from "react-router-dom";

function Login() {
  const { login, user } = useAuth();
  const navigate = useNavigate();

  const [data, setData] = useState<{ email: string; password: string }>({
    email: "",
    password: "",
  });

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      await login(data.email, data.password);
      console.log("Login exitoso");
      while (!user);
      if (user) {
        switch (user?.rol) {
          case "MANAGER":
            navigate("/home/manager");
            break;
          case "VENDEDOR":
            navigate("/home/sales");
            break;
          case "CALIDAD":
            navigate("/home/quality");
            break;
          case "ALMACEN":
            navigate("/home/storage");
            break;
          default:
            navigate("/home");
        }
      }
    } catch (error) {
      console.error("Error en login:", error);
    }
  };

  return (
    <Paper
      component="form"
      onSubmit={onSubmit}
      shadow="lg"
      p="xl"
      radius="md"
      className="min-w-[400px]">
      <Stack>
        <Title order={2} style={{ textAlign: "center", marginBottom: 16 }}>
          Iniciar Sesión
        </Title>

        <TextInput
          id="email"
          name="email"
          type="email"
          label="Email"
          placeholder="tu@email.com"
          value={data.email}
          onChange={handleChange}
          required
          autoComplete="email"
        />

        <PasswordInput
          id="password"
          name="password"
          label="Contraseña"
          placeholder="••••••••"
          value={data.password}
          onChange={handleChange}
          required
          autoComplete="current-password"
        />

        <Button type="submit" fullWidth color="#5E6572">
          Iniciar Sesión
        </Button>
      </Stack>
    </Paper>
  );
}

export default Login;
