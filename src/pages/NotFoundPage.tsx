import { FunctionalComponent, h } from "preact";
import { Link } from "preact-router";

export interface NotFoundProps {}

export const NotFoundPage: FunctionalComponent<NotFoundProps> = () => {
  return (
    <main class="fls-1-1 fld-col flg-4 ai-ctr jc-ctr pwa-5">
      <h1>Page Not Found</h1>
      <Link class="ct-rev-honey-dark" href="/">
        Try going home..
      </Link>
    </main>
  );
};
