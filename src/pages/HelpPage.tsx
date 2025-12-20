import { h, FunctionalComponent } from "preact";
import { DefaultLayout } from "../components/Layouts";

interface HelpPageProps {}

export const HelpPage: FunctionalComponent<HelpPageProps> = () => (
  <DefaultLayout>
    <article class="fld-col flg-6 pwa-4">
      <section class="fld-col flg-4">
        <h1 class="fs-u4">About</h1>
        <p>
          This site is pretty much a copy of Brandon Blaylock's lovely
          <a href="https://bee.ignoble.dev/"> Bee</a> game, except
          translated to Russian. The original site is in English.

          The goal is to make a game for my grandmother to play.

        </p>
        <p>
          Please enjoy, Babushka Polina!
        </p>
        <p>
          Love,
        </p>
        <p>
          Esther
        </p>
      </section>

      <section class="fld-col flg-4">
        <h1 class="fs-u4">Rules</h1>
        <p>
          The goal of the puzzle is to find all of the words that can be
          created with the given seven letters. There are only a few notes:
        </p>
        <ul class="fld-col flg-4 ls-dot spaced">
          <li>Words must be 4 letters or longer.</li>
          <li>Words must contain the middle letter.</li>
          <li>Letters can be used more than once.</li>
        </ul>
      </section>

      <section class="fld-col flg-4">
        <h1 class="fs-u4">Weekly Progression</h1>

        <p>
          The puzzlies change throughout the week in size and letter choices.
        </p>
        <ul class="fld-col flg-4 ls-dot spaced">
          <li>Sunday's puzzles will have fewer than 21 words.</li>
          <li>Monday's puzzles will have 21 to 30 words.</li>
          <li>Tuesday's puzzles will have 31 to 40 words.</li>
          <li>Wednesday's puzzles will have 41 to 50 words.</li>
          <li>Thursday's puzzles will have 51 to 60 words.</li>
          <li>Friday's puzzles will have than more 70 words.</li>
          <li>
            Saturday's puzzles will have more than 70 words and will exclude
            the letters "т" and "л".
          </li>
        </ul>
      </section>
    </article>
  </DefaultLayout>
);
