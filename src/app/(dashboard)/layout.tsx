"use client";

import { useState, useCallback } from "react";
import { usePathname, useRouter } from "next/navigation";
import {
  AppProvider,
  Frame,
  Navigation,
  TopBar,
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
        ]}
      />
      <Navigation.Section
        title="Gestione"
        items={[
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
            { content: "Profilo", icon: PersonIcon },
            { content: "Impostazioni", icon: SettingsIcon },
          ],
        },
        {
          items: [{ content: "Esci", icon: ExitIcon }],
        },
      ]}
      name="Admin"
      detail="Nova Creator"
      initials="N"
      open={userMenuActive}
      onToggle={toggleUserMenu}
    />
  );

  const topBarMarkup = (
    <TopBar
      showNavigationToggle
      userMenu={userMenuMarkup}
      onNavigationToggle={handleNavigationToggle}
    />
  );

  const logo = {
    width: 124,
    topBarSource: "https://cdn.shopify.com/s/files/1/0446/6937/files/logo-shopify.svg",
    contextualSaveBarSource: "https://cdn.shopify.com/s/files/1/0446/6937/files/logo-shopify.svg",
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
