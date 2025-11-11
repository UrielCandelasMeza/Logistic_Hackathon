import { useState } from "react";
import {
  Container,
  Title,
  Text,
  Stack,
  SimpleGrid,
  Card,
  Table,
  Badge,
  Button,
  Modal,
  Select,
  Textarea,
  Group,
  Grid,
  Paper,
} from "@mantine/core";
import {
  IconClock,
  IconCircleCheck,
  IconCircleX,
  IconClipboardCheck,
} from "@tabler/icons-react";

// Types
interface Batch {
  id: number;
  batchNumber: string;
  product: string;
  quantity: number;
  supplier: string;
  status: "pending" | "approved" | "rejected";
  date: string;
}

// StatsCard Component
function StatsCard({
  title,
  value,
  description,
  icon,
  color,
}: {
  title: string;
  value: number | string;
  description: string;
  icon: React.ReactNode;
  color: string;
}) {
  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder>
      <Group justify="space-between" mb="xs">
        <Text size="sm" fw={500} c="dimmed">
          {title}
        </Text>
        <div style={{ color: `var(--mantine-color-${color}-6)` }}>{icon}</div>
      </Group>
      <Text size="xl" fw={700}>
        {value}
      </Text>
      <Text size="xs" c="dimmed" mt={4}>
        {description}
      </Text>
    </Card>
  );
}

// BatchStatusBadge Component
function BatchStatusBadge({ status }: { status: Batch["status"] }) {
  const statusConfig = {
    pending: { color: "yellow", label: "Pendiente" },
    approved: { color: "green", label: "Aprobado" },
    rejected: { color: "red", label: "Rechazado" },
  };

  const config = statusConfig[status];

  return (
    <Badge color={config.color} variant="light">
      {config.label}
    </Badge>
  );
}

// BatchesTable Component
function BatchesTable({
  batches,
  onInspect,
}: {
  batches: Batch[];
  onInspect: (batch: Batch) => void;
}) {
  const rows = batches.map((batch) => (
    <Table.Tr key={batch.id}>
      <Table.Td fw={500}>{batch.batchNumber}</Table.Td>
      <Table.Td>{batch.product}</Table.Td>
      <Table.Td>{batch.quantity}</Table.Td>
      <Table.Td>{batch.supplier}</Table.Td>
      <Table.Td>{batch.date}</Table.Td>
      <Table.Td>
        <BatchStatusBadge status={batch.status} />
      </Table.Td>
      <Table.Td>
        {batch.status === "pending" && (
          <Button size="xs" onClick={() => onInspect(batch)}>
            Inspeccionar
          </Button>
        )}
      </Table.Td>
    </Table.Tr>
  ));

  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder>
      <Card.Section withBorder inheritPadding py="xs">
        <Title order={3}>Lotes para Inspección</Title>
        <Text size="sm" c="dimmed">
          Revisa y aprueba o rechaza los lotes recibidos
        </Text>
      </Card.Section>

      <Card.Section>
        <Table striped highlightOnHover>
          <Table.Thead>
            <Table.Tr>
              <Table.Th>Número de Lote</Table.Th>
              <Table.Th>Producto</Table.Th>
              <Table.Th>Cantidad</Table.Th>
              <Table.Th>Proveedor</Table.Th>
              <Table.Th>Fecha</Table.Th>
              <Table.Th>Estado</Table.Th>
              <Table.Th>Acción</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>{rows}</Table.Tbody>
        </Table>
      </Card.Section>
    </Card>
  );
}

// InspectionModal Component
function InspectionModal({
  opened,
  onClose,
  batch,
  onSubmit,
}: {
  opened: boolean;
  onClose: () => void;
  batch: Batch | null;
  onSubmit: (result: "approved" | "rejected", notes: string) => void;
}) {
  const [inspectionResult, setInspectionResult] = useState<
    "approved" | "rejected" | ""
  >("");
  const [inspectionNotes, setInspectionNotes] = useState("");

  const handleSubmit = () => {
    if (!inspectionResult) return;
    onSubmit(inspectionResult, inspectionNotes);
    setInspectionResult("");
    setInspectionNotes("");
  };

  const handleClose = () => {
    setInspectionResult("");
    setInspectionNotes("");
    onClose();
  };

  return (
    <Modal
      opened={opened}
      onClose={handleClose}
      title="Inspección de Lote"
      size="lg">
      <Stack gap="md">
        {batch && (
          <>
            <Text size="sm" c="dimmed">
              {batch.batchNumber} - {batch.product}
            </Text>

            <Paper p="md" withBorder bg="gray.0">
              <Grid>
                <Grid.Col span={6}>
                  <Text size="sm" fw={500} c="dimmed">
                    Cantidad
                  </Text>
                  <Text size="xl" fw={700}>
                    {batch.quantity}
                  </Text>
                </Grid.Col>
                <Grid.Col span={6}>
                  <Text size="sm" fw={500} c="dimmed">
                    Proveedor
                  </Text>
                  <Text size="lg" fw={500}>
                    {batch.supplier}
                  </Text>
                </Grid.Col>
              </Grid>
            </Paper>

            <Select
              label="Resultado de Inspección"
              placeholder="Selecciona el resultado"
              value={inspectionResult}
              onChange={(value) =>
                setInspectionResult(value as "approved" | "rejected")
              }
              data={[
                { value: "approved", label: "Aprobado" },
                { value: "rejected", label: "Rechazado" },
              ]}
              required
            />

            <Textarea
              label="Notas de Inspección"
              placeholder="Describe los hallazgos de la inspección..."
              value={inspectionNotes}
              onChange={(e) => setInspectionNotes(e.currentTarget.value)}
              rows={4}
            />

            <Group grow>
              <Button onClick={handleSubmit} disabled={!inspectionResult}>
                Confirmar Inspección
              </Button>
              <Button variant="outline" onClick={handleClose}>
                Cancelar
              </Button>
            </Group>
          </>
        )}
      </Stack>
    </Modal>
  );
}

// Mock data
const mockBatches: Batch[] = [
  {
    id: 1,
    batchNumber: "LOTE-2024-001",
    product: "Zapato Deportivo Nike",
    quantity: 200,
    supplier: "Nike Inc.",
    status: "pending",
    date: "2024-01-15",
  },
  {
    id: 2,
    batchNumber: "LOTE-2024-002",
    product: "Bota Casual Timberland",
    quantity: 150,
    supplier: "Timberland Co.",
    status: "pending",
    date: "2024-01-16",
  },
  {
    id: 3,
    batchNumber: "LOTE-2024-003",
    product: "Sandalia Verano Adidas",
    quantity: 300,
    supplier: "Adidas AG",
    status: "approved",
    date: "2024-01-14",
  },
  {
    id: 4,
    batchNumber: "LOTE-2024-004",
    product: "Zapato Formal Clarks",
    quantity: 100,
    supplier: "Clarks Ltd.",
    status: "rejected",
    date: "2024-01-13",
  },
  {
    id: 5,
    batchNumber: "LOTE-2024-005",
    product: "Zapatilla Running Puma",
    quantity: 250,
    supplier: "Puma SE",
    status: "pending",
    date: "2024-01-17",
  },
];

const mockStats = {
  pending: 3,
  approved: 12,
  rejected: 2,
  total: 17,
};

// Main Component
export default function QualityDashboard() {
  const [batches, setBatches] = useState<Batch[]>(mockBatches);
  const [selectedBatch, setSelectedBatch] = useState<Batch | null>(null);
  const [modalOpened, setModalOpened] = useState(false);

  const handleInspect = (batch: Batch) => {
    setSelectedBatch(batch);
    setModalOpened(true);
  };

  const handleSubmitInspection = (result: "approved" | "rejected") => {
    if (!selectedBatch) return;

    setBatches(
      batches.map((b) =>
        b.id === selectedBatch.id ? { ...b, status: result } : b
      )
    );

    setModalOpened(false);
    setSelectedBatch(null);
  };

  return (
    <Container size="xl">
      <Stack gap="xl">
        {/* Header */}
        <div>
          <Title order={1}>Control de Calidad</Title>
          <Text c="dimmed">Inspección y aprobación de lotes de productos</Text>
        </div>

        {/* Stats Cards */}
        <SimpleGrid cols={{ base: 1, sm: 2, lg: 4 }} spacing="md">
          <StatsCard
            title="Pendientes"
            value={mockStats.pending}
            description="Requieren inspección"
            icon={<IconClock size={24} />}
            color="yellow"
          />
          <StatsCard
            title="Aprobados"
            value={mockStats.approved}
            description="Este mes"
            icon={<IconCircleCheck size={24} />}
            color="green"
          />
          <StatsCard
            title="Rechazados"
            value={mockStats.rejected}
            description="Este mes"
            icon={<IconCircleX size={24} />}
            color="red"
          />
          <StatsCard
            title="Total Lotes"
            value={mockStats.total}
            description="Este mes"
            icon={<IconClipboardCheck size={24} />}
            color="blue"
          />
        </SimpleGrid>

        {/* Batches Table */}
        <BatchesTable batches={batches} onInspect={handleInspect} />

        {/* Inspection Modal */}
        <InspectionModal
          opened={modalOpened}
          onClose={() => setModalOpened(false)}
          batch={selectedBatch}
          onSubmit={handleSubmitInspection}
        />
      </Stack>
    </Container>
  );
}
