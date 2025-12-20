import { h, FunctionalComponent } from "preact";
import { DefaultLayout } from "../components/Layouts";
import { useStrings } from "../stores/settings/strings";

interface HelpPageProps {}

export const HelpPage: FunctionalComponent<HelpPageProps> = () => {
  const t = useStrings();
  const aboutDescription = t("help", "aboutDescription");
  const [beforeLink, afterLink] = aboutDescription.split("Bee");

  return (
    <DefaultLayout>
      <article class="fld-col flg-6 pwa-4">
        <section class="fld-col flg-4">
          <h1 class="fs-u4">{t("help", "about")}</h1>
          <p>
            {beforeLink}
            <a href="https://bee.ignoble.dev/"> Bee</a>
            {afterLink}
          </p>
          <p>
            {t("help", "aboutEnjoy")}
          </p>
          <p>
            {t("help", "aboutLove")}
          </p>
          <p>
            {t("help", "aboutEsther")}
          </p>
        </section>

        <section class="fld-col flg-4">
          <h1 class="fs-u4">{t("help", "rules")}</h1>
          <p>
            {t("help", "rulesDescription")}
          </p>
          <ul class="fld-col flg-4 ls-dot spaced">
            <li>{t("help", "ruleMinLength")}</li>
            <li>{t("help", "ruleMiddleLetter")}</li>
            <li>{t("help", "ruleReuseLetters")}</li>
          </ul>
        </section>

        <section class="fld-col flg-4">
          <h1 class="fs-u4">{t("help", "weeklyProgression")}</h1>

          <p>
            {t("help", "weeklyProgressionDescription")}
          </p>
          <ul class="fld-col flg-4 ls-dot spaced">
            <li>{t("help", "weeklySunday")}</li>
            <li>{t("help", "weeklyMonday")}</li>
            <li>{t("help", "weeklyTuesday")}</li>
            <li>{t("help", "weeklyWednesday")}</li>
            <li>{t("help", "weeklyThursday")}</li>
            <li>{t("help", "weeklyFriday")}</li>
            <li>
              {t("help", "weeklySaturday")}
            </li>
          </ul>
        </section>
      </article>
    </DefaultLayout>
  );
};
