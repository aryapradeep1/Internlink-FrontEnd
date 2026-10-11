export default function BrandLogo({ className = "", alt = "InternLink logo" }) {
  return (
    <img
      className={`internlink-brand-image ${className}`.trim()}
      src="/internlink-logo.png"
      alt={alt}
      draggable="false"
    />
  );
}
