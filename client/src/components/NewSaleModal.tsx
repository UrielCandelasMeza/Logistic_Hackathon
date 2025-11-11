import {
  Modal,
  TextInput,
  Select,
  Button,
  Stack,
  NumberInput,
  Paper,
  Text,
} from "@mantine/core";
import { useState } from "react";

interface Product {
  id: number;
  name: string;
  sku: string;
  price: number;
  stock: number;
}

interface NewSaleModalProps {
  opened: boolean;
  onClose: () => void;
  onSubmit: (values: {
    customer: string;
    productSku: string;
    quantity: number;
  }) => void;
  products: Product[];
}

export function NewSaleModal({
  opened,
  onClose,
  onSubmit,
  products,
}: NewSaleModalProps) {
  const [formData, setFormData] = useState({
    customer: "",
    productSku: "",
    quantity: 1,
  });

  const selectedProduct = products.find((p) => p.sku === formData.productSku);
  const total = selectedProduct ? selectedProduct.price * formData.quantity : 0;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.customer || !formData.productSku || formData.quantity < 1) {
      return;
    }

    onSubmit(formData);
    setFormData({ customer: "", productSku: "", quantity: 1 });
    onClose();
  };

  const handleClose = () => {
    setFormData({ customer: "", productSku: "", quantity: 1 });
    onClose();
  };

  return (
    <Modal
      opened={opened}
      onClose={handleClose}
      title="Registrar Nueva Venta"
      centered
      size="md">
      <form onSubmit={handleSubmit}>
        <Stack gap="md">
          <TextInput
            label="Nombre del Cliente"
            placeholder="Juan Pérez"
            required
            value={formData.customer}
            onChange={(e) =>
              setFormData({ ...formData, customer: e.target.value })
            }
          />

          <Select
            label="Producto"
            placeholder="Selecciona un producto"
            required
            value={formData.productSku}
            onChange={(value) =>
              setFormData({ ...formData, productSku: value || "" })
            }
            data={products.map((product) => ({
              value: product.sku,
              label: `${product.name} - $${product.price}`,
            }))}
            searchable
          />

          <NumberInput
            label="Cantidad"
            placeholder="1"
            required
            min={1}
            value={formData.quantity}
            onChange={(value) =>
              setFormData({ ...formData, quantity: Number(value) || 1 })
            }
          />

          {selectedProduct && formData.quantity > 0 && (
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
                Total
              </Text>
              <Text size="xl" fw={700}>
                ${total.toFixed(2)}
              </Text>
            </Paper>
          )}

          <Button type="submit" fullWidth mt="md">
            Registrar Venta
          </Button>
        </Stack>
      </form>
    </Modal>
  );
}
