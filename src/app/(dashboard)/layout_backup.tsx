"use client";

import { useState, useCallback } from "react";
import { usePathname, useRouter } from "next/navigation";
import {
  AppProvider,
  Frame,
  Navigation,
  TopBar,
  Icon,
  Text,
  ActionList,
  Popover,
} from "@shopify/polaris";
import {
  HomeIcon,
  OrderIcon,
  DiscountIcon,
  CashDollarIcon,
  PersonIcon,
  StoreIcon,
  SettingsIcon,
  ExitIcon,
  NotificationIcon,
  QuestionCircleIcon,
  ProductIcon,
  CollectionIcon,
  ChartVerticalIcon,
  FileIcon,
} from "@shopify/polaris-icons";
import "@shopify/polaris/build/esm/styles.css";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileNavigationActive, setMobileNavigationActive] = useState(false);
  const [userMenuActive, setUserMenuActive] = useState(false);
  const [searchActive, setSearchActive] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [notificationsActive, setNotificationsActive] = useState(false);

  const toggleMobileNavigation = useCallback(
    () => setMobileNavigationActive((active) => !active),
    []
  );

  const toggleUserMenu = useCallback(
    () => setUserMenuActive((active) => !active),
    []
  );

  const handleNavigationToggle = useCallback(() => {
    setMobileNavigationActive((active) => !active);
  }, []);

  const handleSearchChange = useCallback((value: string) => {
    setSearchValue(value);
    setSearchActive(value.length > 0);
  }, []);

  const handleSearchResultsDismiss = useCallback(() => {
    setSearchActive(false);
    setSearchValue("");
  }, []);

  const navigationMarkup = (
    <Navigation location={pathname}>
      <Navigation.Section
        title="Dashboard"
        items={[
          {
            label: "Home",
            icon: HomeIcon,
            selected: pathname === "/dashboard",
            onClick: () => router.push("/dashboard"),
          },
          {
            label: "Ordini",
            icon: OrderIcon,
            selected: pathname === "/ordini",
            onClick: () => router.push("/ordini"),
          },
          {
            label: "Prodotti",
            icon: ProductIcon,
            selected: pathname === "/prodotti" || pathname.startsWith("/prodotti/"),
            onClick: () => router.push("/prodotti"),
          },
        ]}
      />
      <Navigation.Section
        title="Analytics"
        items={[
          {
            label: "Panoramica",
            icon: ChartVerticalIcon,
            selected: pathname === "/analytics",
            onClick: () => router.push("/analytics"),
          },
          {
            label: "Vendite",
            icon: CashDollarIcon,
            selected: pathname === "/analytics/vendite",
            onClick: () => router.push("/analytics/vendite"),
          },
          {
            label: "Clienti",
            icon: PersonIcon,
            selected: pathname === "/analytics/clienti",
            onClick: () => router.push("/analytics/clienti"),
          },
          {
            label: "Report",
            icon: FileIcon,
            selected: pathname === "/analytics/report",
            onClick: () => router.push("/analytics/report"),
          },
        ]}
      />
      <Navigation.Section
        title="Gestione"
        items={[
          {
            label: "Collezioni",
            icon: CollectionIcon,
            selected: pathname === "/collezioni" || pathname.startsWith("/collezioni/"),
            onClick: () => router.push("/collezioni"),
          },
          {
            label: "Sconti",
            icon: DiscountIcon,
            selected: pathname === "/sconti" || pathname.startsWith("/sconti/"),
            onClick: () => router.push("/sconti"),
          },
          {
            label: "Finanze",
            icon: CashDollarIcon,
            selected: pathname === "/finanze",
            onClick: () => router.push("/finanze"),
          },
          {
            label: "Clienti",
            icon: PersonIcon,
            selected: pathname === "/users",
            onClick: () => router.push("/users"),
          },
        ]}
      />
      <Navigation.Section
        title="Canali"
        items={[
          {
            label: "Negozio online",
            icon: StoreIcon,
            selected: pathname === "/negozio",
            onClick: () => router.push("/negozio"),
          },
        ]}
      />
      <Navigation.Section
        title="Impostazioni"
        items={[
          {
            label: "Impostazioni",
            icon: SettingsIcon,
            selected: pathname === "/settings",
            onClick: () => router.push("/settings"),
          },
        ]}
        separator
      />
    </Navigation>
  );

  const userMenuMarkup = (
    <TopBar.UserMenu
      actions={[
        {
          items: [
            { content: "Profilo", icon: PersonIcon, onAction: () => router.push("/settings") },
            { content: "Impostazioni", icon: SettingsIcon, onAction: () => router.push("/settings") },
          ],
        },
        {
          items: [{ content: "Esci", icon: ExitIcon, onAction: () => console.log("Logout") }],
        },
      ]}
      name="Admin"
      detail="Nova Creator"
      initials="N"
      open={userMenuActive}
      onToggle={toggleUserMenu}
    />
  );

  const searchResultsMarkup = (
    <ActionList
      items={[
        { content: "Cerca ordini...", icon: OrderIcon, onAction: () => router.push("/ordini") },
        { content: "Cerca prodotti...", icon: ProductIcon, onAction: () => router.push("/prodotti") },
        { content: "Cerca collezioni...", icon: CollectionIcon, onAction: () => router.push("/collezioni") },
        { content: "Cerca clienti...", icon: PersonIcon, onAction: () => router.push("/users") },
        { content: "Cerca sconti...", icon: DiscountIcon, onAction: () => router.push("/sconti") },
        { content: "Analytics...", icon: ChartVerticalIcon, onAction: () => router.push("/analytics") },
      ]}
    />
  );

  const searchFieldMarkup = (
    <TopBar.SearchField
      onChange={handleSearchChange}
      value={searchValue}
      placeholder="Cerca"
    />
  );

  const secondaryMenuMarkup = (
    <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
      <Popover
        active={notificationsActive}
        activator={
          <div
            onClick={() => setNotificationsActive(!notificationsActive)}
            style={{
              padding: "8px",
              cursor: "pointer",
              borderRadius: "8px",
              display: "flex",
              alignItems: "center",
            }}
          >
            <Icon source={NotificationIcon} tone="base" />
          </div>
        }
        onClose={() => setNotificationsActive(false)}
        preferredAlignment="right"
      >
        <div style={{ padding: "16px", minWidth: "280px" }}>
          <Text as="h3" variant="headingMd">Notifiche</Text>
          <div style={{ marginTop: "12px", color: "#637381" }}>
            <Text as="p" variant="bodySm" tone="subdued">Nessuna nuova notifica</Text>
          </div>
        </div>
      </Popover>
      <div
        onClick={() => window.open("https://help.shopify.com", "_blank")}
        style={{
          padding: "8px",
          cursor: "pointer",
          borderRadius: "8px",
          display: "flex",
          alignItems: "center",
        }}
      >
        <Icon source={QuestionCircleIcon} tone="base" />
      </div>
    </div>
  );

  const topBarMarkup = (
    <TopBar
      showNavigationToggle
      userMenu={userMenuMarkup}
      searchField={searchFieldMarkup}
      searchResultsVisible={searchActive}
      searchResults={searchResultsMarkup}
      onSearchResultsDismiss={handleSearchResultsDismiss}
      onNavigationToggle={handleNavigationToggle}
      secondaryMenu={secondaryMenuMarkup}
    />
  );

  const logo = {
    width: 110,
    topBarSource: "/nova-logo.svg",
    contextualSaveBarSource: "/nova-logo.svg",
    url: "/dashboard",
    accessibilityLabel: "Nova Dashboard",
  };

  return (
    <AppProvider i18n={{}}>
      <Frame
        logo={logo}
        topBar={topBarMarkup}
        navigation={navigationMarkup}
        showMobileNavigation={mobileNavigationActive}
        onNavigationDismiss={toggleMobileNavigation}
      >
        {children}
      </Frame>
    </AppProvider>
  );
}
