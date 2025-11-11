import { useState, type ChangeEvent, type FormEvent } from "react";

import axios from "../api/axios";

import {
  TextInput,
  PasswordInput,
  Button,
  Paper,
  Title,
  Stack,
} from "@mantine/core";

function Register() {
  const [data, setData] = useState({
    name: "",
    lastName: "",
    telephone: "",
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
      const res = await axios.post("/register", {
        name: data.name,
        lastName: data.lastName,
        telephone: data.telephone,
        email: data.email,
        password: data.password,
      });
      console.log("Registro exitoso:", res.data);
      // Auto login after successful registration
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
          Crear Cuenta
        </Title>

        <TextInput
          id="name"
          name="name"
          type="text"
          label="Nombre"
          placeholder="Jhon"
          value={data.name}
          onChange={handleChange}
          required
          autoComplete="email"
        />

        <TextInput
          id="lastName"
          name="lastName"
          type="text"
          label="Apellido"
          placeholder="Doe"
          value={data.lastName}
          onChange={handleChange}
          required
          autoComplete="email"
        />

        <TextInput
          id="telephone"
          name="telephone"
          type="number"
          label="Telefono"
          placeholder="+1234567890"
          value={data.telephone}
          onChange={handleChange}
          required
          autoComplete="email"
        />

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

export default Register;
