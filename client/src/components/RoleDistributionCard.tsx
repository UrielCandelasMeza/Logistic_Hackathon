import { Paper, Text, Badge, SimpleGrid } from "@mantine/core";

interface RoleData {
  role: string;
  count: number;
  color: string;
}

interface RoleDistributionCardProps {
  data: RoleData[];
}

export function RoleDistributionCard({ data }: RoleDistributionCardProps) {
  return (
    <Paper withBorder p="md" radius="md">
      <Text fw={700} size="lg" mb="xs">
        Distribución por Rol
      </Text>
      <Text c="dimmed" size="sm" mb="md">
        Usuarios organizados por función
      </Text>

      <SimpleGrid cols={{ base: 2, sm: 3, md: 5 }} spacing="md">
        {data.map((item) => (
          <Paper key={item.role} withBorder p="md" radius="md">
            <Badge color={item.color} variant="light" mb="xs">
              {item.role}
            </Badge>
            <Text fw={700} size="xl">
              {item.count}
            </Text>
            <Text c="dimmed" size="xs">
              usuarios
            </Text>
          </Paper>
        ))}
      </SimpleGrid>
    </Paper>
  );
}
