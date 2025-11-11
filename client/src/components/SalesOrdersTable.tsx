import { Paper, Text, Table, Badge, Group, Button } from "@mantine/core";
import { IconShoppingCart } from "@tabler/icons-react";

interface Sale {
  id: number;
  orderNumber: string;
  customer: string;
  product: string;
  quantity: number;
  total: number;
  date: string;
  status: "pending" | "completed";
}

interface SalesOrdersTableProps {
  sales: Sale[];
  onCompleteOrder: (orderId: number) => void;
  onNewSale: () => void;
}

export function SalesOrdersTable({
  sales,
  onCompleteOrder,
  onNewSale,
}: SalesOrdersTableProps) {
  const rows = sales.map((sale) => (
    <Table.Tr key={sale.id}>
      <Table.Td>
        <Text fw={500}>{sale.orderNumber}</Text>
      </Table.Td>
      <Table.Td>{sale.customer}</Table.Td>
      <Table.Td>{sale.product}</Table.Td>
      <Table.Td>{sale.quantity}</Table.Td>
      <Table.Td>${sale.total.toFixed(2)}</Table.Td>
      <Table.Td>{sale.date}</Table.Td>
      <Table.Td>
        {sale.status === "pending" ? (
          <Badge color="yellow" variant="light">
            Pendiente
          </Badge>
        ) : (
          <Badge color="green" variant="light">
            Completado
          </Badge>
        )}
      </Table.Td>
      <Table.Td>
        {sale.status === "pending" && (
          <Button size="xs" onClick={() => onCompleteOrder(sale.id)}>
            Completar
          </Button>
        )}
      </Table.Td>
    </Table.Tr>
  ));

  return (
    <Paper withBorder p="md" radius="md">
      <Group justify="space-between" mb="md">
        <div>
          <Text fw={700} size="lg">
            Pedidos Recientes
          </Text>
          <Text c="dimmed" size="sm">
            Historial de ventas y pedidos pendientes
          </Text>
        </div>
        <Button
          leftSection={<IconShoppingCart size={16} />}
          onClick={onNewSale}>
          Nueva Venta
        </Button>
      </Group>

      <Table.ScrollContainer minWidth={900}>
        <Table striped highlightOnHover>
          <Table.Thead>
            <Table.Tr>
              <Table.Th>Pedido</Table.Th>
              <Table.Th>Cliente</Table.Th>
              <Table.Th>Producto</Table.Th>
              <Table.Th>Cantidad</Table.Th>
              <Table.Th>Total</Table.Th>
              <Table.Th>Fecha</Table.Th>
              <Table.Th>Estado</Table.Th>
              <Table.Th>Acción</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>{rows}</Table.Tbody>
        </Table>
      </Table.ScrollContainer>
    </Paper>
  );
}
