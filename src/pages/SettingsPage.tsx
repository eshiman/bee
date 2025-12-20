import { h, FunctionalComponent } from "preact";
import { useCallback } from "preact/hooks";
import { identity } from "fp-ts/function";
import { MdVibration, MdLanguage } from "react-icons/md";

import { useSettingsStore, changeSettings, LanguageOptions } from "../stores/settings";
import { useStrings } from "../stores/settings/strings";
import { DefaultLayout } from "../components/Layouts";
import { Button } from "../components/Button";

export const SettingsPage: FunctionalComponent<{}> = () => {
  const [{ vibration, language}, dispatch] = useSettingsStore(identity);
  const t = useStrings();
  const handleVibration = useCallback(
    () => dispatch(changeSettings({ vibration: !vibration })),
    [vibration]
  );
  const handleLanguage = useCallback(
    () => dispatch(changeSettings({
      language: language === LanguageOptions.russian
        ? LanguageOptions.english
        : LanguageOptions.russian
    })),
    [language]
  );

  return (
    <DefaultLayout>
      <div class="fld-col flg-4">
        <Button class="fld-row flg-4" onClick={handleVibration}>
          <MdVibration />
          <span>{vibration ? t("settings", "turnOffVibration") : t("settings", "turnOnVibration")}</span>
        </Button>
        <Button class="fld-row flg-4" onClick={handleLanguage}>
          <MdLanguage />
          <span>{language}</span>
        </Button>
      </div>
    </DefaultLayout>
  );
};
