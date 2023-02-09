import ProductTemplate from '../ProductTemplate/ProductTemplate';

interface CarouselTemplateProps {
  html?: string;
}

export default function CarouselTemplate({ html }: CarouselTemplateProps) {
  return html ? <ProductTemplate html={html} /> : null;
}
