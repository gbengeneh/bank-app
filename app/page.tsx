import Script from "next/script";
import { legacyMarkupHtml } from "./legacy-markup";

export default function Home() {
  return (
    <>
      <div dangerouslySetInnerHTML={{ __html: legacyMarkupHtml }} />
      <Script src="/legacy-app.js" strategy="afterInteractive" />
    </>
  );
}
