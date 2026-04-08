import { cn } from "@/lib/utils";
type BrandLogoProps = {
  className?: string;
  alt?: string;
  rounded?: boolean;
};
const BrandLogo = ({ className = "", alt = "DogYard Logo", rounded = false }: BrandLogoProps) => {
  return (
    <img
      src="/logo.png"
      alt={alt}
      className={cn("object-contain", rounded && "rounded-full", className)}
      onError={(event) => {
        const target = event.currentTarget;
        target.style.display = "none";
      }}
    />
  );
};
export default BrandLogo;
