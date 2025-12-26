"use client"

import { useState } from "react"
import {
  Page,
  Card,
  Text,
  BlockStack,
  InlineStack,
  Badge,
  Icon,
  InlineGrid,
  DataTable,
  Modal,
  TextField,
  Select,
} from "@shopify/polaris"
import {
  PersonIcon,
  CreditCardIcon,
  CheckCircleIcon,
  ClockIcon,
  PlusIcon,
} from "@shopify/polaris-icons"
import initialUsersData from "./data.json"

interface User {
  id: number
  name: string
  email: string
  avatar: string
  role: string
  plan: string
  billing: string
  status: string
  joinedDate: string
  lastLogin: string
}

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>(initialUsersData)
  const [modalOpen, setModalOpen] = useState(false)
  const [newUser, setNewUser] = useState({ name: "", email: "", role: "Subscriber", plan: "Basic", status: "Active" })

  const totalUsers = users.length
  const activeUsers = users.filter(u => u.status === "Active").length
  const pendingUsers = users.filter(u => u.status === "Pending").length
  const paidUsers = users.filter(u => u.plan !== "Basic").length

  const statsCards = [
    { title: "Utenti Totali", value: totalUsers, icon: PersonIcon },
    { title: "Utenti Attivi", value: activeUsers, icon: CheckCircleIcon },
    { title: "In Attesa", value: pendingUsers, icon: ClockIcon },
    { title: "Utenti Premium", value: paidUsers, icon: CreditCardIcon },
  ]

  const tableRows = users.map((user) => [
    user.name,
    user.email,
    user.role,
    user.plan,
    user.status,
    user.joinedDate,
  ])

  const handleAddUser = () => {
    const user: User = {
      id: Math.max(...users.map(u => u.id)) + 1,
      name: newUser.name,
      email: newUser.email,
      avatar: newUser.name.split(" ").map(n => n[0]).join("").toUpperCase(),
      role: newUser.role,
      plan: newUser.plan,
      billing: "Auto Debit",
      status: newUser.status,
      joinedDate: new Date().toISOString().split("T")[0],
      lastLogin: new Date().toISOString().split("T")[0],
    }
    setUsers([user, ...users])
    setModalOpen(false)
    setNewUser({ name: "", email: "", role: "Subscriber", plan: "Basic", status: "Active" })
  }

  return (
    <Page
      title="Utenti"
      subtitle="Gestisci gli utenti della piattaforma"
      primaryAction={{ content: "Aggiungi utente", icon: PlusIcon, onAction: () => setModalOpen(true) }}
    >
      <BlockStack gap="500">
        <InlineGrid columns={{ xs: 2, md: 4 }} gap="400">
          {statsCards.map((stat, index) => (
            <Card key={index}>
              <BlockStack gap="200">
                <InlineStack align="space-between" blockAlign="center">
                  <InlineStack gap="200" blockAlign="center">
                    <Icon source={stat.icon} tone="base" />
                    <Text as="span" variant="bodySm" tone="subdued">{stat.title}</Text>
                  </InlineStack>
                  <Badge tone="info">Live</Badge>
                </InlineStack>
                <Text as="p" variant="headingXl" fontWeight="semibold">{stat.value}</Text>
              </BlockStack>
            </Card>
          ))}
        </InlineGrid>

        <Card>
          <BlockStack gap="400">
            <Text as="h2" variant="headingMd">Lista Utenti</Text>
            <DataTable
              columnContentTypes={["text", "text", "text", "text", "text", "text"]}
              headings={["Nome", "Email", "Ruolo", "Piano", "Stato", "Data iscrizione"]}
              rows={tableRows}
            />
          </BlockStack>
        </Card>
      </BlockStack>

      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Aggiungi nuovo utente"
        primaryAction={{ content: "Aggiungi", onAction: handleAddUser }}
        secondaryActions={[{ content: "Annulla", onAction: () => setModalOpen(false) }]}
      >
        <Modal.Section>
          <BlockStack gap="400">
            <TextField
              label="Nome"
              value={newUser.name}
              onChange={(v) => setNewUser({ ...newUser, name: v })}
              autoComplete="off"
            />
            <TextField
              label="Email"
              type="email"
              value={newUser.email}
              onChange={(v) => setNewUser({ ...newUser, email: v })}
              autoComplete="off"
            />
            <Select
              label="Ruolo"
              options={["Admin", "Editor", "Author", "Maintainer", "Subscriber"]}
              value={newUser.role}
              onChange={(v) => setNewUser({ ...newUser, role: v })}
            />
            <Select
              label="Piano"
              options={["Basic", "Professional", "Enterprise"]}
              value={newUser.plan}
              onChange={(v) => setNewUser({ ...newUser, plan: v })}
            />
          </BlockStack>
        </Modal.Section>
      </Modal>
    </Page>
  )
}
