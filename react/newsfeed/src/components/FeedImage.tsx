import type { Media } from "../types";

export function FeedImage({ media, isFirst }: { media: Media; isFirst: boolean }) {
  const { src, previewSrc, alt, width, height } = media;

  return (
    <img
      src={src}
      alt={alt}
      width={width}
      height={height}
      loading={isFirst ? "eager" : "lazy"}
      decoding="async"
      style={{
        maxWidth: "100%",
        height: "auto",
        aspectRatio: `${width} / ${height}`,
        backgroundImage: previewSrc ? `url(${previewSrc})` : undefined,
        backgroundSize: "cover",
      }}
    />
  );
}