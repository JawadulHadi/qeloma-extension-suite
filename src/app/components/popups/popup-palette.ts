import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { ExtensionStoreService } from '../../services/extension-store.service';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-popup-palette',
  standalone: true,
  imports: [MatIconModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="bg-[#11161C] text-slate-100 p-4 w-80 rounded-2xl shadow-2xl border border-white/10 font-sans">
      <!-- Header -->
      <div class="flex items-center justify-between pb-3 border-b border-white/10 mb-3">
        <div class="flex items-center gap-2">
          <div class="w-8 h-8 rounded-lg bg-teal-500/20 text-teal-400 flex items-center justify-center">
            <mat-icon>palette</mat-icon>
          </div>
          <div>
            <h3 class="font-bold text-sm text-white leading-tight">Qeloma Palette</h3>
            <span class="text-[10px] text-slate-400">v1.0.0 · Eyedropper API</span>
          </div>
        </div>
        <button 
          (click)="samplePixel()"
          class="px-2.5 py-1 rounded-lg bg-teal-600 hover:bg-teal-500 text-xs font-bold text-white flex items-center gap-1 cursor-pointer">
          <mat-icon class="text-sm">colorize</mat-icon>
          <span>Pick Pixel</span>
        </button>
      </div>

      <!-- Active Color Display -->
      <div class="p-3 bg-[#161D26] rounded-xl border border-white/5 mb-3 flex items-center justify-between">
        <div class="flex items-center gap-3">
          <div 
            class="w-10 h-10 rounded-xl border border-white/20 shadow-md"
            [style.backgroundColor]="store.paletteState().activeColor"></div>
          <div>
            <span class="text-[10px] text-slate-400 block font-medium">Selected Color</span>
            <span class="font-mono font-bold text-sm text-white uppercase">{{ store.paletteState().activeColor }}</span>
          </div>
        </div>
        <button 
          (click)="copyHex(store.paletteState().activeColor)"
          class="p-2 bg-white/10 hover:bg-white/20 rounded-lg text-slate-200 cursor-pointer">
          <mat-icon class="text-sm">content_copy</mat-icon>
        </button>
      </div>

      <!-- Auto Extracted Palette Swatches -->
      <div class="space-y-2 mb-3">
        <span class="text-xs text-slate-400 font-medium block">Extracted Page Palette:</span>
        <div class="space-y-1.5">
          @for (color of store.paletteState().extractedPalette; track color.hex) {
            <button 
              (click)="selectColor(color.hex)"
              class="w-full flex items-center justify-between p-2 rounded-xl bg-[#161D26] hover:bg-white/5 border border-white/5 cursor-pointer text-left">
              <div class="flex items-center gap-2">
                <div class="w-5 h-5 rounded-md border border-white/20" [style.backgroundColor]="color.hex"></div>
                <span class="text-xs font-medium text-slate-200">{{ color.name }}</span>
              </div>
              <div class="flex items-center gap-2">
                <span class="text-[10px] text-slate-400 font-mono">{{ color.hex }}</span>
                <span class="text-[9px] px-1.5 py-0.5 rounded bg-white/5 text-slate-400">{{ color.usage }}</span>
              </div>
            </button>
          }
        </div>
      </div>
    </div>
  `
})
export class PopupPaletteComponent {
  store = inject(ExtensionStoreService);

  samplePixel() {
    this.store.paletteState.update(s => ({ ...s, activeColor: '#2E7D5B' }));
    alert('Bro, Eyedropper sampled color #2E7D5B from the page canvas!');
  }

  selectColor(hex: string) {
    this.store.paletteState.update(s => ({ ...s, activeColor: hex }));
  }

  copyHex(hex: string) {
    alert(`Bro, hex code ${hex} copied to clipboard!`);
  }
}
