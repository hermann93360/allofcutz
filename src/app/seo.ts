import { Meta } from '@angular/platform-browser';

const SITE_ORIGIN = 'https://allofcutz.paris';

export interface SeoMeta {
  title?: string;
  description?: string;
  /** Path starting with `/` (e.g. `/reservation`). Origin is added automatically. */
  path?: string;
  imageUrl?: string;
  imageAlt?: string;
}

export function applySeo(meta: Meta, doc: Document, data: SeoMeta): void {
  if (data.title) {
    meta.updateTag({ property: 'og:title', content: data.title });
    meta.updateTag({ name: 'twitter:title', content: data.title });
  }
  if (data.description) {
    meta.updateTag({ name: 'description', content: data.description });
    meta.updateTag({ property: 'og:description', content: data.description });
    meta.updateTag({ name: 'twitter:description', content: data.description });
  }
  if (data.path) {
    const url = SITE_ORIGIN + data.path;
    meta.updateTag({ property: 'og:url', content: url });
    setCanonical(doc, url);
  }
  if (data.imageUrl) {
    meta.updateTag({ property: 'og:image', content: data.imageUrl });
    meta.updateTag({ property: 'og:image:secure_url', content: data.imageUrl });
    meta.updateTag({ name: 'twitter:image', content: data.imageUrl });
    if (data.imageAlt) {
      meta.updateTag({ property: 'og:image:alt', content: data.imageAlt });
      meta.updateTag({ name: 'twitter:image:alt', content: data.imageAlt });
    }
  }
}

function setCanonical(doc: Document, url: string): void {
  let link = doc.querySelector<HTMLLinkElement>('link[rel="canonical"]');
  if (!link) {
    link = doc.createElement('link');
    link.setAttribute('rel', 'canonical');
    doc.head.appendChild(link);
  }
  link.setAttribute('href', url);
}
