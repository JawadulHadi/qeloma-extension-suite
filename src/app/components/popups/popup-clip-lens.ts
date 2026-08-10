import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { ExtensionStoreService } from '../../services/extension-store.service';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-popup-clip-lens',
  standalone: true,
  imports: [MatIconModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="bg-[#11161C] text-slate-100 p-4 w-80 rounded-2xl shadow-2xl border border-white/10 font-sans">
      <!-- Header -->
      <div class="flex items-center justify-between pb-3 border-b border-white/10 mb-3">
        <div class="flex items-center gap-2">
          <div class="w-8 h-8 rounded-lg bg-gradient-to-br from-[#C0532E] to-purple-600 text-white flex items-center justify-center">
            <mat-icon>auto_awesome</mat-icon>
          </div>
          <div>
            <h3 class="font-bold text-sm text-white leading-tight">Qeloma Clip → Lens</h3>
            <span class="text-[10px] text-slate-400">v1.0.0 · AI Integration</span>
          </div>
        </div>
        <span class="text-[10px] font-mono px-2 py-0.5 rounded bg-purple-500/20 text-purple-300">Gemini 2.5</span>
      </div>

      <!-- Action Choice -->
      <div class="space-y-2 mb-3">
        <span class="text-xs text-slate-300 font-medium block">Choose AI Analysis:</span>
        <button 
          (click)="analyze('summarize')"
          [disabled]="store.lensAnalyzing()"
          class="w-full p-2.5 rounded-xl bg-[#161D26] hover:bg-purple-900/40 border border-white/10 hover:border-purple-500/50 text-left flex items-center gap-2.5 cursor-pointer transition-all">
          <mat-icon class="text-purple-400 text-sm">summarize</mat-icon>
          <div>
            <div class="font-bold text-xs text-white">AI Summarize</div>
            <div class="text-[10px] text-slate-400">Extract top 3 key takeaways</div>
          </div>
        </button>

        <button 
          (click)="analyze('extract')"
          [disabled]="store.lensAnalyzing()"
          class="w-full p-2.5 rounded-xl bg-[#161D26] hover:bg-purple-900/40 border border-white/10 hover:border-purple-500/50 text-left flex items-center gap-2.5 cursor-pointer transition-all">
          <mat-icon class="text-indigo-400 text-sm">key_visualizer</mat-icon>
          <div>
            <div class="font-bold text-xs text-white">Extract Action Items</div>
            <div class="text-[10px] text-slate-400">Extract entities, links & numbers</div>
          </div>
        </button>

        <button 
          (click)="analyze('verdict')"
          [disabled]="store.lensAnalyzing()"
          class="w-full p-2.5 rounded-xl bg-[#161D26] hover:bg-purple-900/40 border border-white/10 hover:border-purple-500/50 text-left flex items-center gap-2.5 cursor-pointer transition-all">
          <mat-icon class="text-amber-400 text-sm">fact_check</mat-icon>
          <div>
            <div class="font-bold text-xs text-white">Fact Check & Verdict</div>
            <div class="text-[10px] text-slate-400">Technical credibility analysis</div>
          </div>
        </button>
      </div>

      <!-- Loading Indicator -->
      @if (store.lensAnalyzing()) {
        <div class="p-3 bg-purple-950/40 border border-purple-500/30 rounded-xl text-center text-xs text-purple-300 mb-3 flex items-center justify-center gap-2">
          <mat-icon class="animate-spin text-sm">sync</mat-icon>
          <span>QelomaLens AI processing...</span>
        </div>
      }

      <!-- Latest Result Preview -->
      @if (store.lensHistory().length > 0 && !store.lensAnalyzing()) {
        @let latest = store.lensHistory()[0];
        <div class="p-2.5 bg-[#161D26] border border-purple-500/30 rounded-xl text-xs space-y-1">
          <div class="flex justify-between text-[10px] text-purple-300 font-bold uppercase">
            <span>{{ latest.action }} Result</span>
            <span>{{ latest.timestamp }}</span>
          </div>
          <p class="text-slate-200 text-[11px] whitespace-pre-line leading-relaxed max-h-32 overflow-y-auto">
            {{ latest.summary }}
          </p>
        </div>
      }
    </div>
  `
})
export class PopupClipLensComponent {
  store = inject(ExtensionStoreService);

  analyze(action: 'summarize' | 'extract' | 'verdict') {
    this.store.analyzeClipWithLens(action, this.store.activeTab().contentSnippet);
  }
}
