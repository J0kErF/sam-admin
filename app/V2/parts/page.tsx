import dynamic from "next/dynamic";

// דינמית כדי לעקוף בעיות suspense
const PartsClient = dynamic(() => import("./PartsClient"), { ssr: false });

export default function Page() {
  return <PartsClient />;
}
