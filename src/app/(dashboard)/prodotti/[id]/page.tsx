"use client";

import { useState, useCallback, useEffect, use } from "react";
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
  Spinner,
  SkeletonPage,
  SkeletonBodyText,
  SkeletonDisplayText,
} from "@shopify/polaris";
import {
  ProductIcon,
  DeleteIcon,
  ImageIcon,
  EyeCheckMarkIcon,
} from "@shopify/polaris-icons";
import VariantsManager from "../components/VariantsManager";
import type {
  Product,
  ProductFormData,
  ProductVariantFormData,
  ProductImage,
} from "../types";
import { PRODUCT_CATEGORIES, PRODUCT_STATUSES } from "../types";
import productsData from "../data.json";

interface EditProductPageProps {
  params: Promise<{ id: string }>;
}

export default function EditProductPage({ params }: EditProductPageProps) {
  const { id } = use(params);
  const router = useRouter();
  const [product, setProduct] = useState<Product | null>(null);
  const [formData, setFormData] = useState<ProductFormData | null>(null);
  const [tagInput, setTagInput] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  useEffect(() => {
    const loadProduct = () => {
      setLoading(true);
      setTimeout(() => {
        const foundProduct = (productsData.products as Product[]).find(
          (p) => p.id === id
        );
        if (foundProduct) {
          setProduct(foundProduct);
          setFormData({
            title: foundProduct.title,
            description: foundProduct.description,
            descriptionHtml: foundProduct.descriptionHtml,
            vendor: foundProduct.vendor,
            productType: foundProduct.productType,
            category: foundProduct.category,
            tags: foundProduct.tags,
            status: foundProduct.status,
            price: foundProduct.price.toString(),
            compareAtPrice: foundProduct.compareAtPrice?.toString() || "",
            costPerItem: foundProduct.costPerItem?.toString() || "",
            sku: foundProduct.sku,
            barcode: foundProduct.barcode,
            trackQuantity: foundProduct.trackQuantity,
            quantity: foundProduct.quantity.toString(),
            seo: {
              metaTitle: foundProduct.seo.metaTitle,
              metaDescription: foundProduct.seo.metaDescription,
              urlHandle: foundProduct.seo.urlHandle,
            },
            variants: foundProduct.variants.map((v) => ({
              id: v.id,
              title: v.title,
              sku: v.sku,
              barcode: v.barcode,
              price: v.price.toString(),
              compareAtPrice: v.compareAtPrice?.toString() || "",
              costPerItem: v.costPerItem?.toString() || "",
              quantity: v.quantity.toString(),
              options: v.options,
            })),
            images: foundProduct.images,
          });
        }
        setLoading(false);
      }, 500);
    };
    loadProduct();
  }, [id]);

  const handleChange = useCallback(
    (field: keyof ProductFormData, value: string | boolean | string[]) => {
      setFormData((prev) => (prev ? { ...prev, [field]: value } : null));
      setHasUnsavedChanges(true);
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
      setFormData((prev) =>
        prev ? { ...prev, seo: { ...prev.seo, [field]: value } } : null
      );
      setHasUnsavedChanges(true);
    },
    []
  );

  const handleAddTag = useCallback(() => {
    const tag = tagInput.trim();
    if (tag && formData && !formData.tags.includes(tag)) {
      setFormData((prev) =>
        prev ? { ...prev, tags: [...prev.tags, tag] } : null
      );
      setTagInput("");
      setHasUnsavedChanges(true);
    }
  }, [tagInput, formData]);

  const handleRemoveTag = useCallback((tagToRemove: string) => {
    setFormData((prev) =>
      prev ? { ...prev, tags: prev.tags.filter((t) => t !== tagToRemove) } : null
    );
    setHasUnsavedChanges(true);
  }, []);

  const handleVariantsChange = useCallback(
    (variants: ProductVariantFormData[]) => {
      setFormData((prev) => (prev ? { ...prev, variants } : null));
      setHasUnsavedChanges(true);
    },
    []
  );

  const handleDropZoneDrop = useCallback(
    (_dropFiles: File[], acceptedFiles: File[]) => {
      if (!formData) return;
      const newImages: ProductImage[] = acceptedFiles.map((file, index) => ({
        id: `img_new_${Date.now()}_${index}`,
        url: URL.createObjectURL(file),
        alt: file.name,
        position: formData.images.length + index + 1,
      }));
      setFormData((prev) =>
        prev ? { ...prev, images: [...prev.images, ...newImages] } : null
      );
      setHasUnsavedChanges(true);
    },
    [formData]
  );

  const handleRemoveImage = useCallback((imageId: string) => {
    setFormData((prev) =>
      prev
        ? { ...prev, images: prev.images.filter((img) => img.id !== imageId) }
        : null
    );
    setHasUnsavedChanges(true);
  }, []);

  const validateForm = useCallback(() => {
    if (!formData) return false;
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

  const handleSave = useCallback(async () => {
    if (!formData || !validateForm()) {
      return;
    }

    setSaving(true);

    const productToSave = {
      ...formData,
      id,
      price: parseFloat(formData.price),
      compareAtPrice: formData.compareAtPrice
        ? parseFloat(formData.compareAtPrice)
        : null,
      costPerItem: formData.costPerItem
        ? parseFloat(formData.costPerItem)
        : null,
      quantity: parseInt(formData.quantity),
      updatedAt: new Date().toISOString(),
    };

    console.log("Updating product:", productToSave);

    await new Promise((resolve) => setTimeout(resolve, 1000));

    setSaving(false);
    setHasUnsavedChanges(false);
    setShowSuccessModal(true);
  }, [formData, validateForm, id]);

  const handleDelete = useCallback(async () => {
    console.log("Deleting product:", id);
    await new Promise((resolve) => setTimeout(resolve, 500));
    setShowDeleteModal(false);
    router.push("/prodotti");
  }, [id, router]);

  const generateUrlHandle = useCallback(() => {
    if (!formData) return;
    const handle = formData.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");
    handleSeoChange("urlHandle", handle);
  }, [formData, handleSeoChange]);

  const calculateMargin = () => {
    if (!formData) return null;
    const price = parseFloat(formData.price) || 0;
    const cost = parseFloat(formData.costPerItem) || 0;
    if (price === 0 || cost === 0) return null;
    const margin = ((price - cost) / price) * 100;
    return margin.toFixed(1);
  };

  const calculateProfit = () => {
    if (!formData) return null;
    const price = parseFloat(formData.price) || 0;
    const cost = parseFloat(formData.costPerItem) || 0;
    if (price === 0) return null;
    return (price - cost).toFixed(2);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("it-IT", {
      day: "2-digit",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (loading) {
    return (
      <SkeletonPage primaryAction backAction>
        <Layout>
          <Layout.Section>
            <BlockStack gap="500">
              <Card>
                <BlockStack gap="400">
                  <SkeletonDisplayText size="small" />
                  <SkeletonBodyText lines={3} />
                </BlockStack>
              </Card>
              <Card>
                <BlockStack gap="400">
                  <SkeletonDisplayText size="small" />
                  <SkeletonBodyText lines={2} />
                </BlockStack>
              </Card>
            </BlockStack>
          </Layout.Section>
          <Layout.Section variant="oneThird">
            <Card>
              <SkeletonBodyText lines={5} />
            </Card>
          </Layout.Section>
        </Layout>
      </SkeletonPage>
    );
  }

  if (!product || !formData) {
    return (
      <Page
        title="Prodotto non trovato"
        backAction={{ content: "Prodotti", url: "/prodotti" }}
      >
        <Card>
          <BlockStack gap="400">
            <Banner tone="critical">
              <p>Il prodotto richiesto non esiste o e stato eliminato.</p>
            </Banner>
            <Button onClick={() => router.push("/prodotti")}>
              Torna ai prodotti
            </Button>
          </BlockStack>
        </Card>
      </Page>
    );
  }

  const categoryOptions = [
    { label: "Seleziona categoria", value: "" },
    ...PRODUCT_CATEGORIES.map((c) => ({ label: c.label, value: c.value })),
  ];

  const statusOptions = PRODUCT_STATUSES.map((s) => ({
    label: s.label,
    value: s.value,
  }));

  return (
    <Page
      title={product.title}
      titleMetadata={
        formData.status === "active" ? (
          <Badge tone="success">Pubblicato</Badge>
        ) : formData.status === "draft" ? (
          <Badge tone="warning">Bozza</Badge>
        ) : (
          <Badge tone="info">Archiviato</Badge>
        )
      }
      backAction={{ content: "Prodotti", url: "/prodotti" }}
      primaryAction={{
        content: "Salva",
        loading: saving,
        onAction: handleSave,
        disabled: !hasUnsavedChanges,
      }}
      secondaryActions={[
        {
          content: "Visualizza",
          icon: EyeCheckMarkIcon,
          url: `/products/${formData.seo.urlHandle}`,
          external: true,
        },
        {
          content: "Elimina",
          icon: DeleteIcon,
          destructive: true,
          onAction: () => setShowDeleteModal(true),
        },
      ]}
    >
      {hasUnsavedChanges && (
        <Box paddingBlockEnd="400">
          <Banner tone="warning">
            <p>Hai modifiche non salvate. Ricorda di salvare prima di uscire.</p>
          </Banner>
        </Box>
      )}

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
                />
                <TextField
                  label="Descrizione"
                  value={formData.description}
                  onChange={(value) => handleChange("description", value)}
                  multiline={4}
                  autoComplete="off"
                  helpText="Descrivi il tuo prodotto in modo dettagliato"
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
                          <div key={image.id} style={{ position: "relative" }}>
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
                    />
                    <TextField
                      label="Codice a barre (ISBN, UPC, GTIN, etc.)"
                      value={formData.barcode}
                      onChange={(value) => handleChange("barcode", value)}
                      autoComplete="off"
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

                {formData.trackQuantity && parseInt(formData.quantity) === 0 && (
                  <Banner tone="warning">
                    <p>Questo prodotto e esaurito. Aggiorna le scorte per renderlo disponibile.</p>
                  </Banner>
                )}

                {formData.trackQuantity && parseInt(formData.quantity) > 0 && parseInt(formData.quantity) <= 10 && (
                  <Banner tone="info">
                    <p>Scorte basse. Considera di rifornire questo prodotto.</p>
                  </Banner>
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
                <TextField
                  label="Meta titolo"
                  value={formData.seo.metaTitle}
                  onChange={(value) => handleSeoChange("metaTitle", value)}
                  autoComplete="off"
                  maxLength={70}
                  showCharacterCount
                  helpText="Titolo che appare nei risultati di ricerca"
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
                    "Il prodotto e visibile nel tuo negozio"}
                  {formData.status === "draft" &&
                    "Il prodotto non e visibile ai clienti"}
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
                />
                <TextField
                  label="Venditore"
                  value={formData.vendor}
                  onChange={(value) => handleChange("vendor", value)}
                  autoComplete="off"
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
                  Informazioni
                </Text>
                <Divider />
                <InlineStack align="space-between">
                  <Text as="span" tone="subdued">
                    ID Prodotto
                  </Text>
                  <Text as="span" variant="bodySm">
                    {product.id}
                  </Text>
                </InlineStack>
                <InlineStack align="space-between">
                  <Text as="span" tone="subdued">
                    Creato il
                  </Text>
                  <Text as="span" variant="bodySm">
                    {formatDate(product.createdAt)}
                  </Text>
                </InlineStack>
                <InlineStack align="space-between">
                  <Text as="span" tone="subdued">
                    Modificato il
                  </Text>
                  <Text as="span" variant="bodySm">
                    {formatDate(product.updatedAt)}
                  </Text>
                </InlineStack>
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
        onClose={() => setShowSuccessModal(false)}
        title="Modifiche salvate"
        primaryAction={{
          content: "Continua a modificare",
          onAction: () => setShowSuccessModal(false),
        }}
        secondaryActions={[
          {
            content: "Torna ai prodotti",
            onAction: () => {
              setShowSuccessModal(false);
              router.push("/prodotti");
            },
          },
        ]}
      >
        <Modal.Section>
          <Banner tone="success">
            <p>Le modifiche al prodotto "{formData.title}" sono state salvate con successo!</p>
          </Banner>
        </Modal.Section>
      </Modal>

      <Modal
        open={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        title="Elimina prodotto"
        primaryAction={{
          content: "Elimina",
          destructive: true,
          onAction: handleDelete,
        }}
        secondaryActions={[
          {
            content: "Annulla",
            onAction: () => setShowDeleteModal(false),
          },
        ]}
      >
        <Modal.Section>
          <BlockStack gap="400">
            <Text as="p">
              Sei sicuro di voler eliminare il prodotto "{product.title}"?
            </Text>
            <Banner tone="critical">
              <p>Questa azione non puo essere annullata. Tutte le varianti e le immagini associate verranno eliminate.</p>
            </Banner>
          </BlockStack>
        </Modal.Section>
      </Modal>
    </Page>
  );
}
