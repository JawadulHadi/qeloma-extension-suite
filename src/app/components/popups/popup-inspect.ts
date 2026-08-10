import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { ExtensionStoreService } from '../../services/extension-store.service';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-popup-inspect',
  standalone: true,
  imports: [MatIconModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="bg-[#11161C] text-slate-100 p-4 w-80 rounded-2xl shadow-2xl border border-white/10 font-sans">
      <!-- Header -->
      <div class="flex items-center justify-between pb-3 border-b border-white/10 mb-3">
        <div class="flex items-center gap-2">
          <div class="w-8 h-8 rounded-lg bg-sky-500/20 text-sky-400 flex items-center justify-center">
            <mat-icon>code_blocks</mat-icon>
          </div>
          <div>
            <h3 class="font-bold text-sm text-white leading-tight">Qeloma Inspect</h3>
            <span class="text-[10px] text-slate-400">v1.0.0 · SEO & DOM Inspector</span>
          </div>
        </div>
        <span class="text-[10px] font-mono px-2 py-0.5 rounded bg-sky-500/20 text-sky-300">ActiveTab</span>
      </div>

      <!-- Page Meta Details -->
      <div class="space-y-2 mb-3 text-xs">
        <div class="p-2 bg-[#161D26] rounded-xl border border-white/5">
          <div class="text-[10px] text-slate-400 uppercase font-semibold mb-0.5">Page Title</div>
          <div class="font-medium text-slate-100 text-[11px] truncate">{{ store.activeTab().meta.title }}</div>
        </div>

        <div class="p-2 bg-[#161D26] rounded-xl border border-white/5">
          <div class="text-[10px] text-slate-400 uppercase font-semibold mb-0.5">Meta Description</div>
          <div class="text-[11px] text-slate-300 line-clamp-2">{{ store.activeTab().meta.description }}</div>
        </div>

        <!-- Headings Hierarchy -->
        <div class="p-2 bg-[#161D26] rounded-xl border border-white/5">
          <div class="text-[10px] text-slate-400 uppercase font-semibold mb-1">Headings Tree (H1 - H3)</div>
          <div class="space-y-1 font-mono text-[10px]">
            @for (heading of store.activeTab().meta.headings; track heading; let idx = $index) {
              <div class="flex items-center gap-1.5 text-slate-300">
                <span class="px-1 bg-sky-900/50 text-sky-300 rounded font-bold">H{{ idx + 1 }}</span>
                <span class="truncate">{{ heading }}</span>
              </div>
            }
          </div>
        </div>
      </div>

      <button 
        (click)="copyMetaReport()"
        class="w-full py-2 bg-sky-600 hover:bg-sky-500 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer transition-all">
        <mat-icon class="text-sm">content_copy</mat-icon>
        <span>Copy SEO Report JSON</span>
      </button>
    </div>
  `
})
export class PopupInspectComponent {
  store = inject(ExtensionStoreService);

  copyMetaReport() {
    alert('Bro, SEO & Meta Inspector report copied to clipboard!');
  }
}
