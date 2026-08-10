import { Component, ChangeDetectionStrategy, signal } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { ReactiveFormsModule, FormControl } from '@angular/forms';

@Component({
  selector: 'app-social-preview-card',
  standalone: true,
  imports: [MatIconModule, ReactiveFormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './social-preview-card.html'
})
export class SocialPreviewCardComponent {
  platform = signal<'twitter' | 'linkedin'>('twitter');

  titleControl = new FormControl('Qeloma Extension Suite — 10 Production MV3 Chrome Tools');
  descriptionControl = new FormControl('Discover 10 open-source Manifest V3 Chrome extensions built with WXT, Angular 21, and Gemini 2.5 Flash AI in a high-efficiency pnpm monorepo.');
  imageUrlControl = new FormControl('https://picsum.photos/seed/qeloma-suite/1200/630');
  siteUrlControl = new FormControl('https://qeloma.dev');

  copiedMeta = signal<boolean>(false);

  setPlatform(plat: 'twitter' | 'linkedin') {
    this.platform.set(plat);
  }

  get ogTagsHtml(): string {
    return `<meta property="og:title" content="${this.titleControl.value}" />
<meta property="og:description" content="${this.descriptionControl.value}" />
<meta property="og:image" content="${this.imageUrlControl.value}" />
<meta property="og:url" content="${this.siteUrlControl.value}" />
<meta property="og:type" content="website" />
<meta name="twitter:card" content="summary_large_image" />
<meta name="twitter:title" content="${this.titleControl.value}" />
<meta name="twitter:description" content="${this.descriptionControl.value}" />
<meta name="twitter:image" content="${this.imageUrlControl.value}" />`;
  }

  copyMetaTags() {
    navigator.clipboard?.writeText(this.ogTagsHtml);
    this.copiedMeta.set(true);
    setTimeout(() => this.copiedMeta.set(false), 2000);
  }
}
