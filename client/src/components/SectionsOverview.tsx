import { Paper, Text, SimpleGrid, Badge, Progress, Group } from "@mantine/core";

interface Section {
  id: number;
  name: string;
  capacity: number;
  occupied: number;
  products: number;
}

interface WarehouseSectionsCardProps {
  sections: Section[];
}

export function WarehouseSectionsCard({
  sections,
}: WarehouseSectionsCardProps) {
  return (
    <Paper withBorder p="md" radius="md">
      <Text fw={700} size="lg" mb="xs">
        Secciones del Almacén
      </Text>
      <Text c="dimmed" size="sm" mb="md">
        Estado de ocupación por sección
      </Text>

      <SimpleGrid cols={{ base: 1, sm: 2, lg: 4 }} spacing="md">
        {sections.map((section) => {
          const percentage = Math.round(
            (section.occupied / section.capacity) * 100
          );
          return (
            <Paper key={section.id} withBorder p="md" radius="md">
              <Group justify="space-between" mb="sm">
                <Text fw={600}>{section.name}</Text>
                <Badge variant="light" color="gray">
                  {section.products} productos
                </Badge>
              </Group>

              <div>
                <Group justify="space-between" mb={4}>
                  <Text size="sm" c="dimmed">
                    Ocupación
                  </Text>
                  <Text size="sm" fw={500}>
                    {percentage}%
                  </Text>
                </Group>
                <Progress value={percentage} size="sm" radius="xl" mb="xs" />
                <Text size="xs" c="dimmed">
                  {section.occupied} / {section.capacity} unidades
                </Text>
              </div>
            </Paper>
          );
        })}
      </SimpleGrid>
    </Paper>
  );
}
