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
      src="https://upload.wikimedia.org/wikipedia/commons/0/05/Ethereum_logo_2014.svg"
      alt="Ethereum Logo"
      width={width}
      height={height}
    />
  );
}
