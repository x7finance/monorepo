/* eslint-disable react-hooks/exhaustive-deps */
import { useCallback, useEffect, useMemo, useState } from "react";
import { useAccount } from "wagmi";

import { cn } from "@x7/css";
import { ArrowLeftIcon } from "@x7/icons";
import { Button } from "@x7/ui/button";

import { FeaturesPanel } from "./features-panel";
import { NotificationsPanel } from "./notifications-panel";
import { SettingsPanel } from "./settings-panel";

export enum SettingsMenuState {
  DEFAULT,
  NOTIFICATIONS,
  SETTINGS,
  LANGUAGE_SETTINGS,
  LOCAL_CURRENCY_SETTINGS,
  FEATURES,
}

export function DefaultSettings({
  overlayOpen,
  closeCallback,
  slide,
}: {
  overlayOpen: boolean;
  closeCallback: () => void;
  slide: string | null;
}) {
  const { address } = useAccount();
  const isAuthenticated = !!address;

  const [menu, setMenu] = useState<SettingsMenuState>(
    SettingsMenuState.DEFAULT,
  );

  const openSettings = useCallback(
    () => setMenu(SettingsMenuState.SETTINGS),
    [],
  );
  const closeSettings = useCallback(() => {
    closeCallback();
    setMenu(SettingsMenuState.DEFAULT);
  }, []);
  const openLanguageSettings = useCallback(
    () => setMenu(SettingsMenuState.LANGUAGE_SETTINGS),
    [],
  );
  const openLocalCurrencySettings = useCallback(
    () => setMenu(SettingsMenuState.LOCAL_CURRENCY_SETTINGS),
    [],
  );
  const openFeaturesSettings = useCallback(
    () => setMenu(SettingsMenuState.FEATURES),
    [],
  );

  const openNotifications = useCallback(
    () => setMenu(SettingsMenuState.NOTIFICATIONS),
    [],
  );

  useEffect(() => {
    if (overlayOpen) {
      switch (slide) {
        case "settings":
          openSettings();
          break;
        case "features":
          openFeaturesSettings();
          break;
        case "notifications":
          openNotifications();
          break;
        default:
          openSettings();
          break;
      }
    }
  }, [overlayOpen, slide]);

  useEffect(() => {
    if (!overlayOpen && menu !== SettingsMenuState.DEFAULT) {
      // wait for the drawer to close before resetting the menu
      const timer = setTimeout(() => {
        closeSettings();
      }, 250);
      return () => clearTimeout(timer);
    }
    return;
  }, [overlayOpen, menu, closeSettings]);

  const SubMenu = useMemo(() => {
    switch (menu) {
      case SettingsMenuState.DEFAULT:
        return <></>;
      case SettingsMenuState.NOTIFICATIONS:
        return <NotificationsPanel />;
      case SettingsMenuState.SETTINGS:
        return <SettingsPanel />;
      case SettingsMenuState.FEATURES:
        return <FeaturesPanel />;
    }
  }, [
    address,
    closeSettings,
    isAuthenticated,
    menu,
    openLanguageSettings,
    openLocalCurrencySettings,
    openSettings,
  ]);

  const settingsText = (() => {
    switch (menu) {
      case SettingsMenuState.DEFAULT:
        return "Settings";
      case SettingsMenuState.SETTINGS:
        return "Settings";
      case SettingsMenuState.NOTIFICATIONS:
        return "Notifications";
      case SettingsMenuState.FEATURES:
        return "Features";
      default:
        return "Settings"; // or provide a default value if needed
    }
  })();

  return (
    <div
      className={cn(
        overlayOpen ? "absolute" : "hidden",
        "bg-background top-0 right-0 z-10 h-full w-full rounded-xl",
      )}
    >
      <div className="bg-background mt-1 px-3.5 py-3">
        <div className="relative mb-5 flex w-full items-center justify-between">
          <div className="relative z-10">
            <Button
              onClick={closeSettings}
              variant={"ghost"}
              name="close-settings"
            >
              <ArrowLeftIcon className="h-4 w-4" />
            </Button>
          </div>
          <div className="font-heading relative -left-[20px] flex w-full justify-center font-medium">
            {settingsText}
          </div>
        </div>

        {SubMenu}
      </div>
    </div>
  );
}
