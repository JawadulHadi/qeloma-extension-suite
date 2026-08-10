import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { ExtensionStoreService } from '../../services/extension-store.service';
import { MatIconModule } from '@angular/material/icon';
import { PopupNightComponent } from '../popups/popup-night';
import { PopupShotComponent } from '../popups/popup-shot';
import { PopupVolumeComponent } from '../popups/popup-volume';
import { PopupFocusComponent } from '../popups/popup-focus';
import { PopupTimeboxComponent } from '../popups/popup-timebox';
import { PopupWebtimeComponent } from '../popups/popup-webtime';
import { PopupInspectComponent } from '../popups/popup-inspect';
import { PopupClipLensComponent } from '../popups/popup-clip-lens';
import { PopupReaderComponent } from '../popups/popup-reader';
import { PopupPaletteComponent } from '../popups/popup-palette';

@Component({
  selector: 'app-browser-simulator',
  standalone: true,
  imports: [
    MatIconModule,
    PopupNightComponent,
    PopupShotComponent,
    PopupVolumeComponent,
    PopupFocusComponent,
    PopupTimeboxComponent,
    PopupWebtimeComponent,
    PopupInspectComponent,
    PopupClipLensComponent,
    PopupReaderComponent,
    PopupPaletteComponent
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './browser-simulator.html'
})
export class BrowserSimulatorComponent {
  store = inject(ExtensionStoreService);

  // Computed styles for dark mode filter
  get nightFilterStyle(): string {
    const s = this.store.nightSettings();
    if (!s.enabled || s.whitelisted) return 'none';
    return `invert(${s.invert}%) contrast(${s.contrast}%) sepia(${s.sepia}%) brightness(${s.brightness}%)`;
  }

  // Handle text selection for Clip->Lens
  selectedText = '';
  onTextSelect() {
    const selection = window.getSelection();
    if (selection && selection.toString().trim()) {
      this.selectedText = selection.toString().trim();
    }
  }

  sendClipToLens() {
    if (!this.selectedText) {
      this.selectedText = this.store.activeTab().contentSnippet;
    }
    this.store.analyzeClipWithLens('summarize', this.selectedText);
  }
}
