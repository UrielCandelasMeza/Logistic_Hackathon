import { Paper, Text, Table, Badge, Group, Button } from "@mantine/core";
import { IconUserPlus } from "@tabler/icons-react";

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  status: "active" | "inactive";
  lastLogin: string;
}

interface UsersTableProps {
  users: User[];
  onToggleStatus: (userId: number) => void;
  onDeleteUser: (userId: number) => void;
  onNewUser: () => void;
}

const roleColors: Record<string, string> = {
  MANAGER: "violet",
  CALIDAD: "blue",
  ALMACEN: "green",
  VENDEDOR: "orange",
  CAJERO: "cyan",
  ADMIN: "red",
};

const roleLabels: Record<string, string> = {
  MANAGER: "Gerente",
  CALIDAD: "Calidad",
  ALMACEN: "Almacén",
  VENDEDOR: "Ventas",
  CAJERO: "Cajero",
  ADMIN: "Administrador",
};

export function UsersTable({
  users,
  onToggleStatus,
  onDeleteUser,
  onNewUser,
}: UsersTableProps) {
  const rows = users.map((user) => (
    <Table.Tr key={user.id}>
      <Table.Td>
        <Text fw={500}>{user.name}</Text>
      </Table.Td>
      <Table.Td>{user.email}</Table.Td>
      <Table.Td>
        <Badge color={roleColors[user.role]} variant="light">
          {roleLabels[user.role]}
        </Badge>
      </Table.Td>
      <Table.Td>
        {user.status === "active" ? (
          <Badge color="green" variant="light">
            Activo
          </Badge>
        ) : (
          <Badge color="gray" variant="light">
            Inactivo
          </Badge>
        )}
      </Table.Td>
      <Table.Td>{user.lastLogin}</Table.Td>
      <Table.Td>
        <Group gap="xs">
          <Button
            size="xs"
            variant="light"
            onClick={() => onToggleStatus(user.id)}>
            {user.status === "active" ? "Desactivar" : "Activar"}
          </Button>
          <Button
            size="xs"
            color="red"
            variant="light"
            onClick={() => onDeleteUser(user.id)}>
            Eliminar
          </Button>
        </Group>
      </Table.Td>
    </Table.Tr>
  ));

  return (
    <Paper withBorder p="md" radius="md">
      <Group justify="space-between" mb="md">
        <div>
          <Text fw={700} size="lg">
            Gestión de Usuarios
          </Text>
          <Text c="dimmed" size="sm">
            Administra cuentas y permisos de acceso
          </Text>
        </div>
        <Button leftSection={<IconUserPlus size={16} />} onClick={onNewUser}>
          Nuevo Usuario
        </Button>
      </Group>

      <Table.ScrollContainer minWidth={800}>
        <Table striped highlightOnHover>
          <Table.Thead>
            <Table.Tr>
              <Table.Th>Nombre</Table.Th>
              <Table.Th>Correo</Table.Th>
              <Table.Th>Rol</Table.Th>
              <Table.Th>Estado</Table.Th>
              <Table.Th>Último Acceso</Table.Th>
              <Table.Th>Acciones</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>{rows}</Table.Tbody>
        </Table>
      </Table.ScrollContainer>
    </Paper>
  );
}
