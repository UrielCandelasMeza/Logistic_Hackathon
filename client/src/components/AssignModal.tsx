import { Modal, TextInput, Select, Button, Stack, Text } from "@mantine/core";
import { useState } from "react";

interface Section {
  id: number;
  name: string;
}

interface InventoryItem {
  id: number;
  batchNumber: string;
  product: string;
}

interface RelocateModalProps {
  opened: boolean;
  onClose: () => void;
  onSubmit: (sectionName: string, location: string) => void;
  item: InventoryItem | null;
  sections: Section[];
}

export function RelocateModal({
  opened,
  onClose,
  onSubmit,
  item,
  sections,
}: RelocateModalProps) {
  const [formData, setFormData] = useState({
    section: "",
    location: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.section || !formData.location) {
      return;
    }

    onSubmit(formData.section, formData.location);
    setFormData({ section: "", location: "" });
    onClose();
  };

  const handleClose = () => {
    setFormData({ section: "", location: "" });
    onClose();
  };

  return (
    <Modal opened={opened} onClose={handleClose} title="Reubicar Lote" centered>
      {item && (
        <Text size="sm" c="dimmed" mb="md">
          {item.batchNumber} - {item.product}
        </Text>
      )}

      <form onSubmit={handleSubmit}>
        <Stack gap="md">
          <Select
            label="Nueva Sección"
            placeholder="Selecciona una sección"
            required
            value={formData.section}
            onChange={(value) =>
              setFormData({ ...formData, section: value || "" })
            }
            data={sections.map((section) => ({
              value: section.name,
              label: section.name,
            }))}
          />

          <TextInput
            label="Nueva Ubicación"
            placeholder="Ej: A-15"
            required
            value={formData.location}
            onChange={(e) =>
              setFormData({ ...formData, location: e.target.value })
            }
          />

          <Button type="submit" fullWidth mt="md">
            Confirmar Reubicación
          </Button>
        </Stack>
      </form>
    </Modal>
  );
}
