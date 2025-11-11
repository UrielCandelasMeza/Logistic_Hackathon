import { useState } from "react";
import { Container, Title, Text, Stack, SimpleGrid } from "@mantine/core";
import {
  IconPackage,
  IconArrowRight,
  IconBuildingWarehouse,
  IconGridDots,
} from "@tabler/icons-react";
import { StatsCard } from "../../components/StatsCard";
import { WarehouseSectionsCard } from "../../components/SectionsOverview";
import { WarehouseInventoryTable } from "../../components/InventoryTable";
import { RelocateModal } from "../../components/AssignModal";
import { TransferModal } from "../../components/TransferModal";

// Mock data
const mockSections = [
  { id: 1, name: "Sección A", capacity: 1000, occupied: 750, products: 12 },
  { id: 2, name: "Sección B", capacity: 800, occupied: 600, products: 10 },
  { id: 3, name: "Sección C", capacity: 1200, occupied: 400, products: 8 },
  { id: 4, name: "Sección D", capacity: 900, occupied: 850, products: 15 },
];

const mockInventory = [
  {
    id: 1,
    batchNumber: "LOTE-2024-003",
    product: "Zapato Deportivo Nike",
    quantity: 200,
    section: "Sección A",
    location: "A-12",
  },
  {
    id: 2,
    batchNumber: "LOTE-2024-006",
    product: "Bota Casual Timberland",
    quantity: 150,
    section: "Sección B",
    location: "B-05",
  },
  {
    id: 3,
    batchNumber: "LOTE-2024-008",
    product: "Sandalia Verano Adidas",
    quantity: 300,
    section: "Sección A",
    location: "A-18",
  },
  {
    id: 4,
    batchNumber: "LOTE-2024-010",
    product: "Zapato Formal Clarks",
    quantity: 100,
    section: "Sección C",
    location: "C-03",
  },
  {
    id: 5,
    batchNumber: "LOTE-2024-012",
    product: "Zapatilla Running Puma",
    quantity: 250,
    section: "Sección D",
    location: "D-22",
  },
];

const mockStats = {
  totalCapacity: 3900,
  totalOccupied: 2600,
  totalProducts: 45,
  utilizationRate: 67,
};

export default function HomeStorage() {
  const [inventory, setInventory] = useState(mockInventory);
  const [relocateModalOpened, setRelocateModalOpened] = useState(false);
  const [transferModalOpened, setTransferModalOpened] = useState(false);
  const [selectedItem, setSelectedItem] = useState<
    (typeof mockInventory)[0] | null
  >(null);

  const handleRelocate = (item: (typeof mockInventory)[0]) => {
    setSelectedItem(item);
    setRelocateModalOpened(true);
  };

  const handleRelocateSubmit = (sectionName: string, location: string) => {
    if (!selectedItem) return;

    setInventory(
      inventory.map((item) =>
        item.id === selectedItem.id
          ? { ...item, section: sectionName, location }
          : item
      )
    );
    setSelectedItem(null);
  };

  const handleTransfer = (item: (typeof mockInventory)[0]) => {
    setSelectedItem(item);
    setTransferModalOpened(true);
  };

  const handleTransferSubmit = (quantity: number) => {
    if (!selectedItem) return;

    setInventory(
      inventory
        .map((item) =>
          item.id === selectedItem.id
            ? { ...item, quantity: item.quantity - quantity }
            : item
        )
        .filter((item) => item.quantity > 0)
    );
    setSelectedItem(null);
  };

  return (
    <Container size="xl">
      <Stack gap="xl">
        {/* Header */}
        <div>
          <Title order={1}>Gestión de Almacén</Title>
          <Text c="dimmed">
            Organiza lotes en secciones y transfiere a ventas
          </Text>
        </div>

        {/* Stats Cards */}
        <SimpleGrid cols={{ base: 1, sm: 2, lg: 4 }} spacing="md">
          <StatsCard
            title="Capacidad Total"
            value={mockStats.totalCapacity}
            description="Unidades máximas"
            icon={<IconBuildingWarehouse size={24} />}
            color="blue"
          />
          <StatsCard
            title="Ocupado"
            value={mockStats.totalOccupied}
            description="Unidades almacenadas"
            icon={<IconPackage size={24} />}
            color="green"
          />
          <StatsCard
            title="Productos"
            value={mockStats.totalProducts}
            description="Tipos diferentes"
            icon={<IconGridDots size={24} />}
            color="violet"
          />
          <StatsCard
            title="Utilización"
            value={`${mockStats.utilizationRate}%`}
            description="Del almacén"
            icon={<IconArrowRight size={24} />}
            color="cyan"
          />
        </SimpleGrid>

        {/* Warehouse Sections */}
        <WarehouseSectionsCard sections={mockSections} />

        {/* Inventory Table */}
        <WarehouseInventoryTable
          inventory={inventory}
          onRelocate={handleRelocate}
          onTransfer={handleTransfer}
        />

        {/* Relocate Modal */}
        <RelocateModal
          opened={relocateModalOpened}
          onClose={() => setRelocateModalOpened(false)}
          onSubmit={handleRelocateSubmit}
          item={selectedItem}
          sections={mockSections}
        />

        {/* Transfer Modal */}
        <TransferModal
          opened={transferModalOpened}
          onClose={() => setTransferModalOpened(false)}
          onSubmit={handleTransferSubmit}
          item={selectedItem}
        />
      </Stack>
    </Container>
  );
}
