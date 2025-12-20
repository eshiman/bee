import { h, FunctionalComponent } from "preact";
import { FaGithub } from "react-icons/fa";

interface FooterProps {}

export const Footer: FunctionalComponent<FooterProps> = () => (
  <section class="js-end ce-rev-honey fld-row ai-ctr jc-spb pwx-5 pwy-4 bra-1 bwa-1">
    <section class="fld-col flg-2">
      <span>
        by{" "}
        <a
          href="https://blaylock.dev"
          label="Developer Homepage"
          class="cf-rev-honey-dark"
        >
          Brandon Blaylock
        </a>
      </span>
      <span>
        (Russian puzzles added by{" "}
        <a
          href="https://github.com/eshiman"
          label="eshiman GitHub Profile"
          class="cf-rev-honey-dark"
        >
          eshiman)
        </a>
      </span>
    </section>

    <section class="fld-row flg-4">
      <a
        href="https://github.com/baetheus/bee"
        label="Link to Source Code"
        class="cf-rev-honey-dark fs-u4 sq-px32 fld-row ai-ctr jc-ctr"
      >
        <FaGithub />
      </a>
    </section>
  </section>
);
