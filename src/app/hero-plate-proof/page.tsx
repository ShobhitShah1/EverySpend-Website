import Image from "next/image";
import { assetUrl } from "@/lib/site";

export default function HeroPlateProofPage() {
  return (
    <>
      <style>{`html, body { background: #f8f7f2 !important; }`}</style>
      <main
        style={{
          position: "relative",
          width: "100vw",
          height: "100vh",
          overflow: "hidden",
          backgroundColor: "#f8f7f2",
        }}
      >
        <Image
          src={assetUrl("/assets/plates/page-ground.png")}
          alt=""
          aria-hidden="true"
          width={72}
          height={62}
          priority
          style={{
            position: "absolute",
            left: "0.35%",
            top: "12.22%",
            width: "5%",
            height: "6.89%",
            objectFit: "cover",
          }}
        />
      </main>
    </>
  );
}
