interface HyperlinkProps {
  url: string;
  children: React.ReactNode;
  anchorClass?: string;
  rel?: string;
  target?: string;
}

export function Hyperlink({ url, children, anchorClass, rel, target }: HyperlinkProps) {
  return (
    <a 
      href={url}
      className={`text-blue hover:text-blue ${anchorClass || ''}`}
      rel={rel}
      target={target}
    >
      {children}
    </a>
  );
}
