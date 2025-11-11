import { useState, useRef, useEffect } from "react";
import {
  Container,
  Title,
  Text,
  Stack,
  Paper,
  TextInput,
  Button,
  Group,
  Avatar,
  ScrollArea,
  Badge,
  Card,
  Loader,
  ActionIcon,
  Divider,
  Alert,
} from "@mantine/core";
import {
  IconSend,
  IconUser,
  IconRobot,
  IconAlertCircle,
  IconRefresh,
  IconMessageCircle,
  IconClock,
} from "@tabler/icons-react";

// Types
interface Message {
  id: string;
  text: string;
  sender: "user" | "bot";
  timestamp: Date;
  status?: "sending" | "sent" | "error";
}

interface IBMWatsonConfig {
  apiKey: string;
  serviceUrl: string;
  projectId: string;
}

// Message Component
function ChatMessage({ message }: { message: Message }) {
  const isUser = message.sender === "user";

  return (
    <Group
      gap="sm"
      align="flex-start"
      style={{
        flexDirection: isUser ? "row-reverse" : "row",
      }}>
      <Avatar color={isUser ? "blue" : "violet"} radius="xl" size="md">
        {isUser ? <IconUser size={20} /> : <IconRobot size={20} />}
      </Avatar>

      <Paper
        p="sm"
        radius="md"
        style={{
          maxWidth: "70%",
          backgroundColor: isUser
            ? "var(--mantine-color-blue-6)"
            : "var(--mantine-color-gray-1)",
          color: isUser ? "white" : "inherit",
        }}>
        <Text size="sm">{message.text}</Text>
        <Group gap="xs" mt={4} justify="flex-end">
          <Text size="xs" c={isUser ? "white" : "dimmed"}>
            {message.timestamp.toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </Text>
          {message.status === "sending" && (
            <Loader size="xs" color={isUser ? "white" : "blue"} />
          )}
          {message.status === "error" && (
            <IconAlertCircle size={14} color="red" />
          )}
        </Group>
      </Paper>
    </Group>
  );
}

// Quick Actions Component
function QuickActions({ onSelect }: { onSelect: (text: string) => void }) {
  const quickMessages = [
    "¿Cómo puedo consultar mi inventario?",
    "Necesito ayuda con una orden",
    "¿Cómo registro una devolución?",
    "Problemas con el sistema",
  ];

  return (
    <Card shadow="sm" padding="md" radius="md" withBorder>
      <Group justify="space-between" mb="xs">
        <Text size="sm" fw={500}>
          Consultas Frecuentes
        </Text>
        <IconMessageCircle size={18} />
      </Group>
      <Stack gap="xs">
        {quickMessages.map((msg, index) => (
          <Button
            key={index}
            variant="light"
            size="xs"
            onClick={() => onSelect(msg)}
            fullWidth
            style={{ textAlign: "left", justifyContent: "flex-start" }}>
            {msg}
          </Button>
        ))}
      </Stack>
    </Card>
  );
}

// IBM Watson API Service (Using Project ID)
class IBMWatsonService {
  private config: IBMWatsonConfig;
  private sessionId: string | null = null;

  constructor(config: IBMWatsonConfig) {
    this.config = config;
  }

  // Create a new session using Project ID
  async createSession(): Promise<string> {
    try {
      const response = await fetch(
        `${this.config.serviceUrl}/v2/assistants/${this.config.projectId}/sessions?version=2021-11-27`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Basic ${btoa(`apikey:${this.config.apiKey}`)}`,
          },
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Session creation failed:", errorText);
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      this.sessionId = data.session_id;
      console.log("Session created:", this.sessionId);
      return data.session_id;
    } catch (error) {
      console.error("Error creating session:", error);
      throw error;
    }
  }

  // Send message to Watson using Project ID
  async sendMessage(text: string): Promise<string> {
    try {
      if (!this.sessionId) {
        await this.createSession();
      }

      const response = await fetch(
        `${this.config.serviceUrl}/v2/assistants/${this.config.projectId}/sessions/${this.sessionId}/message?version=2021-11-27`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Basic ${btoa(`apikey:${this.config.apiKey}`)}`,
          },
          body: JSON.stringify({
            input: {
              message_type: "text",
              text: text,
            },
          }),
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Message send failed:", errorText);
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log("Watson response:", data);

      // Extract response text from Watson

      /* eslint-disable @typescript-eslint/no-explicit-any */
      const responseText = data.output.generic
        .filter((item: any) => item.response_type === "text")
        .map((item: any) => item.text)
        .join("\n");
      /* eslint-enable @typescript-eslint/no-explicit-any */

      return responseText || "Lo siento, no pude procesar tu solicitud.";
    } catch (error) {
      console.error("Error sending message:", error);
      throw error;
    }
  }

  // Delete session
  async deleteSession(): Promise<void> {
    if (!this.sessionId) return;

    try {
      await fetch(
        `${this.config.serviceUrl}/v2/assistants/${this.config.projectId}/sessions/${this.sessionId}?version=2021-11-27`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Basic ${btoa(`apikey:${this.config.apiKey}`)}`,
          },
        }
      );
      console.log("Session deleted");
      this.sessionId = null;
    } catch (error) {
      console.error("Error deleting session:", error);
    }
  }
}

// Main Component
export default function SupportChatbot() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      text: "¡Hola! Soy el asistente virtual de CalzaStock. ¿En qué puedo ayudarte hoy?",
      sender: "bot",
      timestamp: new Date(),
      status: "sent",
    },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [watsonService, setWatsonService] = useState<IBMWatsonService | null>(
    null
  );
  //const scrollAreaRef = useRef<HTMLDivElement>(null);
  const viewport = useRef<HTMLDivElement>(null);

  // IBM Watson Configuration usando PROJECT ID
  // IMPORTANTE: En producción, estas credenciales deben estar en variables de entorno
  const watsonConfig: IBMWatsonConfig = {
    apiKey: "YOUR_IBM_WATSON_API_KEY", // Tu API Key de IBM Cloud
    serviceUrl: "https://api.us-south.assistant.watson.cloud.ibm.com", // Dallas region
    projectId: "YOUR_PROJECT_ID", // Tu Project ID (NO Assistant ID)
  };

  // Initialize Watson service
  useEffect(() => {
    const service = new IBMWatsonService(watsonConfig);
    setWatsonService(service);

    // Create session on mount
    service.createSession().catch((err) => {
      setError(
        "No se pudo conectar con el servicio de soporte. Por favor, intenta más tarde."
      );
      console.error("Session creation error:", err);
    });

    // Cleanup on unmount
    return () => {
      service.deleteSession();
    };
  }, []);

  // Auto-scroll to bottom
  useEffect(() => {
    if (viewport.current) {
      viewport.current.scrollTo({
        top: viewport.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [messages]);

  const handleSendMessage = async (text?: string) => {
    const messageText = text || inputValue.trim();
    if (!messageText || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: messageText,
      sender: "user",
      timestamp: new Date(),
      status: "sent",
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");
    setIsLoading(true);
    setError(null);

    try {
      let botResponse: string;

      // Try to use Watson service if available
      if (watsonService) {
        try {
          botResponse = await watsonService.sendMessage(messageText);
        } catch (watsonError) {
          console.error("Watson API error, using fallback:", watsonError);
          // Fallback to mock responses if Watson fails
          botResponse = await simulateFallbackResponse(messageText);
        }
      } else {
        // Use mock responses if service not initialized
        botResponse = await simulateFallbackResponse(messageText);
      }

      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: botResponse,
        sender: "bot",
        timestamp: new Date(),
        status: "sent",
      };

      setMessages((prev) => [...prev, botMessage]);
    } catch (err) {
      setError("Error al enviar el mensaje. Por favor, intenta nuevamente.");
      console.error("Send message error:", err);

      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: "Lo siento, hubo un error al procesar tu solicitud. Por favor, intenta nuevamente.",
        sender: "bot",
        timestamp: new Date(),
        status: "error",
      };

      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleReset = () => {
    setMessages([
      {
        id: "welcome",
        text: "¡Hola! Soy el asistente virtual de CalzaStock. ¿En qué puedo ayudarte hoy?",
        sender: "bot",
        timestamp: new Date(),
        status: "sent",
      },
    ]);
    setError(null);

    // Create new session
    if (watsonService) {
      watsonService.deleteSession().then(() => {
        watsonService.createSession();
      });
    }
  };

  return (
    <Container size="xl">
      <Stack gap="xl">
        {/* Header */}
        <Group justify="space-between">
          <div>
            <Title order={1}>Soporte Técnico</Title>
            <Text c="dimmed">Chatea con nuestro asistente virtual</Text>
          </div>
          <ActionIcon
            variant="light"
            size="lg"
            onClick={handleReset}
            title="Reiniciar conversación">
            <IconRefresh size={20} />
          </ActionIcon>
        </Group>

        <Group align="flex-start" gap="md">
          {/* Chat Area */}
          <Paper
            shadow="sm"
            radius="md"
            withBorder
            style={{
              flex: 1,
              minHeight: "600px",
              display: "flex",
              flexDirection: "column",
            }}>
            {/* Chat Header */}
            <Paper
              p="md"
              radius="md"
              withBorder
              style={{ borderBottom: "none" }}>
              <Group justify="space-between">
                <Group gap="sm">
                  <Avatar color="violet" radius="xl">
                    <IconRobot size={20} />
                  </Avatar>
                  <div>
                    <Text size="sm" fw={500}>
                      Asistente Virtual
                    </Text>
                    <Badge
                      size="xs"
                      color="green"
                      leftSection={<IconClock size={12} />}>
                      En línea
                    </Badge>
                  </div>
                </Group>
              </Group>
            </Paper>

            <Divider />

            {/* Error Alert */}
            {error && (
              <Alert
                icon={<IconAlertCircle size={16} />}
                title="Error"
                color="red"
                variant="light"
                m="md"
                withCloseButton
                onClose={() => setError(null)}>
                {error}
              </Alert>
            )}

            {/* Messages Area */}
            <ScrollArea style={{ flex: 1 }} p="md" viewportRef={viewport}>
              <Stack gap="md">
                {messages.map((message) => (
                  <ChatMessage key={message.id} message={message} />
                ))}
                {isLoading && (
                  <Group gap="sm">
                    <Avatar color="violet" radius="xl" size="md">
                      <IconRobot size={20} />
                    </Avatar>
                    <Paper p="sm" radius="md" bg="gray.1">
                      <Group gap="xs">
                        <Loader size="xs" />
                        <Text size="sm" c="dimmed">
                          Escribiendo...
                        </Text>
                      </Group>
                    </Paper>
                  </Group>
                )}
              </Stack>
            </ScrollArea>

            {/* Input Area */}
            <Paper
              p="md"
              withBorder
              style={{ borderTop: "1px solid var(--mantine-color-gray-3)" }}>
              <Group gap="xs" align="flex-end">
                <TextInput
                  placeholder="Escribe tu mensaje..."
                  value={inputValue}
                  onChange={(e) => setInputValue(e.currentTarget.value)}
                  onKeyPress={handleKeyPress}
                  disabled={isLoading}
                  style={{ flex: 1 }}
                  size="md"
                />
                <Button
                  onClick={() => handleSendMessage()}
                  disabled={!inputValue.trim() || isLoading}
                  leftSection={<IconSend size={18} />}
                  size="md">
                  Enviar
                </Button>
              </Group>
            </Paper>
          </Paper>

          {/* Sidebar */}
          <Stack gap="md" style={{ width: "300px" }}>
            <QuickActions onSelect={handleSendMessage} />

            <Card shadow="sm" padding="md" radius="md" withBorder>
              <Text size="sm" fw={500} mb="xs">
                Información
              </Text>
              <Stack gap="xs">
                <Text size="xs" c="dimmed">
                  • Horario: 24/7
                </Text>
                <Text size="xs" c="dimmed">
                  • Tiempo de respuesta: Instantáneo
                </Text>
                <Text size="xs" c="dimmed">
                  • Idiomas: Español, Inglés
                </Text>
              </Stack>
            </Card>

            <Card shadow="sm" padding="md" radius="md" withBorder>
              <Text size="sm" fw={500} mb="xs">
                ¿Necesitas más ayuda?
              </Text>
              <Stack gap="xs">
                <Button variant="light" size="xs" fullWidth>
                  Contactar Soporte Humano
                </Button>
                <Button variant="light" size="xs" fullWidth>
                  Ver Documentación
                </Button>
              </Stack>
            </Card>
          </Stack>
        </Group>
      </Stack>
    </Container>
  );
}

// Fallback responses for when Watson is unavailable or for testing
async function simulateFallbackResponse(message: string): Promise<string> {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 1000));

  const lowerMessage = message.toLowerCase();

  if (lowerMessage.includes("inventario")) {
    return "Para consultar tu inventario, ve a la sección 'Inventario' en el menú principal. Allí podrás ver todos los productos disponibles, sus cantidades y ubicaciones en el almacén.";
  }

  if (lowerMessage.includes("orden") || lowerMessage.includes("pedido")) {
    return "Para gestionar órdenes:\n1. Ve a 'Ventas' en el menú\n2. Selecciona 'Nueva Orden'\n3. Completa los datos del cliente y productos\n4. Confirma la orden\n\n¿Necesitas ayuda con algún paso específico?";
  }

  if (
    lowerMessage.includes("devolución") ||
    lowerMessage.includes("devolucion")
  ) {
    return "Para registrar una devolución:\n1. Accede a 'Ventas' > 'Historial'\n2. Busca la orden original\n3. Selecciona 'Registrar Devolución'\n4. Indica el motivo y cantidad\n5. El inventario se actualizará automáticamente";
  }

  if (lowerMessage.includes("problema") || lowerMessage.includes("error")) {
    return "Lamento que estés teniendo problemas. ¿Podrías darme más detalles sobre el error que estás experimentando? Por ejemplo:\n• ¿En qué sección ocurre?\n• ¿Qué mensaje de error ves?\n• ¿Cuándo comenzó el problema?";
  }

  if (lowerMessage.includes("hola") || lowerMessage.includes("buenos")) {
    return "¡Hola! Es un placer ayudarte. Puedo asistirte con:\n• Gestión de inventario\n• Procesamiento de órdenes\n• Devoluciones\n• Reportes\n• Problemas técnicos\n\n¿Con qué necesitas ayuda?";
  }

  return "Entiendo tu consulta. Para poder ayudarte mejor, ¿podrías proporcionar más detalles? También puedes seleccionar una de las opciones comunes en el panel lateral.";
}
