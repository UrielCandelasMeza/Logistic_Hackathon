import { Modal, TextInput, Select, Button, Stack } from "@mantine/core";
import { useState } from "react";

interface NewUserModalProps {
  opened: boolean;
  onClose: () => void;
  onSubmit: (values: { name: string; email: string; role: string }) => void;
}

export function NewUserModal({ opened, onClose, onSubmit }: NewUserModalProps) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    role: "",
  });

  const [errors, setErrors] = useState({
    name: "",
    email: "",
    role: "",
  });

  const validateForm = () => {
    const newErrors = {
      name: "",
      email: "",
      role: "",
    };

    if (formData.name.length < 2) {
      newErrors.name = "El nombre debe tener al menos 2 caracteres";
    }

    if (!/^\S+@\S+$/.test(formData.email)) {
      newErrors.email = "Email inválido";
    }

    if (!formData.role) {
      newErrors.role = "Selecciona un rol";
    }

    setErrors(newErrors);
    return !newErrors.name && !newErrors.email && !newErrors.role;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (validateForm()) {
      onSubmit(formData);
      setFormData({ name: "", email: "", role: "" });
      setErrors({ name: "", email: "", role: "" });
      onClose();
    }
  };

  const handleClose = () => {
    setFormData({ name: "", email: "", role: "" });
    setErrors({ name: "", email: "", role: "" });
    onClose();
  };

  return (
    <Modal
      opened={opened}
      onClose={handleClose}
      title="Crear Nuevo Usuario"
      centered>
      <form onSubmit={handleSubmit}>
        <Stack gap="md">
          <TextInput
            label="Nombre Completo"
            placeholder="Juan Pérez"
            required
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            error={errors.name}
          />

          <TextInput
            label="Correo Electrónico"
            placeholder="usuario@calzastock.com"
            type="email"
            required
            value={formData.email}
            onChange={(e) =>
              setFormData({ ...formData, email: e.target.value })
            }
            error={errors.email}
          />

          <Select
            label="Rol"
            placeholder="Selecciona un rol"
            required
            value={formData.role}
            onChange={(value) =>
              setFormData({ ...formData, role: value || "" })
            }
            error={errors.role}
            data={[
              { value: "MANAGER", label: "Gerente" },
              { value: "CALIDAD", label: "Control de Calidad" },
              { value: "ALMACEN", label: "Almacén" },
              { value: "VENDEDOR", label: "Ventas" },
              { value: "CAJERO", label: "Cajero" },
              { value: "ADMIN", label: "Administrador" },
            ]}
          />

          <Button type="submit" fullWidth mt="md">
            Crear Usuario
          </Button>
        </Stack>
      </form>
    </Modal>
  );
}
