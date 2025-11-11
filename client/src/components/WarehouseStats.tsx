import { SimpleGrid } from "@mantine/core";
import { StatsCard } from "./StatsCard";
import {
  IconBuildingWarehouse,
  IconPackage,
  IconApps,
  IconArrowUpRight,
} from "@tabler/icons-react";

interface Props {
  totalCapacity: number;
  totalOccupied: number;
  totalProducts: number;
  utilizationRate: number;
}

export function WarehouseStats({ stats }: { stats: Props }) {
  return (
    <SimpleGrid cols={{ base: 1, sm: 2, lg: 4 }} spacing="md">
      <StatsCard
        title="Capacidad Total"
        value={stats.totalCapacity}
        description="Unidades máximas"
        icon={<IconBuildingWarehouse size={22} />}
        color="blue"
      />
      <StatsCard
        title="Ocupado"
        value={stats.totalOccupied}
        description="Unidades almacenadas"
        icon={<IconPackage size={22} />}
        color="grape"
      />
      <StatsCard
        title="Productos"
        value={stats.totalProducts}
        description="Tipos diferentes"
        icon={<IconApps size={22} />}
        color="teal"
      />
      <StatsCard
        title="Utilización"
        value={`${stats.utilizationRate}%`}
        description="Del almacén"
        icon={<IconArrowUpRight size={22} />}
        color="orange"
      />
    </SimpleGrid>
  );
}
