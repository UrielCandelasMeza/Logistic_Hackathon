import { useState } from "react";
import { Container, Title, Text, Stack, SimpleGrid } from "@mantine/core";
import {
  IconShoppingCart,
  IconCurrencyDollar,
  IconTrendingUp,
  IconPackage,
} from "@tabler/icons-react";
import { StatsCard } from "../../components/StatsCard";
import { ProductsTable } from "../../components/ProductsTable";
import { SalesOrdersTable } from "../../components/SalesOrdersTable";
import { NewSaleModal } from "../../components/NewSaleModal";

// Mock data
const mockProducts = [
  {
    id: 1,
    name: "Zapato Deportivo Nike",
    sku: "ZD-001",
    price: 89.99,
    stock: 45,
  },
  {
    id: 2,
    name: "Bota Casual Timberland",
    sku: "BC-002",
    price: 129.99,
    stock: 120,
  },
  {
    id: 3,
    name: "Sandalia Verano Adidas",
    sku: "SV-003",
    price: 49.99,
    stock: 85,
  },
  {
    id: 4,
    name: "Zapato Formal Clarks",
    sku: "ZF-004",
    price: 99.99,
    stock: 60,
  },
  {
    id: 5,
    name: "Zapatilla Running Puma",
    sku: "ZR-005",
    price: 79.99,
    stock: 95,
  },
];

const mockSales = [
  {
    id: 1,
    orderNumber: "ORD-001",
    customer: "Juan Pérez",
    product: "Zapato Deportivo Nike",
    quantity: 2,
    total: 179.98,
    date: "2024-01-17",
    status: "completed" as const,
  },
  {
    id: 2,
    orderNumber: "ORD-002",
    customer: "María García",
    product: "Bota Casual Timberland",
    quantity: 1,
    total: 129.99,
    date: "2024-01-17",
    status: "pending" as const,
  },
  {
    id: 3,
    orderNumber: "ORD-003",
    customer: "Carlos López",
    product: "Sandalia Verano Adidas",
    quantity: 3,
    total: 149.97,
    date: "2024-01-16",
    status: "completed" as const,
  },
  {
    id: 4,
    orderNumber: "ORD-004",
    customer: "Ana Martínez",
    product: "Zapato Formal Clarks",
    quantity: 1,
    total: 99.99,
    date: "2024-01-16",
    status: "completed" as const,
  },
];

const mockStats = {
  todaySales: 8,
  todayRevenue: 1247.85,
  pendingOrders: 3,
  completedOrders: 45,
};

export default function SalesDashboard() {
  const [sales, setSales] = useState(mockSales);
  const [modalOpened, setModalOpened] = useState(false);

  const handleNewSale = (values: {
    customer: string;
    productSku: string;
    quantity: number;
  }) => {
    const product = mockProducts.find((p) => p.sku === values.productSku);
    if (!product) return;

    const newSale = {
      id: sales.length + 1,
      orderNumber: `ORD-${String(sales.length + 1).padStart(3, "0")}`,
      customer: values.customer,
      product: product.name,
      quantity: values.quantity,
      total: product.price * values.quantity,
      date: new Date().toISOString().split("T")[0],
      status: "pending" as const,
    };

    setSales([newSale, ...sales]);
  };

  const handleCompleteOrder = (orderId: number) => {
    setSales(
      sales.map((sale) =>
        sale.id === orderId ? { ...sale, status: "completed" as const } : sale
      )
    );
  };

  return (
    <Container size="xl">
      <Stack gap="xl">
        {/* Header */}
        <div>
          <Title order={1}>Panel de Ventas</Title>
          <Text c="dimmed">Gestiona pedidos y procesa ventas</Text>
        </div>

        {/* Stats Cards */}
        <SimpleGrid cols={{ base: 1, sm: 2, lg: 4 }} spacing="md">
          <StatsCard
            title="Ventas Hoy"
            value={mockStats.todaySales}
            description="Pedidos procesados"
            icon={<IconShoppingCart size={24} />}
            color="blue"
          />
          <StatsCard
            title="Ingresos Hoy"
            value={`$${mockStats.todayRevenue.toFixed(2)}`}
            description="Total vendido"
            icon={<IconCurrencyDollar size={24} />}
            color="green"
          />
          <StatsCard
            title="Pendientes"
            value={mockStats.pendingOrders}
            description="Por completar"
            icon={<IconPackage size={24} />}
            color="yellow"
          />
          <StatsCard
            title="Completados"
            value={mockStats.completedOrders}
            description="Este mes"
            icon={<IconTrendingUp size={24} />}
            color="teal"
          />
        </SimpleGrid>

        {/* Products Table */}
        <ProductsTable products={mockProducts} />

        {/* Sales Orders Table */}
        <SalesOrdersTable
          sales={sales}
          onCompleteOrder={handleCompleteOrder}
          onNewSale={() => setModalOpened(true)}
        />

        {/* New Sale Modal */}
        <NewSaleModal
          opened={modalOpened}
          onClose={() => setModalOpened(false)}
          onSubmit={handleNewSale}
          products={mockProducts}
        />
      </Stack>
    </Container>
  );
}
