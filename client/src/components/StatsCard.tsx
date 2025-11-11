import { Paper, Text, Group, ThemeIcon } from "@mantine/core";
import { type ReactNode } from "react";

interface StatsCardProps {
  title: string;
  value: number | string;
  description: string;
  icon: ReactNode;
  color?: string;
}

export function StatsCard({
  title,
  value,
  description,
  icon,
  color = "blue",
}: StatsCardProps) {
  return (
    <Paper withBorder p="md" radius="md">
      <Group justify="space-between">
        <div>
          <Text c="dimmed" tt="uppercase" fw={700} fz="xs">
            {title}
          </Text>
          <Text fw={700} fz="xl" mt="xs">
            {value}
          </Text>
          <Text c="dimmed" fz="xs" mt={4}>
            {description}
          </Text>
        </div>
        <ThemeIcon color={color} variant="light" size={50} radius="md">
          {icon}
        </ThemeIcon>
      </Group>
    </Paper>
  );
}
