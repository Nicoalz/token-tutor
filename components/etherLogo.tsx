import Image from "next/image";

export function EtherLogo({
  width,
  height,
}: {
  width: number;
  height: number;
}) {
  return (
    <Image
      src="/eth.png"
      className="object-contain"
      alt="Ethereum Logo"
      width={width}
      height={height}
    />
  );
}
