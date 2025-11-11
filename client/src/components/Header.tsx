import { Link } from "react-router-dom";
import { IconChevronDown, IconSettings, IconLogout } from "@tabler/icons-react";
import { Menu, Text, Avatar, Group, UnstyledButton, rem } from "@mantine/core";
import useAuth from "../context/useAuth";
import { useNavigate } from "react-router-dom";

export default function Header() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };
  return (
    <header className="flex justify-between px-5 py-2 bg-slate-900 text-gray-50 items-center">
      <Link to="/">
        <span className="px-2 py-3 font-bold">Logistics Hackathon</span>
      </Link>
      <div className="gap-5">
        {user ? (
          <>
            <div className="flex gap-10 items-center">
              <Link to="/support">
                <button>Soporte tecnico</button>
              </Link>
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
                          {user.email}
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
                      <IconSettings
                        style={{ width: rem(14), height: rem(14) }}
                      />
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
            </div>
          </>
        ) : (
          <>
            <Link to="/login">
              <button className="px-3 py-2">Iniciar Sesion</button>
            </Link>
            <Link to="/register">
              <button className="px-3 py-2">Register</button>
            </Link>
          </>
        )}
      </div>
    </header>
  );
}
