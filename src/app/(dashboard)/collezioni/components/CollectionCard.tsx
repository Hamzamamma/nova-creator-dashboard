"use client";

import { useCallback, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Card,
  Text,
  BlockStack,
  InlineStack,
  Badge,
  Button,
  Popover,
  ActionList,
  Thumbnail,
  Box,
} from "@shopify/polaris";
import {
  EditIcon,
  DeleteIcon,
  EyeCheckMarkIcon,
  DuplicateIcon,
  MenuVerticalIcon,
  ImageIcon,
} from "@shopify/polaris-icons";
import type { Collection } from "../types";

interface CollectionCardProps {
  collection: Collection;
  onDelete?: (id: string) => void;
  onDuplicate?: (id: string) => void;
  viewMode?: "grid" | "list";
}

export function CollectionCard({
  collection,
  onDelete,
  onDuplicate,
  viewMode = "grid",
}: CollectionCardProps) {
  const router = useRouter();
  const [popoverActive, setPopoverActive] = useState(false);

  const togglePopover = useCallback(
    () => setPopoverActive((active) => !active),
    []
  );

  const handleEdit = useCallback(() => {
    router.push(`/collezioni/${collection.id}`);
    setPopoverActive(false);
  }, [router, collection.id]);

  const handleDelete = useCallback(() => {
    if (onDelete) {
      onDelete(collection.id);
    }
    setPopoverActive(false);
  }, [onDelete, collection.id]);

  const handleDuplicate = useCallback(() => {
    if (onDuplicate) {
      onDuplicate(collection.id);
    }
    setPopoverActive(false);
  }, [onDuplicate, collection.id]);

  const handleView = useCallback(() => {
    window.open(`/collections/${collection.seo.urlHandle}`, "_blank");
    setPopoverActive(false);
  }, [collection.seo.urlHandle]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("it-IT", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const actionListItems = [
    {
      content: "Modifica",
      icon: EditIcon,
      onAction: handleEdit,
    },
    {
      content: "Visualizza",
      icon: EyeCheckMarkIcon,
      onAction: handleView,
    },
    {
      content: "Duplica",
      icon: DuplicateIcon,
      onAction: handleDuplicate,
    },
    {
      content: "Elimina",
      icon: DeleteIcon,
      destructive: true,
      onAction: handleDelete,
    },
  ];

  const activator = (
    <Button
      icon={MenuVerticalIcon}
      variant="tertiary"
      onClick={togglePopover}
      accessibilityLabel="Azioni collezione"
    />
  );

  if (viewMode === "list") {
    return (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          padding: "12px 16px",
          borderBottom: "1px solid var(--p-color-border-subdued)",
          cursor: "pointer",
        }}
        onClick={handleEdit}
      >
        <div style={{ marginRight: "16px" }}>
          {collection.image ? (
            <Thumbnail
              source={collection.image}
              alt={collection.title}
              size="small"
            />
          ) : (
            <div
              style={{
                width: "40px",
                height: "40px",
                backgroundColor: "var(--p-color-bg-surface-secondary)",
                borderRadius: "8px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <ImageIcon width={20} height={20} />
            </div>
          )}
        </div>

        <div style={{ flex: 1, minWidth: 0 }}>
          <InlineStack align="space-between" blockAlign="center">
            <BlockStack gap="100">
              <Text as="span" variant="bodyMd" fontWeight="semibold">
                {collection.title}
              </Text>
              <InlineStack gap="200">
                <Text as="span" variant="bodySm" tone="subdued">
                  {collection.productsCount} prodotti
                </Text>
                <Badge tone={collection.type === "automated" ? "info" : "attention"}>
                  {collection.type === "automated" ? "Automatica" : "Manuale"}
                </Badge>
                {!collection.isPublished && (
                  <Badge tone="warning">Bozza</Badge>
                )}
              </InlineStack>
            </BlockStack>

            <InlineStack gap="300" blockAlign="center">
              <Text as="span" variant="bodySm" tone="subdued">
                {formatDate(collection.updatedAt)}
              </Text>
              <div onClick={(e) => e.stopPropagation()}>
                <Popover
                  active={popoverActive}
                  activator={activator}
                  onClose={togglePopover}
                  preferredAlignment="right"
                >
                  <ActionList items={actionListItems} />
                </Popover>
              </div>
            </InlineStack>
          </InlineStack>
        </div>
      </div>
    );
  }

  return (
    <Card>
      <div
        style={{ cursor: "pointer" }}
        onClick={handleEdit}
      >
        <div
          style={{
            position: "relative",
            width: "100%",
            paddingTop: "66.67%",
            backgroundColor: "var(--p-color-bg-surface-secondary)",
            borderRadius: "8px 8px 0 0",
            overflow: "hidden",
          }}
        >
          {collection.image ? (
            <img
              src={collection.image}
              alt={collection.title}
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
                objectFit: "cover",
              }}
            />
          ) : (
            <div
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <ImageIcon width={48} height={48} />
            </div>
          )}

          {!collection.isPublished && (
            <div
              style={{
                position: "absolute",
                top: "8px",
                left: "8px",
              }}
            >
              <Badge tone="warning">Bozza</Badge>
            </div>
          )}

          <div
            style={{
              position: "absolute",
              top: "8px",
              right: "8px",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <Popover
              active={popoverActive}
              activator={activator}
              onClose={togglePopover}
              preferredAlignment="right"
            >
              <ActionList items={actionListItems} />
            </Popover>
          </div>
        </div>

        <Box padding="400">
          <BlockStack gap="200">
            <InlineStack align="space-between" blockAlign="start">
              <Text as="h3" variant="headingMd" fontWeight="semibold">
                {collection.title}
              </Text>
            </InlineStack>

            <Text
              as="p"
              variant="bodySm"
              tone="subdued"
              truncate
            >
              {collection.description || "Nessuna descrizione"}
            </Text>

            <InlineStack gap="200" align="start">
              <Badge tone={collection.type === "automated" ? "info" : "attention"}>
                {collection.type === "automated" ? "Automatica" : "Manuale"}
              </Badge>
              <Text as="span" variant="bodySm" tone="subdued">
                {collection.productsCount} prodotti
              </Text>
            </InlineStack>

            <InlineStack gap="100" align="start">
              <Text as="span" variant="bodySm" tone="subdued">
                Aggiornata: {formatDate(collection.updatedAt)}
              </Text>
            </InlineStack>
          </BlockStack>
        </Box>
      </div>
    </Card>
  );
}

export default CollectionCard;
