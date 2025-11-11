import { Paper, Text, Table, Badge } from "@mantine/core";

interface Product {
  id: number;
  name: string;
  sku: string;
  price: number;
  stock: number;
}

interface ProductsTableProps {
  products: Product[];
}

export function ProductsTable({ products }: ProductsTableProps) {
  const getStockBadge = (stock: number) => {
    if (stock > 50) {
      return (
        <Badge color="green" variant="light">
          Disponible
        </Badge>
      );
    } else if (stock > 20) {
      return (
        <Badge color="yellow" variant="light">
          Stock Bajo
        </Badge>
      );
    } else {
      return (
        <Badge color="red" variant="light">
          Stock Crítico
        </Badge>
      );
    }
  };

  const rows = products.map((product) => (
    <Table.Tr key={product.id}>
      <Table.Td>
        <Text fw={500}>{product.name}</Text>
      </Table.Td>
      <Table.Td>{product.sku}</Table.Td>
      <Table.Td>${product.price.toFixed(2)}</Table.Td>
      <Table.Td>{product.stock}</Table.Td>
      <Table.Td>{getStockBadge(product.stock)}</Table.Td>
    </Table.Tr>
  ));

  return (
    <Paper withBorder p="md" radius="md">
      <Text fw={700} size="lg" mb="xs">
        Productos Disponibles
      </Text>
      <Text c="dimmed" size="sm" mb="md">
        Inventario disponible para venta
      </Text>

      <Table.ScrollContainer minWidth={700}>
        <Table striped highlightOnHover>
          <Table.Thead>
            <Table.Tr>
              <Table.Th>Producto</Table.Th>
              <Table.Th>SKU</Table.Th>
              <Table.Th>Precio</Table.Th>
              <Table.Th>Stock</Table.Th>
              <Table.Th>Estado</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>{rows}</Table.Tbody>
        </Table>
      </Table.ScrollContainer>
    </Paper>
  );
}
