import { useState } from "react";
import { Container, Title, Text, Stack, SimpleGrid } from "@mantine/core";
import { IconUsers, IconUserPlus, IconActivity } from "@tabler/icons-react";
import { StatsCard } from "../../components/StatsCard";
import { RoleDistributionCard } from "../../components/RoleDistributionCard";
import { UsersTable } from "../../components/UsersTable";
import { NewUserModal } from "../../components/NewUserModal";
import { SystemSettingsCard } from "../../components/SystemSettingsCard";

// Mock data
const mockUsers = [
  {
    id: 1,
    name: "Juan Pérez",
    email: "gerente@calzastock.com",
    role: "MANAGER",
    status: "active" as const,
    lastLogin: "2024-01-17",
  },
  {
    id: 2,
    name: "María García",
    email: "calidad@calzastock.com",
    role: "CALIDAD",
    status: "active" as const,
    lastLogin: "2024-01-17",
  },
  {
    id: 3,
    name: "Carlos López",
    email: "almacen@calzastock.com",
    role: "ALMACEN",
    status: "active" as const,
    lastLogin: "2024-01-16",
  },
  {
    id: 4,
    name: "Ana Martínez",
    email: "ventas@calzastock.com",
    role: "VENDEDOR",
    status: "active" as const,
    lastLogin: "2024-01-17",
  },
  {
    id: 5,
    name: "Pedro Sánchez",
    email: "ventas2@calzastock.com",
    role: "VENDEDOR",
    status: "inactive" as const,
    lastLogin: "2024-01-10",
  },
];

const mockStats = {
  totalUsers: 15,
  activeUsers: 12,
  inactiveUsers: 3,
  newThisMonth: 2,
};

const roleDistribution = [
  { role: "Gerente", count: 2, color: "violet" },
  { role: "Calidad", count: 3, color: "blue" },
  { role: "Almacén", count: 4, color: "green" },
  { role: "Ventas", count: 5, color: "orange" },
  { role: "Administrador", count: 1, color: "red" },
];

const systemSettings = [
  {
    title: "Registro de Actividad",
    description: "Mantener logs de todas las acciones del sistema",
    action: () => console.log("Configurar logs"),
  },
  {
    title: "Notificaciones",
    description: "Alertas por email para eventos críticos",
    action: () => console.log("Configurar notificaciones"),
  },
  {
    title: "Respaldo de Datos",
    description: "Programar backups automáticos del sistema",
    action: () => console.log("Configurar backups"),
  },
];

export default function ManagerDashboard() {
  const [users, setUsers] = useState(mockUsers);
  const [modalOpened, setModalOpened] = useState(false);

  const handleCreateUser = (values: {
    name: string;
    email: string;
    role: string;
  }) => {
    const newUser = {
      id: users.length + 1,
      name: values.name,
      email: values.email,
      role: values.role,
      status: "active" as const,
      lastLogin: new Date().toISOString().split("T")[0],
    };

    setUsers([...users, newUser]);
  };

  const handleToggleStatus = (userId: number) => {
    setUsers(
      users.map((user) =>
        user.id === userId
          ? {
              ...user,
              status:
                user.status === "active"
                  ? ("inactive" as const)
                  : ("active" as const),
            }
          : user
      )
    );
  };

  const handleDeleteUser = (userId: number) => {
    setUsers(users.filter((user) => user.id !== userId));
  };

  return (
    <Container size="xl">
      <Stack gap="xl">
        {/* Header */}
        <div>
          <Title order={1}>Panel de Gerente</Title>
          <Text c="dimmed">
            Gestiona usuarios y ciertos permisos del sistema
          </Text>
        </div>

        {/* Stats Cards */}
        <SimpleGrid cols={{ base: 1, sm: 2, lg: 4 }} spacing="md">
          <StatsCard
            title="Total Usuarios"
            value={mockStats.totalUsers}
            description="En el sistema"
            icon={<IconUsers size={24} />}
            color="blue"
          />
          <StatsCard
            title="Activos"
            value={mockStats.activeUsers}
            description="Usuarios activos"
            icon={<IconActivity size={24} />}
            color="green"
          />
          <StatsCard
            title="Inactivos"
            value={mockStats.inactiveUsers}
            description="Sin actividad"
            icon={<IconActivity size={24} />}
            color="gray"
          />
          <StatsCard
            title="Nuevos"
            value={mockStats.newThisMonth}
            description="Este mes"
            icon={<IconUserPlus size={24} />}
            color="cyan"
          />
        </SimpleGrid>

        {/* Role Distribution */}
        <RoleDistributionCard data={roleDistribution} />

        {/* Users Table */}
        <UsersTable
          users={users}
          onToggleStatus={handleToggleStatus}
          onDeleteUser={handleDeleteUser}
          onNewUser={() => setModalOpened(true)}
        />

        {/* System Settings */}
        <SystemSettingsCard settings={systemSettings} />

        {/* New User Modal */}
        <NewUserModal
          opened={modalOpened}
          onClose={() => setModalOpened(false)}
          onSubmit={handleCreateUser}
        />
      </Stack>
    </Container>
  );
}
