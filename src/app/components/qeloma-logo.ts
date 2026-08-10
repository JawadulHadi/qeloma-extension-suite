import { Component, ChangeDetectionStrategy, input } from '@angular/core';

@Component({
  selector: 'app-qeloma-logo',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="inline-flex items-center gap-2.5 font-sans select-none">
      <!-- Unique Geometric Qeloma Emblem -->
      <div 
        [class.w-7]="size() === 'sm'"
        [class.h-7]="size() === 'sm'"
        [class.w-9]="size() === 'md'"
        [class.h-9]="size() === 'md'"
        [class.w-12]="size() === 'lg'"
        [class.h-12]="size() === 'lg'"
        [class.w-16]="size() === 'xl'"
        [class.h-16]="size() === 'xl'"
        class="relative flex-shrink-0 rounded-xl bg-gradient-to-br from-indigo-500 via-indigo-600 to-emerald-500 p-[1.5px] shadow-md group">
        
        <div class="w-full h-full bg-[#0f172a] rounded-[10.5px] flex items-center justify-center relative overflow-hidden">
          <!-- Ambient Glow Effect -->
          <div class="absolute -inset-1 bg-gradient-to-r from-indigo-500 to-emerald-500 opacity-20 blur-sm group-hover:opacity-40 transition-opacity"></div>
          
          <!-- Custom Vector Q Emblem with Interlocking Extension Puzzle Notch -->
          <svg 
            viewBox="0 0 32 32" 
            fill="none" 
            xmlns="http://www.w3.org/2000/svg"
            [class.animate-pulse]="animated()"
            class="w-3/4 h-3/4 relative z-10 text-white">
            <!-- Q Ring Outer Contour -->
            <path 
              d="M16 4C9.37258 4 4 9.37258 4 16C4 22.6274 9.37258 28 16 28C18.6836 28 21.1561 27.1206 23.1507 25.6364L25.2929 27.7786C25.6834 28.1691 26.3166 28.1691 26.7071 27.7786C27.0976 27.3881 27.0976 26.7549 26.7071 26.3644L24.5649 24.2222C26.0491 22.2276 26.9286 19.7551 26.9286 17.0714C26.9286 16.5191 26.4808 16.0714 25.9286 16.0714C25.3763 16.0714 24.9286 16.5191 24.9286 17.0714C24.9286 21.4939 21.3511 25.0714 16.9286 25.0714C12.5061 25.0714 8.92857 21.4939 8.92857 17.0714C8.92857 12.6489 12.5061 9.07143 16.9286 9.07143C18.8911 9.07143 20.6865 9.77585 22.0833 10.9472C22.4975 11.2946 23.1118 11.242 23.4592 10.8278C23.8066 10.4136 23.754 9.79933 23.3398 9.45195C21.6163 8.00652 19.3801 7.07143 16.9286 7.07143C11.9972 7.07143 8 11.0686 8 16" 
              fill="url(#qeloma-grad)" />
            <!-- Extension Connector Node -->
            <rect x="18" y="5" width="8" height="8" rx="2.5" fill="#10B981" />
            <circle cx="22" cy="9" r="1.5" fill="#0F172A" />
            <path d="M19 19L26 26" stroke="#818CF8" stroke-width="2.5" stroke-linecap="round" />
            
            <defs>
              <linearGradient id="qeloma-grad" x1="4" y1="4" x2="28" y2="28" gradientUnits="userSpaceOnUse">
                <stop stop-color="#818CF8" />
                <stop offset="0.5" stop-color="#6366F1" />
                <stop offset="1" stop-color="#10B981" />
              </linearGradient>
            </defs>
          </svg>
        </div>
      </div>

      <!-- Text Brand Mark -->
      @if (showText()) {
        <div class="flex flex-col leading-none">
          <div class="flex items-center gap-1.5">
            <span 
              [class.text-base]="size() === 'sm'"
              [class.text-lg]="size() === 'md'"
              [class.text-2xl]="size() === 'lg'"
              [class.text-3xl]="size() === 'xl'"
              class="font-black tracking-wider text-white uppercase font-mono">
              QELOMA
            </span>
            <span class="text-[10px] font-bold px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 uppercase tracking-widest">
              Suite
            </span>
          </div>
          @if (subtitle()) {
            <span class="text-[10px] text-slate-400 font-medium tracking-normal mt-0.5">
              {{ subtitle() }}
            </span>
          }
        </div>
      }
    </div>
  `
})
export class QelomaLogoComponent {
  size = input<'sm' | 'md' | 'lg' | 'xl'>('md');
  showText = input<boolean>(true);
  animated = input<boolean>(false);
  subtitle = input<string>('');
}
