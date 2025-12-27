"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  Page,
  Layout,
  Card,
  Text,
  BlockStack,
  InlineStack,
  Button,
  TextField,
  Select,
  Checkbox,
  Tag,
  Icon,
  Divider,
  Box,
  Banner,
  FormLayout,
  DropZone,
  Thumbnail,
  Modal,
  Badge,
} from "@shopify/polaris";
import {
  ProductIcon,
  DeleteIcon,
  ImageIcon,
  SearchIcon,
} from "@shopify/polaris-icons";
import VariantsManager from "../components/VariantsManager";
import type {
  ProductFormData,
  ProductVariantFormData,
  ProductImage,
} from "../types";
import { PRODUCT_CATEGORIES, PRODUCT_STATUSES } from "../types";

const initialFormData: ProductFormData = {
  title: "",
  description: "",
  descriptionHtml: "",
  vendor: "",
  productType: "",
  category: "",
  tags: [],
  status: "draft",
  price: "",
  compareAtPrice: "",
  costPerItem: "",
  sku: "",
  barcode: "",
  trackQuantity: true,
  quantity: "0",
  seo: {
    metaTitle: "",
    metaDescription: "",
    urlHandle: "",
  },
  variants: [],
  images: [],
};

export default function NuovoProdottoPage() {
  const router = useRouter();
  const [formData, setFormData] = useState<ProductFormData>(initialFormData);
  const [tagInput, setTagInput] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [files, setFiles] = useState<File[]>([]);

  const handleChange = useCallback(
    (field: keyof ProductFormData, value: string | boolean | string[]) => {
      setFormData((prev) => ({ ...prev, [field]: value }));
      if (errors[field]) {
        setErrors((prev) => {
          const newErrors = { ...prev };
          delete newErrors[field];
          return newErrors;
        });
      }
    },
    [errors]
  );

  const handleSeoChange = useCallback(
    (field: keyof ProductFormData["seo"], value: string) => {
      setFormData((prev) => ({
        ...prev,
        seo: { ...prev.seo, [field]: value },
      }));
    },
    []
  );

  const handleAddTag = useCallback(() => {
    const tag = tagInput.trim();
    if (tag && !formData.tags.includes(tag)) {
      setFormData((prev) => ({
        ...prev,
        tags: [...prev.tags, tag],
      }));
      setTagInput("");
    }
  }, [tagInput, formData.tags]);

  const handleRemoveTag = useCallback((tagToRemove: string) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.filter((t) => t !== tagToRemove),
    }));
  }, []);

  const handleVariantsChange = useCallback(
    (variants: ProductVariantFormData[]) => {
      setFormData((prev) => ({ ...prev, variants }));
    },
    []
  );

  const handleDropZoneDrop = useCallback(
    (_dropFiles: File[], acceptedFiles: File[]) => {
      const newImages: ProductImage[] = acceptedFiles.map((file, index) => ({
        id: `img_new_${Date.now()}_${index}`,
        url: URL.createObjectURL(file),
        alt: file.name,
        position: formData.images.length + index + 1,
      }));
      setFormData((prev) => ({
        ...prev,
        images: [...prev.images, ...newImages],
      }));
      setFiles((prev) => [...prev, ...acceptedFiles]);
    },
    [formData.images]
  );

  const handleRemoveImage = useCallback((imageId: string) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((img) => img.id !== imageId),
    }));
  }, []);

  const validateForm = useCallback(() => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) {
      newErrors.title = "Il titolo e obbligatorio";
    }

    if (!formData.price || parseFloat(formData.price) < 0) {
      newErrors.price = "Inserisci un prezzo valido";
    }

    if (
      formData.compareAtPrice &&
      parseFloat(formData.compareAtPrice) <= parseFloat(formData.price)
    ) {
      newErrors.compareAtPrice =
        "Il prezzo originale deve essere maggiore del prezzo di vendita";
    }

    if (
      formData.trackQuantity &&
      (!formData.quantity || parseInt(formData.quantity) < 0)
    ) {
      newErrors.quantity = "Inserisci una quantita valida";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData]);

  const handleSave = useCallback(
    async (asDraft = false) => {
      if (!validateForm()) {
        return;
      }

      setSaving(true);

      const productToSave = {
        ...formData,
        status: asDraft ? "draft" : formData.status,
        price: parseFloat(formData.price),
        compareAtPrice: formData.compareAtPrice
          ? parseFloat(formData.compareAtPrice)
          : null,
        costPerItem: formData.costPerItem
          ? parseFloat(formData.costPerItem)
          : null,
        quantity: parseInt(formData.quantity),
        seo: {
          ...formData.seo,
          urlHandle:
            formData.seo.urlHandle ||
            formData.title
              .toLowerCase()
              .replace(/[^a-z0-9]+/g, "-")
              .replace(/^-|-$/g, ""),
        },
      };

      console.log("Saving product:", productToSave);

      await new Promise((resolve) => setTimeout(resolve, 1000));

      setSaving(false);
      setShowSuccessModal(true);
    },
    [formData, validateForm]
  );

  const generateUrlHandle = useCallback(() => {
    const handle = formData.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");
    handleSeoChange("urlHandle", handle);
  }, [formData.title, handleSeoChange]);

  const categoryOptions = [
    { label: "Seleziona categoria", value: "" },
    ...PRODUCT_CATEGORIES.map((c) => ({ label: c.label, value: c.value })),
  ];

  const statusOptions = PRODUCT_STATUSES.map((s) => ({
    label: s.label,
    value: s.value,
  }));

  const calculateMargin = () => {
    const price = parseFloat(formData.price) || 0;
    const cost = parseFloat(formData.costPerItem) || 0;
    if (price === 0 || cost === 0) return null;
    const margin = ((price - cost) / price) * 100;
    return margin.toFixed(1);
  };

  const calculateProfit = () => {
    const price = parseFloat(formData.price) || 0;
    const cost = parseFloat(formData.costPerItem) || 0;
    if (price === 0) return null;
    return (price - cost).toFixed(2);
  };

  return (
    <Page
      title="Nuovo prodotto"
      backAction={{ content: "Prodotti", url: "/prodotti" }}
      primaryAction={{
        content: "Salva",
        loading: saving,
        onAction: () => handleSave(false),
      }}
      secondaryActions={[
        {
          content: "Salva come bozza",
          onAction: () => handleSave(true),
        },
      ]}
    >
      <Layout>
        <Layout.Section>
          <BlockStack gap="500">
            <Card>
              <BlockStack gap="400">
                <Text as="h2" variant="headingMd">
                  Informazioni prodotto
                </Text>
                <TextField
                  label="Titolo"
                  value={formData.title}
                  onChange={(value) => handleChange("title", value)}
                  autoComplete="off"
                  error={errors.title}
                  placeholder="es. T-Shirt Premium Cotone"
                />
                <TextField
                  label="Descrizione"
                  value={formData.description}
                  onChange={(value) => handleChange("description", value)}
                  multiline={4}
                  autoComplete="off"
                  helpText="Descrivi il tuo prodotto in modo dettagliato"
                  placeholder="Scrivi una descrizione accattivante per il tuo prodotto..."
                />
              </BlockStack>
            </Card>

            <Card>
              <BlockStack gap="400">
                <Text as="h2" variant="headingMd">
                  Immagini
                </Text>
                <DropZone onDrop={handleDropZoneDrop} accept="image/*">
                  {formData.images.length === 0 && (
                    <DropZone.FileUpload
                      actionHint="o trascina le immagini qui"
                      actionTitle="Aggiungi immagini"
                    />
                  )}
                  {formData.images.length > 0 && (
                    <Box padding="400">
                      <InlineStack gap="400" align="start">
                        {formData.images.map((image) => (
                          <div
                            key={image.id}
                            style={{ position: "relative" }}
                          >
                            <Thumbnail
                              source={image.url}
                              alt={image.alt}
                              size="large"
                            />
                            <div
                              style={{
                                position: "absolute",
                                top: "-8px",
                                right: "-8px",
                              }}
                            >
                              <Button
                                icon={DeleteIcon}
                                onClick={() => handleRemoveImage(image.id)}
                                size="slim"
                                tone="critical"
                              />
                            </div>
                          </div>
                        ))}
                        <div
                          style={{
                            width: "100px",
                            height: "100px",
                            border: "2px dashed #ccc",
                            borderRadius: "8px",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            cursor: "pointer",
                          }}
                        >
                          <Icon source={ImageIcon} tone="subdued" />
                        </div>
                      </InlineStack>
                    </Box>
                  )}
                </DropZone>
                <Text as="p" variant="bodySm" tone="subdued">
                  Formati supportati: JPG, PNG, GIF. Dimensione massima: 5MB
                </Text>
              </BlockStack>
            </Card>

            <Card>
              <BlockStack gap="400">
                <Text as="h2" variant="headingMd">
                  Prezzi
                </Text>
                <FormLayout>
                  <FormLayout.Group>
                    <TextField
                      label="Prezzo"
                      type="number"
                      value={formData.price}
                      onChange={(value) => handleChange("price", value)}
                      prefix="EUR"
                      autoComplete="off"
                      error={errors.price}
                      placeholder="0.00"
                    />
                    <TextField
                      label="Prezzo originale"
                      type="number"
                      value={formData.compareAtPrice}
                      onChange={(value) =>
                        handleChange("compareAtPrice", value)
                      }
                      prefix="EUR"
                      autoComplete="off"
                      error={errors.compareAtPrice}
                      helpText="Mostra il prezzo barrato"
                      placeholder="0.00"
                    />
                  </FormLayout.Group>
                  <FormLayout.Group>
                    <TextField
                      label="Costo per articolo"
                      type="number"
                      value={formData.costPerItem}
                      onChange={(value) => handleChange("costPerItem", value)}
                      prefix="EUR"
                      autoComplete="off"
                      helpText="Non visibile ai clienti"
                      placeholder="0.00"
                    />
                    <BlockStack gap="200">
                      <Text as="span" variant="bodySm" fontWeight="semibold">
                        Margine e profitto
                      </Text>
                      {calculateMargin() && calculateProfit() ? (
                        <InlineStack gap="400">
                          <Badge tone="success">
                            Margine: {calculateMargin()}%
                          </Badge>
                          <Badge>Profitto: {calculateProfit()} EUR</Badge>
                        </InlineStack>
                      ) : (
                        <Text as="span" variant="bodySm" tone="subdued">
                          Inserisci prezzo e costo per calcolare
                        </Text>
                      )}
                    </BlockStack>
                  </FormLayout.Group>
                </FormLayout>
              </BlockStack>
            </Card>

            <Card>
              <BlockStack gap="400">
                <Text as="h2" variant="headingMd">
                  Inventario
                </Text>
                <FormLayout>
                  <FormLayout.Group>
                    <TextField
                      label="SKU (Stock Keeping Unit)"
                      value={formData.sku}
                      onChange={(value) => handleChange("sku", value)}
                      autoComplete="off"
                      placeholder="es. TSH-PRM-001"
                    />
                    <TextField
                      label="Codice a barre (ISBN, UPC, GTIN, etc.)"
                      value={formData.barcode}
                      onChange={(value) => handleChange("barcode", value)}
                      autoComplete="off"
                      placeholder="es. 8012345678901"
                    />
                  </FormLayout.Group>
                </FormLayout>

                <Checkbox
                  label="Traccia quantita"
                  checked={formData.trackQuantity}
                  onChange={(checked) => handleChange("trackQuantity", checked)}
                  helpText="Abilita per monitorare le scorte di questo prodotto"
                />

                {formData.trackQuantity && (
                  <div style={{ width: "200px" }}>
                    <TextField
                      label="Quantita disponibile"
                      type="number"
                      value={formData.quantity}
                      onChange={(value) => handleChange("quantity", value)}
                      autoComplete="off"
                      error={errors.quantity}
                    />
                  </div>
                )}
              </BlockStack>
            </Card>

            <VariantsManager
              variants={formData.variants}
              onVariantsChange={handleVariantsChange}
              basePrice={formData.price}
              baseSku={formData.sku}
            />

            <Card>
              <BlockStack gap="400">
                <Text as="h2" variant="headingMd">
                  SEO
                </Text>
                <Banner tone="info">
                  <p>
                    Ottimizza il tuo prodotto per i motori di ricerca per
                    aumentare la visibilita.
                  </p>
                </Banner>
                <TextField
                  label="Meta titolo"
                  value={formData.seo.metaTitle}
                  onChange={(value) => handleSeoChange("metaTitle", value)}
                  autoComplete="off"
                  maxLength={70}
                  showCharacterCount
                  helpText="Titolo che appare nei risultati di ricerca"
                  placeholder={
                    formData.title || "Inserisci un meta titolo accattivante"
                  }
                />
                <TextField
                  label="Meta descrizione"
                  value={formData.seo.metaDescription}
                  onChange={(value) =>
                    handleSeoChange("metaDescription", value)
                  }
                  multiline={3}
                  autoComplete="off"
                  maxLength={160}
                  showCharacterCount
                  helpText="Descrizione che appare nei risultati di ricerca"
                  placeholder="Scrivi una descrizione che invogli gli utenti a cliccare..."
                />
                <InlineStack gap="200" blockAlign="end">
                  <div style={{ flex: 1 }}>
                    <TextField
                      label="URL handle"
                      value={formData.seo.urlHandle}
                      onChange={(value) => handleSeoChange("urlHandle", value)}
                      autoComplete="off"
                      prefix="tuonegozio.com/products/"
                      helpText="L'URL del prodotto"
                      placeholder="nome-prodotto"
                    />
                  </div>
                  <Button onClick={generateUrlHandle}>Genera da titolo</Button>
                </InlineStack>
              </BlockStack>
            </Card>
          </BlockStack>
        </Layout.Section>

        <Layout.Section variant="oneThird">
          <BlockStack gap="500">
            <Card>
              <BlockStack gap="400">
                <Text as="h2" variant="headingMd">
                  Stato
                </Text>
                <Select
                  label="Stato prodotto"
                  labelHidden
                  options={statusOptions}
                  value={formData.status}
                  onChange={(value) =>
                    handleChange("status", value as ProductFormData["status"])
                  }
                />
                <Divider />
                <Text as="p" variant="bodySm" tone="subdued">
                  {formData.status === "active" &&
                    "Il prodotto sara visibile nel tuo negozio"}
                  {formData.status === "draft" &&
                    "Il prodotto non sara visibile ai clienti"}
                  {formData.status === "archived" &&
                    "Il prodotto e archiviato e non visibile"}
                </Text>
              </BlockStack>
            </Card>

            <Card>
              <BlockStack gap="400">
                <Text as="h2" variant="headingMd">
                  Organizzazione
                </Text>
                <Select
                  label="Categoria"
                  options={categoryOptions}
                  value={formData.category}
                  onChange={(value) => handleChange("category", value)}
                />
                <TextField
                  label="Tipo di prodotto"
                  value={formData.productType}
                  onChange={(value) => handleChange("productType", value)}
                  autoComplete="off"
                  placeholder="es. Magliette, Pantaloni"
                />
                <TextField
                  label="Venditore"
                  value={formData.vendor}
                  onChange={(value) => handleChange("vendor", value)}
                  autoComplete="off"
                  placeholder="es. Nova Fashion"
                />

                <BlockStack gap="200">
                  <Text as="span" variant="bodyMd" fontWeight="semibold">
                    Tag
                  </Text>
                  <InlineStack gap="200" blockAlign="center">
                    <div style={{ flex: 1 }}>
                      <TextField
                        label="Tag"
                        labelHidden
                        value={tagInput}
                        onChange={setTagInput}
                        autoComplete="off"
                        placeholder="Aggiungi tag..."
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault();
                            handleAddTag();
                          }
                        }}
                      />
                    </div>
                    <Button onClick={handleAddTag} disabled={!tagInput.trim()}>
                      Aggiungi
                    </Button>
                  </InlineStack>
                  {formData.tags.length > 0 && (
                    <InlineStack gap="200">
                      {formData.tags.map((tag) => (
                        <Tag key={tag} onRemove={() => handleRemoveTag(tag)}>
                          {tag}
                        </Tag>
                      ))}
                    </InlineStack>
                  )}
                </BlockStack>
              </BlockStack>
            </Card>

            <Card>
              <BlockStack gap="300">
                <Text as="h2" variant="headingMd">
                  Riepilogo
                </Text>
                <Divider />
                <InlineStack align="space-between">
                  <Text as="span" tone="subdued">
                    Prezzo
                  </Text>
                  <Text as="span" fontWeight="semibold">
                    {formData.price ? `${formData.price} EUR` : "-"}
                  </Text>
                </InlineStack>
                {formData.compareAtPrice && (
                  <InlineStack align="space-between">
                    <Text as="span" tone="subdued">
                      Prezzo originale
                    </Text>
                    <Text as="span" textDecorationLine="line-through">
                      {formData.compareAtPrice} EUR
                    </Text>
                  </InlineStack>
                )}
                <InlineStack align="space-between">
                  <Text as="span" tone="subdued">
                    Quantita
                  </Text>
                  <Text as="span">
                    {formData.trackQuantity ? formData.quantity || "0" : "Non tracciato"}
                  </Text>
                </InlineStack>
                <InlineStack align="space-between">
                  <Text as="span" tone="subdued">
                    Varianti
                  </Text>
                  <Text as="span">{formData.variants.length || "Nessuna"}</Text>
                </InlineStack>
                <InlineStack align="space-between">
                  <Text as="span" tone="subdued">
                    Immagini
                  </Text>
                  <Text as="span">{formData.images.length}</Text>
                </InlineStack>
              </BlockStack>
            </Card>
          </BlockStack>
        </Layout.Section>
      </Layout>

      <Modal
        open={showSuccessModal}
        onClose={() => {
          setShowSuccessModal(false);
          router.push("/prodotti");
        }}
        title="Prodotto creato"
        primaryAction={{
          content: "Vai ai prodotti",
          onAction: () => {
            setShowSuccessModal(false);
            router.push("/prodotti");
          },
        }}
        secondaryActions={[
          {
            content: "Crea altro prodotto",
            onAction: () => {
              setShowSuccessModal(false);
              setFormData(initialFormData);
              setFiles([]);
            },
          },
        ]}
      >
        <Modal.Section>
          <BlockStack gap="400">
            <Banner tone="success">
              <p>Il prodotto "{formData.title}" e stato creato con successo!</p>
            </Banner>
          </BlockStack>
        </Modal.Section>
      </Modal>
    </Page>
  );
}
