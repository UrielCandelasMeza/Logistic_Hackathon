import { useState } from "react";
import {
  AppShell,
  Burger,
  Group,
  Text,
  NavLink,
  ScrollArea,
  Avatar,
  Menu,
  UnstyledButton,
  rem,
  useMantineColorScheme,
  ActionIcon,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import {
  IconHome,
  IconUsers,
  IconPackage,
  IconShoppingCart,
  IconClipboardCheck,
  IconLogout,
  IconSettings,
  IconSun,
  IconMoon,
  IconChevronDown,
} from "@tabler/icons-react";
import { Outlet, useNavigate } from "react-router-dom";
import useAuth from "../context/useAuth";

const roleNavigation = {
  ADMIN: [
    { label: "Dashboard", icon: IconHome, path: "/home/admin" },
    { label: "Usuarios", icon: IconUsers, path: "/home/admin/users" },
    {
      label: "Configuración",
      icon: IconSettings,
      path: "/home/admin/settings",
    },
  ],
  MANAGER: [
    { label: "Dashboard", icon: IconHome, path: "/home/manager" },
    { label: "Inventario", icon: IconPackage, path: "/home/manager/inventory" },
    { label: "Ventas", icon: IconShoppingCart, path: "/home/manager/sales" },
    {
      label: "Calidad",
      icon: IconClipboardCheck,
      path: "/home/manager/quality",
    },
  ],
  VENDEDOR: [
    { label: "Dashboard", icon: IconHome, path: "/home/sales" },
    { label: "Ventas", icon: IconShoppingCart, path: "/home/sales/sales" },
    { label: "Clientes", icon: IconUsers, path: "/home/sales/customers" },
  ],
  CALIDAD: [
    { label: "Dashboard", icon: IconHome, path: "/home/quality" },
    {
      label: "Inspecciones",
      icon: IconClipboardCheck,
      path: "/home/quality/inspections",
    },
    { label: "Reportes", icon: IconPackage, path: "/home/quality/reports" },
  ],
  ALMACEN: [
    { label: "Dashboard", icon: IconHome, path: "/home/storage" },
    { label: "Inventario", icon: IconPackage, path: "/home/storage/inventory" },
    {
      label: "Entradas",
      icon: IconShoppingCart,
      path: "/home/storage/entries",
    },
  ],
  CAJERO: [
    { label: "Dashboard", icon: IconHome, path: "/home/checkout" },
    { label: "Caja", icon: IconShoppingCart, path: "/home/checkout/register" },
  ],
};

export function QualityLayout() {
  const [opened, { toggle }] = useDisclosure();
  const { colorScheme, toggleColorScheme } = useMantineColorScheme();
  const { user, logout } = useAuth();
  const role = user?.rol || "VENDEDOR";
  const navigate = useNavigate();
  const [active, setActive] = useState(0);

  const navigation = roleNavigation[role as keyof typeof roleNavigation] || [];

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  const handleNavigation = (path: string, index: number) => {
    setActive(index);
    navigate(path);
  };

  return (
    <AppShell
      header={{ height: 60 }}
      navbar={{
        width: 280,
        breakpoint: "sm",
        collapsed: { mobile: !opened },
      }}
      padding="md">
      <AppShell.Header>
        <Group h="100%" px="md" justify="space-between">
          <Group>
            <Burger
              opened={opened}
              onClick={toggle}
              hiddenFrom="sm"
              size="sm"
            />
            <Text size="xl" fw={700} c="blue">
              CalzaStock
            </Text>
          </Group>

          <Group>
            <ActionIcon
              variant="default"
              onClick={() => toggleColorScheme()}
              size="lg">
              {colorScheme === "dark" ? (
                <IconSun style={{ width: rem(18), height: rem(18) }} />
              ) : (
                <IconMoon style={{ width: rem(18), height: rem(18) }} />
              )}
            </ActionIcon>

            <Menu shadow="md" width={200}>
              <Menu.Target>
                <UnstyledButton>
                  <Group gap="xs">
                    <Avatar color="blue" radius="xl">
                      {user?.email?.charAt(0).toUpperCase()}
                    </Avatar>
                    <div style={{ flex: 1 }}>
                      <Text size="sm" fw={500}>
                        {user?.email}
                      </Text>
                      <Text c="dimmed" size="xs">
                        {role}
                      </Text>
                    </div>
                    <IconChevronDown size={16} />
                  </Group>
                </UnstyledButton>
              </Menu.Target>

              <Menu.Dropdown>
                <Menu.Label>Cuenta</Menu.Label>
                <Menu.Item
                  leftSection={
                    <IconSettings style={{ width: rem(14), height: rem(14) }} />
                  }>
                  Configuración
                </Menu.Item>
                <Menu.Divider />
                <Menu.Item
                  color="red"
                  leftSection={
                    <IconLogout style={{ width: rem(14), height: rem(14) }} />
                  }
                  onClick={handleLogout}>
                  Cerrar Sesión
                </Menu.Item>
              </Menu.Dropdown>
            </Menu>
          </Group>
        </Group>
      </AppShell.Header>

      <AppShell.Navbar p="md">
        <AppShell.Section grow component={ScrollArea}>
          <div>
            <Text size="xs" fw={500} c="dimmed" mb="xs" tt="uppercase">
              Navegación
            </Text>
            {navigation.map((item, index) => (
              <NavLink
                key={item.label}
                active={index === active}
                label={item.label}
                leftSection={<item.icon size={20} stroke={1.5} />}
                onClick={() => handleNavigation(item.path, index)}
                mb={4}
              />
            ))}
          </div>
        </AppShell.Section>

        <AppShell.Section>
          <NavLink
            label="Cerrar Sesión"
            leftSection={<IconLogout size={20} stroke={1.5} />}
            onClick={handleLogout}
            color="red"
          />
        </AppShell.Section>
      </AppShell.Navbar>

      <AppShell.Main>
        <Outlet />
      </AppShell.Main>
    </AppShell>
  );
}
export default QualityLayout;
