import type { ImgHTMLAttributes } from "react";

const DEFAULT_WIDTHS = [240, 360, 576] as const;
const OPTIMIZABLE_LOCAL_IMAGE = /\.(jpe?g|png)$/i;
const OPTIMIZED_SCREENSHOT_PATH = /^\/screenshots\/app\//;

type ResponsiveImageProps = Omit<ImgHTMLAttributes<HTMLImageElement>, "alt" | "sizes" | "src" | "srcSet"> & {
  alt: string;
  sizes: string;
  src: string;
  widths?: readonly number[];
};

function webpSrcSet(src: string, widths: readonly number[]) {
  if (!OPTIMIZED_SCREENSHOT_PATH.test(src) || !OPTIMIZABLE_LOCAL_IMAGE.test(src)) return "";

  return widths
    .map((width) => `${src.replace(OPTIMIZABLE_LOCAL_IMAGE, `-${width}.webp`)} ${width}w`)
    .join(", ");
}

export function ResponsiveImage({
  alt,
  sizes,
  src,
  widths = DEFAULT_WIDTHS,
  ...props
}: ResponsiveImageProps) {
  const srcSet = webpSrcSet(src, widths);

  if (!srcSet) {
    return <img {...props} src={src} alt={alt} sizes={sizes} />;
  }

  return (
    <picture>
      <source type="image/webp" srcSet={srcSet} sizes={sizes} />
      <img {...props} src={src} alt={alt} sizes={sizes} />
    </picture>
  );
}
