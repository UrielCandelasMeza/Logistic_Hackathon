import { useState } from "react";
import {
  Container,
  Title,
  Text,
  Stack,
  Grid,
  Card,
  Image,
  Badge,
  Button,
  Group,
  TextInput,
  SegmentedControl,
  Drawer,
  Divider,
  ActionIcon,
  Paper,
  Box,
  Select,
} from "@mantine/core";
import {
  IconShoppingCart,
  IconSearch,
  IconTrash,
  IconPlus,
  IconMinus,
  IconCreditCard,
} from "@tabler/icons-react";

// Types
interface Producto {
  id: number;
  nombre: string;
  categoria: "deporte" | "casual" | "ninos";
  precio: number;
  imagen: string;
  stock: number;
}

interface ItemCarrito extends Producto {
  cantidad: number;
}

// Productos de ejemplo
const productosIniciales: Producto[] = [
  {
    id: 1,
    nombre: "Tenis Deportivos Nike",
    categoria: "deporte",
    precio: 1200,
    imagen: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400",
    stock: 10,
  },
  {
    id: 2,
    nombre: "Zapatos Casuales Adidas",
    categoria: "casual",
    precio: 1500,
    imagen: "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=400",
    stock: 8,
  },
  {
    id: 3,
    nombre: "Zapatos para Niño",
    categoria: "ninos",
    precio: 880,
    imagen:
      "https://images.unsplash.com/photo-1514989940723-e8e51635b782?w=400",
    stock: 15,
  },
  {
    id: 4,
    nombre: "Tenis Running Puma",
    categoria: "deporte",
    precio: 1100,
    imagen:
      "https://images.unsplash.com/photo-1460353581641-37baddab0fa2?w=400",
    stock: 12,
  },
  {
    id: 5,
    nombre: "Botas de Piel",
    categoria: "casual",
    precio: 1800,
    imagen:
      "https://images.unsplash.com/photo-1608256246200-53e635b5b65f?w=400",
    stock: 6,
  },
  {
    id: 6,
    nombre: "Sandalias Infantiles",
    categoria: "ninos",
    precio: 650,
    imagen:
      "https://images.unsplash.com/photo-1603487742131-4160ec999306?w=400",
    stock: 20,
  },
];

// Componente de Tarjeta de Producto
interface ProductCardProps {
  producto: Producto;
  onAgregar: (producto: Producto) => void;
}

function ProductCard({ producto, onAgregar }: ProductCardProps) {
  return (
    <Card shadow="md" padding="lg" radius="md" withBorder>
      <Card.Section>
        <Image src={producto.imagen} height={200} alt={producto.nombre} />
      </Card.Section>

      <Group justify="space-between" mt="md" mb="xs">
        <Text fw={600} size="lg">
          {producto.nombre}
        </Text>
        <Badge color="blue" variant="light">
          {producto.categoria}
        </Badge>
      </Group>

      <Group justify="space-between" mb="md">
        <Text size="xl" fw={700} c="blue">
          ${producto.precio.toFixed(2)}
        </Text>
        <Badge color="green" variant="filled">
          Stock: {producto.stock}
        </Badge>
      </Group>

      <Button
        fullWidth
        leftSection={<IconPlus size={18} />}
        onClick={() => onAgregar(producto)}
        disabled={producto.stock === 0}>
        Agregar al carrito
      </Button>
    </Card>
  );
}

// Componente de Item del Carrito
interface CartItemProps {
  item: ItemCarrito;
  onEliminar: (id: number) => void;
  onCantidad: (id: number, cantidad: number) => void;
}

function CartItem({ item, onEliminar, onCantidad }: CartItemProps) {
  return (
    <Paper p="md" withBorder mb="sm">
      <Group justify="space-between" align="flex-start">
        <Group>
          <Image
            src={item.imagen}
            width={60}
            height={60}
            radius="md"
            alt={item.nombre}
          />
          <Box>
            <Text fw={500}>{item.nombre}</Text>
            <Text size="sm" c="dimmed">
              ${item.precio.toFixed(2)} c/u
            </Text>
          </Box>
        </Group>

        <Group gap="xs">
          <ActionIcon
            variant="default"
            onClick={() => onCantidad(item.id, item.cantidad - 1)}
            disabled={item.cantidad <= 1}>
            <IconMinus size={16} />
          </ActionIcon>

          <Text fw={600} style={{ minWidth: "30px", textAlign: "center" }}>
            {item.cantidad}
          </Text>

          <ActionIcon
            variant="default"
            onClick={() => onCantidad(item.id, item.cantidad + 1)}
            disabled={item.cantidad >= item.stock}>
            <IconPlus size={16} />
          </ActionIcon>

          <ActionIcon
            color="red"
            variant="light"
            onClick={() => onEliminar(item.id)}>
            <IconTrash size={16} />
          </ActionIcon>
        </Group>
      </Group>

      <Text ta="right" mt="xs" fw={600} c="blue">
        Subtotal: ${(item.precio * item.cantidad).toFixed(2)}
      </Text>
    </Paper>
  );
}

// Componente Principal
export default function ShoeStoreSimulator() {
  const [busqueda, setBusqueda] = useState<string>("");
  const [categoria, setCategoria] = useState<string>("todos");
  const [carrito, setCarrito] = useState<ItemCarrito[]>([]);
  const [drawerAbierto, setDrawerAbierto] = useState<boolean>(false);
  const [mostrarPago, setMostrarPago] = useState<boolean>(false);

  // Datos del formulario de pago
  const [nombreCliente, setNombreCliente] = useState<string>("");
  const [metodoPago, setMetodoPago] = useState<string | null>(null);
  const [pagoExitoso, setPagoExitoso] = useState<boolean>(false);

  const agregarAlCarrito = (producto: Producto) => {
    const existe = carrito.find((item) => item.id === producto.id);

    if (existe) {
      if (existe.cantidad < producto.stock) {
        setCarrito(
          carrito.map((item) =>
            item.id === producto.id
              ? { ...item, cantidad: item.cantidad + 1 }
              : item
          )
        );
      }
    } else {
      setCarrito([...carrito, { ...producto, cantidad: 1 }]);
    }
  };

  const eliminarDelCarrito = (id: number) => {
    setCarrito(carrito.filter((item) => item.id !== id));
  };

  const cambiarCantidad = (id: number, nuevaCantidad: number) => {
    if (nuevaCantidad < 1) return;

    setCarrito(
      carrito.map((item) =>
        item.id === id ? { ...item, cantidad: nuevaCantidad } : item
      )
    );
  };

  const productosFiltrados = productosIniciales.filter((p) => {
    const coincideCategoria =
      categoria === "todos" || p.categoria === categoria;
    const coincideBusqueda = p.nombre
      .toLowerCase()
      .includes(busqueda.toLowerCase());
    return coincideCategoria && coincideBusqueda;
  });

  const totalItems = carrito.reduce((acc, item) => acc + item.cantidad, 0);
  const totalPrecio = carrito.reduce(
    (acc, item) => acc + item.precio * item.cantidad,
    0
  );

  const procesarPago = () => {
    if (!nombreCliente || !metodoPago) {
      alert("Por favor completa todos los campos");
      return;
    }

    setPagoExitoso(true);
    setTimeout(() => {
      setCarrito([]);
      setMostrarPago(false);
      setPagoExitoso(false);
      setNombreCliente("");
      setMetodoPago(null);
      setDrawerAbierto(false);
    }, 3000);
  };

  return (
    <Container size="xl" py="xl">
      {/* Header */}
      <Stack gap="md" mb="xl">
        <Group justify="space-between">
          <div>
            <Title order={1} c="blue">
              👟 Zapatería Sporty
            </Title>
            <Text c="dimmed">Tu tienda de zapatos favorita</Text>
          </div>

          <Button
            leftSection={<IconShoppingCart size={20} />}
            size="lg"
            onClick={() => setDrawerAbierto(true)}
            variant="filled"
            color="blue">
            Carrito ({totalItems})
          </Button>
        </Group>

        {/* Filtros */}
        <Paper p="md" withBorder>
          <Group grow>
            <TextInput
              placeholder="Buscar productos..."
              leftSection={<IconSearch size={16} />}
              value={busqueda}
              onChange={(e) => setBusqueda(e.currentTarget.value)}
            />

            <SegmentedControl
              value={categoria}
              onChange={setCategoria}
              data={[
                { label: "Todos", value: "todos" },
                { label: "Deportivos", value: "deporte" },
                { label: "Casuales", value: "casual" },
                { label: "Niños", value: "ninos" },
              ]}
            />
          </Group>
        </Paper>
      </Stack>

      {/* Grid de Productos */}
      <Grid gutter="md">
        {productosFiltrados.map((producto) => (
          <Grid.Col key={producto.id} span={{ base: 12, sm: 6, md: 4 }}>
            <ProductCard producto={producto} onAgregar={agregarAlCarrito} />
          </Grid.Col>
        ))}
      </Grid>

      {/* Drawer del Carrito */}
      <Drawer
        opened={drawerAbierto}
        onClose={() => setDrawerAbierto(false)}
        title="🛍️ Tu Carrito de Compras"
        position="right"
        size="md">
        <Stack gap="md">
          {carrito.length === 0 ? (
            <Text ta="center" c="dimmed" py="xl">
              Tu carrito está vacío
            </Text>
          ) : (
            <>
              {carrito.map((item) => (
                <CartItem
                  key={item.id}
                  item={item}
                  onEliminar={eliminarDelCarrito}
                  onCantidad={cambiarCantidad}
                />
              ))}

              <Divider my="md" />

              <Paper p="md" withBorder>
                <Group justify="space-between" mb="xs">
                  <Text size="lg">Subtotal:</Text>
                  <Text size="lg" fw={600}>
                    ${totalPrecio.toFixed(2)}
                  </Text>
                </Group>
                <Group justify="space-between" mb="xs">
                  <Text size="lg">IVA (16%):</Text>
                  <Text size="lg" fw={600}>
                    ${(totalPrecio * 0.16).toFixed(2)}
                  </Text>
                </Group>
                <Divider my="xs" />
                <Group justify="space-between">
                  <Text size="xl" fw={700}>
                    Total:
                  </Text>
                  <Text size="xl" fw={700} c="blue">
                    ${(totalPrecio * 1.16).toFixed(2)}
                  </Text>
                </Group>
              </Paper>

              <Button
                fullWidth
                size="lg"
                leftSection={<IconCreditCard size={20} />}
                onClick={() => setMostrarPago(true)}>
                Proceder al Pago
              </Button>
            </>
          )}
        </Stack>
      </Drawer>

      {/* Modal de Pago */}
      <Drawer
        opened={mostrarPago}
        onClose={() => setMostrarPago(false)}
        title="💳 Procesar Pago"
        position="right"
        size="md">
        {pagoExitoso ? (
          <Paper p="xl" ta="center">
            <Text size="64px">✅</Text>
            <Title order={2} c="green" mb="md">
              ¡Pago Exitoso!
            </Title>
            <Text c="dimmed">Gracias por tu compra en Zapatería Sporty</Text>
            <Text mt="md" fw={500}>
              Total pagado: ${(totalPrecio * 1.16).toFixed(2)}
            </Text>
          </Paper>
        ) : (
          <Stack gap="md">
            <Paper p="md" withBorder>
              <Text fw={600} mb="xs">
                Resumen del Pedido
              </Text>
              <Group justify="space-between">
                <Text>Total a pagar:</Text>
                <Text fw={700} size="xl" c="blue">
                  ${(totalPrecio * 1.16).toFixed(2)}
                </Text>
              </Group>
            </Paper>

            <TextInput
              label="Nombre del Cliente"
              placeholder="Ingresa tu nombre"
              value={nombreCliente}
              onChange={(e) => setNombreCliente(e.currentTarget.value)}
              required
            />

            <Select
              label="Método de Pago"
              placeholder="Selecciona un método"
              value={metodoPago}
              onChange={setMetodoPago}
              data={[
                { value: "efectivo", label: "💵 Efectivo" },
                { value: "tarjeta", label: "💳 Tarjeta de Crédito/Débito" },
                { value: "transferencia", label: "🏦 Transferencia" },
              ]}
              required
            />

            <Button
              fullWidth
              size="lg"
              onClick={procesarPago}
              disabled={!nombreCliente || !metodoPago}>
              Confirmar Pago
            </Button>
          </Stack>
        )}
      </Drawer>
    </Container>
  );
}
