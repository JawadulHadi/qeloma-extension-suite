import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { ExtensionStoreService } from '../../services/extension-store.service';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-popup-webtime',
  standalone: true,
  imports: [MatIconModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="bg-[#11161C] text-slate-100 p-4 w-80 rounded-2xl shadow-2xl border border-white/10 font-sans">
      <!-- Header -->
      <div class="flex items-center justify-between pb-3 border-b border-white/10 mb-3">
        <div class="flex items-center gap-2">
          <div class="w-8 h-8 rounded-lg bg-indigo-500/20 text-indigo-400 flex items-center justify-center">
            <mat-icon>pie_chart</mat-icon>
          </div>
          <div>
            <h3 class="font-bold text-sm text-white leading-tight">Qeloma Webtime</h3>
            <span class="text-[10px] text-slate-400">v1.0.0 · Local Analytics</span>
          </div>
        </div>
        <span class="text-[10px] px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400">Zero Telemetry</span>
      </div>

      <!-- Total Time Today -->
      <div class="bg-[#161D26] p-3 rounded-xl border border-white/5 mb-3 flex items-center justify-between">
        <div>
          <span class="text-[10px] text-slate-400 block font-medium">Screen Time Today</span>
          <span class="text-xl font-bold font-mono text-white">3h 08m</span>
        </div>
        <div class="text-right">
          <span class="text-[10px] text-slate-400 block">Daily Limit: 2h 00m</span>
          <span class="text-xs font-bold text-amber-400">Exceeded +1h 08m</span>
        </div>
      </div>

      <!-- Domain Time Bars -->
      <div class="space-y-2 mb-3">
        <div class="text-xs text-slate-400 font-medium">Top Sites Today:</div>
        @for (site of store.webtimeState().siteBreakdown; track site.domain) {
          <div class="text-xs">
            <div class="flex justify-between text-slate-200 mb-1">
              <span class="font-mono text-[11px]">{{ site.domain }}</span>
              <span class="font-mono font-bold text-slate-400">{{ site.minutes }}m</span>
            </div>
            <div class="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
              <div 
                class="h-full rounded-full" 
                [style.width.%]="(site.minutes / 188) * 100" 
                [style.backgroundColor]="site.color"></div>
            </div>
          </div>
        }
      </div>

      <div class="text-[10px] text-slate-400 text-center flex items-center justify-center gap-1 border-t border-white/10 pt-2">
        <mat-icon class="text-xs text-emerald-400">lock</mat-icon>
        <span>Data stored exclusively in browser local storage</span>
      </div>
    </div>
  `
})
export class PopupWebtimeComponent {
  store = inject(ExtensionStoreService);
}
