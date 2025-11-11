import { Paper, Text, Stack, Group, Button } from "@mantine/core";

interface SettingItem {
  title: string;
  description: string;
  action: () => void;
}

interface SystemSettingsCardProps {
  settings: SettingItem[];
}

export function SystemSettingsCard({ settings }: SystemSettingsCardProps) {
  return (
    <Paper withBorder p="md" radius="md">
      <Text fw={700} size="lg" mb="xs">
        Configuración del Sistema
      </Text>
      <Text c="dimmed" size="sm" mb="md">
        Ajustes generales y permisos
      </Text>

      <Stack gap="sm">
        {settings.map((setting, index) => (
          <Paper key={index} withBorder p="md" radius="md">
            <Group justify="space-between" align="flex-start">
              <div style={{ flex: 1 }}>
                <Text fw={500}>{setting.title}</Text>
                <Text c="dimmed" size="sm">
                  {setting.description}
                </Text>
              </div>
              <Button variant="light" onClick={setting.action}>
                Configurar
              </Button>
            </Group>
          </Paper>
        ))}
      </Stack>
    </Paper>
  );
}
