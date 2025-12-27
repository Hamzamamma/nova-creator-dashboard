"use client";

import { useState, useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Page,
  Layout,
  Card,
  Text,
  BlockStack,
  InlineStack,
  TextField,
  Select,
  Button,
  Checkbox,
  DropZone,
  Thumbnail,
  Badge,
  Box,
  Divider,
  Banner,
  Modal,
  ButtonGroup,
} from "@shopify/polaris";
import {
  ImageIcon,
  DeleteIcon,
  ArrowLeftIcon,
} from "@shopify/polaris-icons";
import { ProductSelector } from "../components/ProductSelector";
import { ConditionsBuilder } from "../components/ConditionsBuilder";
import { CollectionSortOrder } from "../components/CollectionSortOrder";
import type {
  Collection,
  CollectionType,
  CollectionCondition,
  CollectionProduct,
  CollectionSortOption,
  ConditionRelation,
} from "../types";
import { SORT_OPTIONS } from "../types";
import collectionsData from "../data.json";

const generateId = () =>
  `col-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

export default function NuovaCollezionePage() {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const [discardModalOpen, setDiscardModalOpen] = useState(false);
  const [availableProducts, setAvailableProducts] = useState<CollectionProduct[]>([]);

  // Form state
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [collectionType, setCollectionType] = useState<CollectionType>("manual");
  const [selectedProducts, setSelectedProducts] = useState<CollectionProduct[]>([]);
  const [conditions, setConditions] = useState<CollectionCondition[]>([]);
  const [conditionRelation, setConditionRelation] = useState<ConditionRelation>("all");
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [sortOrder, setSortOrder] = useState<CollectionSortOption>("manual");
  const [isPublished, setIsPublished] = useState(true);

  // SEO state
  const [seoTitle, setSeoTitle] = useState("");
  const [seoDescription, setSeoDescription] = useState("");
  const [urlHandle, setUrlHandle] = useState("");

  useEffect(() => {
    setAvailableProducts(collectionsData.products as CollectionProduct[]);
  }, []);

  useEffect(() => {
    if (title && !urlHandle) {
      const generatedHandle = title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "");
      setUrlHandle(generatedHandle);
    }
  }, [title, urlHandle]);

  const markAsChanged = useCallback(() => {
    setHasChanges(true);
  }, []);

  const handleTitleChange = useCallback(
    (value: string) => {
      setTitle(value);
      markAsChanged();
    },
    [markAsChanged]
  );

  const handleDescriptionChange = useCallback(
    (value: string) => {
      setDescription(value);
      markAsChanged();
    },
    [markAsChanged]
  );

  const handleTypeChange = useCallback(
    (value: string) => {
      setCollectionType(value as CollectionType);
      markAsChanged();
    },
    [markAsChanged]
  );

  const handleProductsChange = useCallback(
    (products: CollectionProduct[]) => {
      setSelectedProducts(products);
      markAsChanged();
    },
    [markAsChanged]
  );

  const handleConditionsChange = useCallback(
    (newConditions: CollectionCondition[]) => {
      setConditions(newConditions);
      markAsChanged();
    },
    [markAsChanged]
  );

  const handleRelationChange = useCallback(
    (relation: ConditionRelation) => {
      setConditionRelation(relation);
      markAsChanged();
    },
    [markAsChanged]
  );

  const handleSortOrderChange = useCallback(
    (newSortOrder: CollectionSortOption) => {
      setSortOrder(newSortOrder);
      markAsChanged();
    },
    [markAsChanged]
  );

  const handleProductsReorder = useCallback(
    (products: CollectionProduct[]) => {
      setSelectedProducts(products);
      markAsChanged();
    },
    [markAsChanged]
  );

  const handleImageDrop = useCallback(
    (_dropFiles: File[], acceptedFiles: File[]) => {
      if (acceptedFiles.length > 0) {
        const file = acceptedFiles[0];
        setImage(file);
        const reader = new FileReader();
        reader.onload = (e) => {
          setImagePreview(e.target?.result as string);
        };
        reader.readAsDataURL(file);
        markAsChanged();
      }
    },
    [markAsChanged]
  );

  const handleRemoveImage = useCallback(() => {
    setImage(null);
    setImagePreview(null);
    markAsChanged();
  }, [markAsChanged]);

  const handleSeoTitleChange = useCallback(
    (value: string) => {
      setSeoTitle(value);
      markAsChanged();
    },
    [markAsChanged]
  );

  const handleSeoDescriptionChange = useCallback(
    (value: string) => {
      setSeoDescription(value);
      markAsChanged();
    },
    [markAsChanged]
  );

  const handleUrlHandleChange = useCallback(
    (value: string) => {
      setUrlHandle(value.toLowerCase().replace(/[^a-z0-9-]/g, ""));
      markAsChanged();
    },
    [markAsChanged]
  );

  const handlePublishedChange = useCallback(
    (checked: boolean) => {
      setIsPublished(checked);
      markAsChanged();
    },
    [markAsChanged]
  );

  const validateForm = useCallback(() => {
    if (!title.trim()) {
      return { valid: false, error: "Il titolo e obbligatorio" };
    }

    if (collectionType === "automated" && conditions.length === 0) {
      return {
        valid: false,
        error: "Aggiungi almeno una condizione per la collezione automatica",
      };
    }

    return { valid: true, error: null };
  }, [title, collectionType, conditions]);

  const handleSave = useCallback(async () => {
    const validation = validateForm();
    if (!validation.valid) {
      alert(validation.error);
      return;
    }

    setSaving(true);

    const newCollection: Collection = {
      id: generateId(),
      title: title.trim(),
      description: description.trim(),
      type: collectionType,
      image: imagePreview || "",
      productsCount:
        collectionType === "manual" ? selectedProducts.length : 0,
      products: collectionType === "manual" ? selectedProducts : [],
      conditions: collectionType === "automated" ? conditions : [],
      conditionRelation,
      seo: {
        pageTitle: seoTitle || title,
        metaDescription: seoDescription || description,
        urlHandle: urlHandle || title.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
      },
      sortOrder,
      isPublished,
      publishedAt: isPublished ? new Date().toISOString() : null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    console.log("Saving collection:", newCollection);

    await new Promise((resolve) => setTimeout(resolve, 1000));

    setSaving(false);
    setHasChanges(false);
    router.push("/collezioni");
  }, [
    validateForm,
    title,
    description,
    collectionType,
    imagePreview,
    selectedProducts,
    conditions,
    conditionRelation,
    seoTitle,
    seoDescription,
    urlHandle,
    sortOrder,
    isPublished,
    router,
  ]);

  const handleDiscard = useCallback(() => {
    if (hasChanges) {
      setDiscardModalOpen(true);
    } else {
      router.push("/collezioni");
    }
  }, [hasChanges, router]);

  const confirmDiscard = useCallback(() => {
    setDiscardModalOpen(false);
    router.push("/collezioni");
  }, [router]);

  const typeOptions = [
    { label: "Manuale", value: "manual" },
    { label: "Automatica (Smart)", value: "automated" },
  ];

  const sortOptions = SORT_OPTIONS.map((opt) => ({
    label: opt.label,
    value: opt.value,
  }));

  return (
    <Page
      title="Nuova collezione"
      backAction={{
        content: "Collezioni",
        onAction: handleDiscard,
      }}
      primaryAction={{
        content: saving ? "Salvataggio..." : "Salva",
        disabled: saving || !title.trim(),
        loading: saving,
        onAction: handleSave,
      }}
      secondaryActions={[
        {
          content: "Annulla",
          onAction: handleDiscard,
        },
      ]}
    >
      <Layout>
        {/* Main Content */}
        <Layout.Section>
          <BlockStack gap="500">
            {/* Title and Description */}
            <Card>
              <BlockStack gap="400">
                <TextField
                  label="Titolo"
                  value={title}
                  onChange={handleTitleChange}
                  placeholder="es. Collezione Estate 2024"
                  autoComplete="off"
                  requiredIndicator
                />

                <TextField
                  label="Descrizione"
                  value={description}
                  onChange={handleDescriptionChange}
                  placeholder="Descrivi la collezione..."
                  multiline={4}
                  autoComplete="off"
                />
              </BlockStack>
            </Card>

            {/* Collection Type */}
            <Card>
              <BlockStack gap="400">
                <Text as="h2" variant="headingMd">
                  Tipo di collezione
                </Text>

                <Select
                  label="Tipo"
                  options={typeOptions}
                  value={collectionType}
                  onChange={handleTypeChange}
                />

                {collectionType === "manual" ? (
                  <Banner tone="info">
                    <p>
                      Aggiungi manualmente i prodotti a questa collezione. Puoi
                      riordinarli e gestirli individualmente.
                    </p>
                  </Banner>
                ) : (
                  <Banner tone="info">
                    <p>
                      I prodotti verranno aggiunti automaticamente in base alle
                      condizioni definite. La collezione si aggiornera
                      automaticamente quando i prodotti corrispondono alle
                      condizioni.
                    </p>
                  </Banner>
                )}
              </BlockStack>
            </Card>

            {/* Products or Conditions */}
            {collectionType === "manual" ? (
              <ProductSelector
                selectedProducts={selectedProducts}
                onSelectionChange={handleProductsChange}
                availableProducts={availableProducts}
              />
            ) : (
              <ConditionsBuilder
                conditions={conditions}
                conditionRelation={conditionRelation}
                onConditionsChange={handleConditionsChange}
                onRelationChange={handleRelationChange}
              />
            )}

            {/* Sort Order */}
            {collectionType === "manual" && selectedProducts.length > 0 && (
              <CollectionSortOrder
                products={selectedProducts}
                sortOrder={sortOrder}
                onSortOrderChange={handleSortOrderChange}
                onProductsReorder={handleProductsReorder}
                isManualCollection={collectionType === "manual"}
              />
            )}

            {collectionType === "automated" && (
              <Card>
                <BlockStack gap="400">
                  <Text as="h2" variant="headingMd">
                    Ordinamento prodotti
                  </Text>
                  <Select
                    label="Ordina i prodotti per"
                    options={sortOptions}
                    value={sortOrder}
                    onChange={(value) =>
                      handleSortOrderChange(value as CollectionSortOption)
                    }
                  />
                </BlockStack>
              </Card>
            )}

            {/* SEO */}
            <Card>
              <BlockStack gap="400">
                <InlineStack align="space-between" blockAlign="center">
                  <Text as="h2" variant="headingMd">
                    SEO e metadati
                  </Text>
                  <Badge>Anteprima motori di ricerca</Badge>
                </InlineStack>

                <Divider />

                {/* SEO Preview */}
                <Box
                  padding="400"
                  background="bg-surface-secondary"
                  borderRadius="200"
                >
                  <BlockStack gap="100">
                    <Text as="p" variant="bodyMd" fontWeight="semibold">
                      {seoTitle || title || "Titolo collezione"}
                    </Text>
                    <Text as="p" variant="bodySm" tone="success">
                      https://tuonegozio.it/collections/
                      {urlHandle || "url-collezione"}
                    </Text>
                    <Text as="p" variant="bodySm" tone="subdued">
                      {seoDescription ||
                        description ||
                        "La descrizione della collezione apparira qui..."}
                    </Text>
                  </BlockStack>
                </Box>

                <TextField
                  label="Titolo pagina"
                  value={seoTitle}
                  onChange={handleSeoTitleChange}
                  placeholder={title || "Titolo per i motori di ricerca"}
                  autoComplete="off"
                  helpText={`${(seoTitle || title).length}/70 caratteri`}
                />

                <TextField
                  label="Meta descrizione"
                  value={seoDescription}
                  onChange={handleSeoDescriptionChange}
                  placeholder={
                    description || "Descrizione per i motori di ricerca"
                  }
                  multiline={2}
                  autoComplete="off"
                  helpText={`${(seoDescription || description).length}/160 caratteri`}
                />

                <TextField
                  label="URL handle"
                  value={urlHandle}
                  onChange={handleUrlHandleChange}
                  prefix="collections/"
                  autoComplete="off"
                  helpText="L'URL della collezione nel tuo negozio"
                />
              </BlockStack>
            </Card>
          </BlockStack>
        </Layout.Section>

        {/* Sidebar */}
        <Layout.Section variant="oneThird">
          <BlockStack gap="500">
            {/* Publishing */}
            <Card>
              <BlockStack gap="400">
                <Text as="h2" variant="headingMd">
                  Pubblicazione
                </Text>

                <Divider />

                <Checkbox
                  label="Pubblica collezione"
                  checked={isPublished}
                  onChange={handlePublishedChange}
                  helpText={
                    isPublished
                      ? "La collezione sara visibile nel negozio"
                      : "La collezione sara salvata come bozza"
                  }
                />

                <Box
                  padding="300"
                  background="bg-surface-secondary"
                  borderRadius="200"
                >
                  <InlineStack gap="200" blockAlign="center">
                    <Badge tone={isPublished ? "success" : "attention"}>
                      {isPublished ? "Pubblicata" : "Bozza"}
                    </Badge>
                    <Text as="span" variant="bodySm" tone="subdued">
                      {isPublished
                        ? "Visibile ai clienti"
                        : "Non visibile ai clienti"}
                    </Text>
                  </InlineStack>
                </Box>
              </BlockStack>
            </Card>

            {/* Collection Image */}
            <Card>
              <BlockStack gap="400">
                <Text as="h2" variant="headingMd">
                  Immagine collezione
                </Text>

                <Divider />

                {imagePreview ? (
                  <BlockStack gap="300">
                    <div
                      style={{
                        position: "relative",
                        width: "100%",
                        paddingTop: "66.67%",
                        borderRadius: "8px",
                        overflow: "hidden",
                      }}
                    >
                      <img
                        src={imagePreview}
                        alt="Anteprima"
                        style={{
                          position: "absolute",
                          top: 0,
                          left: 0,
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                        }}
                      />
                    </div>
                    <Button
                      icon={DeleteIcon}
                      tone="critical"
                      variant="plain"
                      onClick={handleRemoveImage}
                    >
                      Rimuovi immagine
                    </Button>
                  </BlockStack>
                ) : (
                  <DropZone onDrop={handleImageDrop} accept="image/*">
                    <DropZone.FileUpload
                      actionTitle="Carica immagine"
                      actionHint="o trascina qui"
                    />
                  </DropZone>
                )}

                <Text as="p" variant="bodySm" tone="subdued">
                  L'immagine verra mostrata nella pagina della collezione e
                  nelle anteprime
                </Text>
              </BlockStack>
            </Card>

            {/* Summary */}
            <Card>
              <BlockStack gap="400">
                <Text as="h2" variant="headingMd">
                  Riepilogo
                </Text>

                <Divider />

                <BlockStack gap="200">
                  <InlineStack align="space-between">
                    <Text as="span" variant="bodySm" tone="subdued">
                      Tipo
                    </Text>
                    <Badge
                      tone={collectionType === "automated" ? "info" : "attention"}
                    >
                      {collectionType === "automated" ? "Automatica" : "Manuale"}
                    </Badge>
                  </InlineStack>

                  {collectionType === "manual" && (
                    <InlineStack align="space-between">
                      <Text as="span" variant="bodySm" tone="subdued">
                        Prodotti
                      </Text>
                      <Text as="span" variant="bodySm">
                        {selectedProducts.length}
                      </Text>
                    </InlineStack>
                  )}

                  {collectionType === "automated" && (
                    <InlineStack align="space-between">
                      <Text as="span" variant="bodySm" tone="subdued">
                        Condizioni
                      </Text>
                      <Text as="span" variant="bodySm">
                        {conditions.length}
                      </Text>
                    </InlineStack>
                  )}

                  <InlineStack align="space-between">
                    <Text as="span" variant="bodySm" tone="subdued">
                      Ordinamento
                    </Text>
                    <Text as="span" variant="bodySm">
                      {SORT_OPTIONS.find((o) => o.value === sortOrder)?.label}
                    </Text>
                  </InlineStack>

                  <InlineStack align="space-between">
                    <Text as="span" variant="bodySm" tone="subdued">
                      Stato
                    </Text>
                    <Badge tone={isPublished ? "success" : "attention"}>
                      {isPublished ? "Pubblicata" : "Bozza"}
                    </Badge>
                  </InlineStack>
                </BlockStack>
              </BlockStack>
            </Card>
          </BlockStack>
        </Layout.Section>
      </Layout>

      {/* Discard Modal */}
      <Modal
        open={discardModalOpen}
        onClose={() => setDiscardModalOpen(false)}
        title="Scartare le modifiche?"
        primaryAction={{
          content: "Scarta modifiche",
          destructive: true,
          onAction: confirmDiscard,
        }}
        secondaryActions={[
          {
            content: "Continua a modificare",
            onAction: () => setDiscardModalOpen(false),
          },
        ]}
      >
        <Modal.Section>
          <Text as="p">
            Hai delle modifiche non salvate. Sei sicuro di voler uscire senza
            salvare?
          </Text>
        </Modal.Section>
      </Modal>
    </Page>
  );
}
