"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useOrganisation } from "@/context/OrganisationProvider";
import api from "@/lib/axios";
import { Button, Card, Group, Text, Title, CopyButton } from "@mantine/core";
import { IconCheck } from "@tabler/icons-react";

export default function SelectOrganisation() {
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();
  const { setOrganisation } = useOrganisation();

  const handleSubmit = async () => {
    if (!code.trim()) {
      setError("Organisation code is required");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const res = await api.post(
        "/check-org",
        { code: code.trim() },
        {
          headers: { "Content-Type": "application/json" },
        }
      );
      console.log(res);
      localStorage.setItem("org_code", code.trim());
      setOrganisation(code.trim());
    } catch (err: any) {
      if (err.status == 404) setError("Organisation not found");
      else setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-full max-w-md p-6 rounded-lg shadow">
        <h1 className="text-xl font-semibold mb-4">Enter Organisation Code</h1>

        <input
          type="text"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          placeholder="Organisation Code"
          className="w-full border px-3 py-2 rounded mb-3"
        />

        {error && <p className="text-red-500 text-sm mb-3">{error}</p>}

        <button
          onClick={handleSubmit}
          disabled={loading}
          className="w-full bg-black text-white py-2 rounded"
        >
          {loading ? "Validating..." : "Continue"}
        </button>
      </div>
    </div>
  );
}

function TicketSuccess({
  ticketNumber,
  onClose,
  onReset,
}: {
  ticketNumber: string;
  onClose: () => void;
  onReset: () => void;
}) {
  return (
    <Card shadow="md" radius="md" p="xl">
      <Group justify="center" mb="md">
        <IconCheck size={48} color="green" />
      </Group>

      <Title order={3} ta="center">
        Ticket Created Successfully
      </Title>

      <Text ta="center" mt="sm" mb="md">
        Please save your ticket number for future reference.
      </Text>

      <Card withBorder p="md" radius="md" mt="sm">
        <Group justify="space-between">
          <Text fw={600}>{ticketNumber}</Text>

          <CopyButton value={ticketNumber}>
            {({ copied, copy }) => (
              <Button size="xs" onClick={copy}>
                {copied ? "Copied" : "Copy"}
              </Button>
            )}
          </CopyButton>
        </Group>
      </Card>

      <Group mt="lg" justify="center">
        <Button variant="outline" onClick={onReset}>
          Raise Another Ticket
        </Button>
        <Button onClick={onClose}>Close</Button>
      </Group>
    </Card>
  );
}
