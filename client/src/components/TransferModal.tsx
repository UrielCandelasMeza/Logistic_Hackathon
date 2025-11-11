import { Modal, NumberInput, Button, Stack, Text, Paper } from "@mantine/core";
import { useState } from "react";

interface InventoryItem {
  id: number;
  batchNumber: string;
  product: string;
  quantity: number;
}

interface TransferModalProps {
  opened: boolean;
  onClose: () => void;
  onSubmit: (quantity: number) => void;
  item: InventoryItem | null;
}

export function TransferModal({
  opened,
  onClose,
  onSubmit,
  item,
}: TransferModalProps) {
  const [quantity, setQuantity] = useState<number>(0);
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!item) return;

    if (quantity < 1) {
      setError("La cantidad debe ser mayor a 0");
      return;
    }

    if (quantity > item.quantity) {
      setError("La cantidad excede el stock disponible");
      return;
    }

    onSubmit(quantity);
    setQuantity(0);
    setError("");
    onClose();
  };

  const handleClose = () => {
    setQuantity(0);
    setError("");
    onClose();
  };

  return (
    <Modal
      opened={opened}
      onClose={handleClose}
      title="Transferir a Ventas"
      centered>
      {item && (
        <Text size="sm" c="dimmed" mb="md">
          {item.batchNumber} - {item.product}
        </Text>
      )}

      <form onSubmit={handleSubmit}>
        <Stack gap="md">
          {item && (
            <Paper
              p="md"
              withBorder
              bg="gray.0"
              style={(theme) => ({
                backgroundColor: theme.colors.dark
                  ? theme.colors.dark[6]
                  : theme.colors.gray[0],
              })}>
              <Text size="sm" c="dimmed" mb={4}>
                Cantidad disponible
              </Text>
              <Text size="xl" fw={700}>
                {item.quantity} unidades
              </Text>
            </Paper>
          )}

          <NumberInput
            label="Cantidad a Transferir"
            placeholder="100"
            required
            min={1}
            max={item?.quantity}
            value={quantity}
            onChange={(value) => {
              setQuantity(Number(value) || 0);
              setError("");
            }}
            error={error}
          />

          <Button type="submit" fullWidth mt="md">
            Confirmar Transferencia
          </Button>
        </Stack>
      </form>
    </Modal>
  );
}
