import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { ExtensionStoreService } from '../../services/extension-store.service';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-popup-reader',
  standalone: true,
  imports: [MatIconModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="bg-[#11161C] text-slate-100 p-4 w-80 rounded-2xl shadow-2xl border border-white/10 font-sans">
      <!-- Header -->
      <div class="flex items-center justify-between pb-3 border-b border-white/10 mb-3">
        <div class="flex items-center gap-2">
          <div class="w-8 h-8 rounded-lg bg-orange-500/20 text-orange-400 flex items-center justify-center">
            <mat-icon>chrome_reader_mode</mat-icon>
          </div>
          <div>
            <h3 class="font-bold text-sm text-white leading-tight">Qeloma Reader</h3>
            <span class="text-[10px] text-slate-400">v1.0.0 · Distraction-Free</span>
          </div>
        </div>
        <button 
          (click)="toggleReader()"
          [class.bg-emerald-600]="store.readerState().active"
          [class.bg-slate-700]="!store.readerState().active"
          class="px-2.5 py-1 rounded-full text-xs font-medium text-white flex items-center gap-1 cursor-pointer">
          <mat-icon class="text-sm">visibility</mat-icon>
          <span>{{ store.readerState().active ? 'Reading Mode' : 'Original Page' }}</span>
        </button>
      </div>

      <!-- Theme Controls -->
      <div class="mb-3">
        <span class="text-xs text-slate-400 font-medium block mb-1.5">Reader Theme</span>
        <div class="grid grid-cols-3 gap-2 text-xs">
          <button 
            (click)="setTheme('sepia')"
            [class.border-orange-500]="store.readerState().theme === 'sepia'"
            class="p-2 rounded-xl bg-[#2D2A26] text-amber-200 border border-white/10 font-medium text-center cursor-pointer">
            Warm Sepia
          </button>
          <button 
            (click)="setTheme('dark')"
            [class.border-orange-500]="store.readerState().theme === 'dark'"
            class="p-2 rounded-xl bg-[#11161C] text-white border border-white/10 font-medium text-center cursor-pointer">
            Deep Dark
          </button>
          <button 
            (click)="setTheme('light')"
            [class.border-orange-500]="store.readerState().theme === 'light'"
            class="p-2 rounded-xl bg-slate-100 text-slate-900 border border-white/10 font-medium text-center cursor-pointer">
            Paper Light
          </button>
        </div>
      </div>

      <!-- Typography -->
      <div class="mb-3 space-y-2 text-xs">
        <div class="flex justify-between text-slate-300">
          <span>Font Size</span>
          <span class="font-mono text-orange-400 font-bold">{{ store.readerState().fontSize }}px</span>
        </div>
        <input 
          type="range" min="14" max="28" 
          [value]="store.readerState().fontSize"
          (input)="updateFontSize($event)"
          class="w-full accent-orange-500 bg-slate-800 rounded-lg h-1.5 cursor-pointer" />
      </div>

      <button 
        (click)="exportMarkdown()"
        class="w-full py-2 bg-white/5 hover:bg-white/10 border border-white/10 text-slate-200 rounded-xl text-xs font-medium flex items-center justify-center gap-2 cursor-pointer transition-all">
        <mat-icon class="text-sm">download</mat-icon>
        <span>Export Article as Markdown</span>
      </button>
    </div>
  `
})
export class PopupReaderComponent {
  store = inject(ExtensionStoreService);

  toggleReader() {
    this.store.readerState.update(s => ({ ...s, active: !s.active }));
  }

  setTheme(theme: 'sepia' | 'dark' | 'light') {
    this.store.readerState.update(s => ({ ...s, theme }));
  }

  updateFontSize(event: Event) {
    const size = Number((event.target as HTMLInputElement).value);
    this.store.readerState.update(s => ({ ...s, fontSize: size }));
  }

  exportMarkdown() {
    alert('Bro, article converted and exported to Markdown file!');
  }
}
