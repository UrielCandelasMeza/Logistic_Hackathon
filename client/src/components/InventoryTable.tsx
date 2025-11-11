import { Paper, Text, Table, Badge, Group, Button } from "@mantine/core";

interface InventoryItem {
  id: number;
  batchNumber: string;
  product: string;
  quantity: number;
  section: string;
  location: string;
}

interface WarehouseInventoryTableProps {
  inventory: InventoryItem[];
  onRelocate: (item: InventoryItem) => void;
  onTransfer: (item: InventoryItem) => void;
}

export function WarehouseInventoryTable({
  inventory,
  onRelocate,
  onTransfer,
}: WarehouseInventoryTableProps) {
  const rows = inventory.map((item) => (
    <Table.Tr key={item.id}>
      <Table.Td>
        <Text fw={500}>{item.batchNumber}</Text>
      </Table.Td>
      <Table.Td>{item.product}</Table.Td>
      <Table.Td>{item.quantity}</Table.Td>
      <Table.Td>
        <Badge variant="light">{item.section}</Badge>
      </Table.Td>
      <Table.Td>{item.location}</Table.Td>
      <Table.Td>
        <Group gap="xs">
          <Button size="xs" variant="light" onClick={() => onRelocate(item)}>
            Reubicar
          </Button>
          <Button size="xs" onClick={() => onTransfer(item)}>
            Transferir
          </Button>
        </Group>
      </Table.Td>
    </Table.Tr>
  ));

  return (
    <Paper withBorder p="md" radius="md">
      <Text fw={700} size="lg" mb="xs">
        Inventario en Almacén
      </Text>
      <Text c="dimmed" size="sm" mb="md">
        Gestiona la ubicación y transferencia de productos
      </Text>

      <Table.ScrollContainer minWidth={800}>
        <Table striped highlightOnHover>
          <Table.Thead>
            <Table.Tr>
              <Table.Th>Lote</Table.Th>
              <Table.Th>Producto</Table.Th>
              <Table.Th>Cantidad</Table.Th>
              <Table.Th>Sección</Table.Th>
              <Table.Th>Ubicación</Table.Th>
              <Table.Th>Acciones</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>{rows}</Table.Tbody>
        </Table>
      </Table.ScrollContainer>
    </Paper>
  );
}
