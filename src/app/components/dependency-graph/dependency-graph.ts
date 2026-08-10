import { Component, ChangeDetectionStrategy, ElementRef, ViewChild, AfterViewInit, OnDestroy, signal, inject } from '@angular/core';
import { ExtensionStoreService } from '../../services/extension-store.service';
import { MatIconModule } from '@angular/material/icon';
import * as d3 from 'd3';

export interface GraphNode extends d3.SimulationNodeDatum {
  id: string;
  name: string;
  type: 'shared' | 'extension' | 'infra';
  description: string;
  category?: string;
  estimatedSize: string;
  imports: string[];
  dependents: string[];
  codeSnippet: string;
  color: string;
}

export interface GraphLink extends d3.SimulationLinkDatum<GraphNode> {
  source: string | GraphNode;
  target: string | GraphNode;
}

@Component({
  selector: 'app-dependency-graph',
  standalone: true,
  imports: [MatIconModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './dependency-graph.html'
})
export class DependencyGraphComponent implements AfterViewInit, OnDestroy {
  store = inject(ExtensionStoreService);

  @ViewChild('graphContainer', { static: true }) graphContainer!: ElementRef<HTMLDivElement>;
  @ViewChild('graphSvg', { static: true }) graphSvg!: ElementRef<SVGElement>;

  selectedNode = signal<GraphNode | null>(null);
  activeFilter = signal<'all' | 'shared' | 'extension' | 'infra'>('all');

  private simulation!: d3.Simulation<GraphNode, GraphLink>;
  private svgSelection!: d3.Selection<SVGElement, unknown, null, undefined>;
  private zoomBehavior!: d3.ZoomBehavior<SVGElement, unknown>;

  readonly nodes: GraphNode[] = [
    // Shared Internal Packages
    {
      id: '@qeloma/types',
      name: '@qeloma/types',
      type: 'shared',
      description: 'Shared Manifest V3 type declarations, extension contracts, and messaging bus schemas.',
      estimatedSize: '4.2 KB',
      imports: [],
      dependents: ['@qeloma/ui', '@qeloma/utils', 'clip-lens', 'focus', 'shot', 'volume', 'palette', 'timebox', 'webtime', 'reader'],
      codeSnippet: `export interface ManifestV3Config {\n  name: string;\n  version: string;\n  permissions: string[];\n}`,
      color: '#818cf8' // Indigo
    },
    {
      id: '@qeloma/ui',
      name: '@qeloma/ui',
      type: 'shared',
      description: 'Shared Tailwind CSS design tokens, popover primitives, theme toggles, and status badges.',
      estimatedSize: '18.6 KB',
      imports: ['@qeloma/types'],
      dependents: ['clip-lens', 'focus', 'shot', 'volume', 'palette', 'timebox', 'webtime', 'reader'],
      codeSnippet: `<button class="px-3 py-1.5 rounded-xl bg-indigo-600 font-bold text-white shadow">Button</button>`,
      color: '#6366f1' // Deep Indigo
    },
    {
      id: '@qeloma/utils',
      name: '@qeloma/utils',
      type: 'shared',
      description: 'Cross-browser Chrome API wrappers, activeTab query helpers, and error boundaries.',
      estimatedSize: '9.4 KB',
      imports: ['@qeloma/types'],
      dependents: ['clip-lens', 'focus', 'shot', 'volume', 'palette', 'timebox', 'webtime', 'reader'],
      codeSnippet: `export async function getActiveTab(): Promise<chrome.tabs.Tab> {\n  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });\n  return tab;\n}`,
      color: '#38bdf8' // Sky Blue
    },
    {
      id: '@qeloma/gemini',
      name: '@qeloma/gemini',
      type: 'shared',
      description: 'Server-side proxy client for Google Gemini 2.5 Flash SDK and AI prompt templates.',
      estimatedSize: '12.1 KB',
      imports: ['@qeloma/types', '@qeloma/utils'],
      dependents: ['clip-lens', 'reader'],
      codeSnippet: `import { GoogleGenAI } from '@google/genai';\nconst ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });`,
      color: '#fbbf24' // Amber
    },
    {
      id: '@qeloma/storage',
      name: '@qeloma/storage',
      type: 'shared',
      description: 'Reactive chrome.storage.local wrapper with TypeScript schema validation.',
      estimatedSize: '6.8 KB',
      imports: ['@qeloma/types'],
      dependents: ['focus', 'timebox', 'webtime'],
      codeSnippet: `export const storage = {\n  get: <T>(key: string) => chrome.storage.local.get(key),\n  set: (data: object) => chrome.storage.local.set(data)\n};`,
      color: '#34d399' // Emerald
    },

    // 10 Extensions
    {
      id: 'clip-lens',
      name: 'packages/clip-lens',
      type: 'extension',
      category: 'AI Productivity',
      description: 'AI page summary, key point extraction, and quick verdict powered by Gemini 2.5 Flash.',
      estimatedSize: '42.1 KB',
      imports: ['@qeloma/types', '@qeloma/ui', '@qeloma/utils', '@qeloma/gemini'],
      dependents: [],
      codeSnippet: `export default defineConfig({ manifest: { name: 'Qeloma Clip-Lens', permissions: ['activeTab', 'scripting', 'storage'] } });`,
      color: '#10b981' // Emerald
    },
    {
      id: 'focus',
      name: 'packages/focus',
      type: 'extension',
      category: 'Privacy & Blocking',
      description: 'Domain blocker & Pomodoro focus timer using declarativeNetRequest rulesets.',
      estimatedSize: '28.4 KB',
      imports: ['@qeloma/types', '@qeloma/ui', '@qeloma/utils', '@qeloma/storage'],
      dependents: [],
      codeSnippet: `chrome.declarativeNetRequest.updateDynamicRules({ addRules: [...] });`,
      color: '#10b981'
    },
    {
      id: 'shot',
      name: 'packages/shot',
      type: 'extension',
      category: 'Page Tools',
      description: 'Full-page and area cropping screenshot capture with canvas offscreen document.',
      estimatedSize: '34.2 KB',
      imports: ['@qeloma/types', '@qeloma/ui', '@qeloma/utils'],
      dependents: [],
      codeSnippet: `const dataUrl = await chrome.tabs.captureVisibleTab();`,
      color: '#10b981'
    },
    {
      id: 'volume',
      name: 'packages/volume',
      type: 'extension',
      category: 'Media & Audio',
      description: '600% Web Audio API GainNode volume booster and tab stream audio equalizer.',
      estimatedSize: '22.8 KB',
      imports: ['@qeloma/types', '@qeloma/ui', '@qeloma/utils'],
      dependents: [],
      codeSnippet: `const ctx = new AudioContext(); const gainNode = ctx.createGain(); gainNode.gain.value = 6;`,
      color: '#10b981'
    },
    {
      id: 'palette',
      name: 'packages/palette',
      type: 'extension',
      category: 'Appearance',
      description: 'Pixel eyedropper and page color extraction tool using native EyeDropper API.',
      estimatedSize: '19.5 KB',
      imports: ['@qeloma/types', '@qeloma/ui', '@qeloma/utils'],
      dependents: [],
      codeSnippet: `const eyedropper = new EyeDropper(); const result = await eyedropper.open();`,
      color: '#10b981'
    },
    {
      id: 'timebox',
      name: 'packages/timebox',
      type: 'extension',
      category: 'Productivity',
      description: 'Hourly visual time-blocking planner with local storage persistence.',
      estimatedSize: '21.0 KB',
      imports: ['@qeloma/types', '@qeloma/ui', '@qeloma/storage'],
      dependents: [],
      codeSnippet: `const tasks = await storage.get('timebox_tasks');`,
      color: '#10b981'
    },
    {
      id: 'webtime',
      name: 'packages/webtime',
      type: 'extension',
      category: 'Analytics',
      description: 'Zero-telemetry browsing time tracker with site duration charts.',
      estimatedSize: '25.6 KB',
      imports: ['@qeloma/types', '@qeloma/ui', '@qeloma/storage'],
      dependents: [],
      codeSnippet: `chrome.idle.onStateChanged.addListener((state) => { ... });`,
      color: '#10b981'
    },
    {
      id: 'reader',
      name: 'packages/reader',
      type: 'extension',
      category: 'Reading',
      description: 'Clutter-free article reader mode with font customization.',
      estimatedSize: '26.1 KB',
      imports: ['@qeloma/types', '@qeloma/ui', '@qeloma/gemini'],
      dependents: [],
      codeSnippet: `const cleanHtml = DOMPurify.sanitize(articleContent);`,
      color: '#10b981'
    },

    // Monorepo Infrastructure
    {
      id: 'pnpm-workspace',
      name: 'pnpm-workspace.yaml',
      type: 'infra',
      description: 'Monorepo workspace root mapping shared packages and extension apps.',
      estimatedSize: '0.8 KB',
      imports: [],
      dependents: ['@qeloma/types', '@qeloma/ui', '@qeloma/utils', '@qeloma/gemini', '@qeloma/storage', 'clip-lens', 'focus', 'shot', 'volume', 'palette', 'timebox', 'webtime', 'reader'],
      codeSnippet: `packages:\n  - 'extensions/*'\n  - 'shared/*'`,
      color: '#f43f5e' // Rose
    },
    {
      id: 'wxt-config',
      name: 'wxt.config.ts',
      type: 'infra',
      description: 'Root WXT build tool configuration and Manifest V3 compilation target.',
      estimatedSize: '1.4 KB',
      imports: [],
      dependents: ['clip-lens', 'focus', 'shot', 'volume', 'palette', 'timebox', 'webtime', 'reader'],
      codeSnippet: `import { defineConfig } from 'wxt';\nexport default defineConfig({ extensionApi: 'chrome-mv3' });`,
      color: '#f43f5e'
    }
  ];

  readonly links: GraphLink[] = [
    // Shared dependencies
    { source: '@qeloma/ui', target: '@qeloma/types' },
    { source: '@qeloma/utils', target: '@qeloma/types' },
    { source: '@qeloma/gemini', target: '@qeloma/types' },
    { source: '@qeloma/gemini', target: '@qeloma/utils' },
    { source: '@qeloma/storage', target: '@qeloma/types' },

    // Extensions to Shared
    { source: 'clip-lens', target: '@qeloma/types' },
    { source: 'clip-lens', target: '@qeloma/ui' },
    { source: 'clip-lens', target: '@qeloma/utils' },
    { source: 'clip-lens', target: '@qeloma/gemini' },

    { source: 'focus', target: '@qeloma/types' },
    { source: 'focus', target: '@qeloma/ui' },
    { source: 'focus', target: '@qeloma/utils' },
    { source: 'focus', target: '@qeloma/storage' },

    { source: 'shot', target: '@qeloma/types' },
    { source: 'shot', target: '@qeloma/ui' },
    { source: 'shot', target: '@qeloma/utils' },

    { source: 'volume', target: '@qeloma/types' },
    { source: 'volume', target: '@qeloma/ui' },
    { source: 'volume', target: '@qeloma/utils' },

    { source: 'palette', target: '@qeloma/types' },
    { source: 'palette', target: '@qeloma/ui' },
    { source: 'palette', target: '@qeloma/utils' },

    { source: 'timebox', target: '@qeloma/types' },
    { source: 'timebox', target: '@qeloma/ui' },
    { source: 'timebox', target: '@qeloma/storage' },

    { source: 'webtime', target: '@qeloma/types' },
    { source: 'webtime', target: '@qeloma/ui' },
    { source: 'webtime', target: '@qeloma/storage' },

    { source: 'reader', target: '@qeloma/types' },
    { source: 'reader', target: '@qeloma/ui' },
    { source: 'reader', target: '@qeloma/gemini' },

    // Infrastructure links
    { source: 'pnpm-workspace', target: '@qeloma/types' },
    { source: 'wxt-config', target: 'clip-lens' }
  ];

  ngAfterViewInit() {
    this.initD3Graph();
    this.selectedNode.set(this.nodes[0]);
  }

  ngOnDestroy() {
    if (this.simulation) {
      this.simulation.stop();
    }
  }

  setFilter(filter: 'all' | 'shared' | 'extension' | 'infra') {
    this.activeFilter.set(filter);
    this.applyNodeFilter();
  }

  resetZoom() {
    if (this.svgSelection && this.zoomBehavior) {
      this.svgSelection.transition().duration(750).call(this.zoomBehavior.transform, d3.zoomIdentity);
    }
  }

  private initD3Graph() {
    const container = this.graphContainer.nativeElement;
    const width = container.clientWidth || 700;
    const height = 480;

    const svgEl = this.graphSvg.nativeElement;
    this.svgSelection = d3.select(svgEl)
      .attr('width', '100%')
      .attr('height', height)
      .attr('viewBox', `0 0 ${width} ${height}`);

    this.svgSelection.selectAll('*').remove();

    // Definitions for markers (arrows)
    const defs = this.svgSelection.append('defs');
    defs.append('marker')
      .attr('id', 'arrow')
      .attr('viewBox', '0 -5 10 10')
      .attr('refX', 22)
      .attr('refY', 0)
      .attr('markerWidth', 6)
      .attr('markerHeight', 6)
      .attr('orient', 'auto')
      .append('path')
      .attr('d', 'M0,-5L10,0L0,5')
      .attr('fill', '#475569');

    // Main Zoomable Group
    const g = this.svgSelection.append('g').attr('class', 'main-group');

    // Add Zoom Behavior
    this.zoomBehavior = d3.zoom<SVGElement, unknown>()
      .scaleExtent([0.3, 3])
      .on('zoom', (event) => {
        g.attr('transform', event.transform);
      });

    this.svgSelection.call(this.zoomBehavior as unknown as (selection: d3.Selection<SVGElement, unknown, null, undefined>) => void);

    // D3 Simulation Setup
    const nodesCopy: GraphNode[] = JSON.parse(JSON.stringify(this.nodes));
    const linksCopy: GraphLink[] = JSON.parse(JSON.stringify(this.links));

    this.simulation = d3.forceSimulation<GraphNode, GraphLink>(nodesCopy)
      .force('link', d3.forceLink<GraphNode, GraphLink>(linksCopy).id(d => d.id).distance(110))
      .force('charge', d3.forceManyBody().strength(-380))
      .force('center', d3.forceCenter(width / 2, height / 2))
      .force('collide', d3.forceCollide(40));

    // Render Links
    const link = g.append('g')
      .attr('class', 'links')
      .selectAll('line')
      .data(linksCopy)
      .enter()
      .append('line')
      .attr('stroke', '#334155')
      .attr('stroke-opacity', 0.6)
      .attr('stroke-width', 1.5)
      .attr('marker-end', 'url(#arrow)');

    // Render Nodes Group
    const node = g.append('g')
      .attr('class', 'nodes')
      .selectAll<SVGGElement, GraphNode>('g')
      .data(nodesCopy)
      .enter()
      .append('g')
      .attr('class', 'node')
      .style('cursor', 'pointer')
      .call(
        d3.drag<SVGGElement, GraphNode>()
          .on('start', (event, d) => {
            if (!event.active) this.simulation.alphaTarget(0.3).restart();
            d.fx = d.x;
            d.fy = d.y;
          })
          .on('drag', (event, d) => {
            d.fx = event.x;
            d.fy = event.y;
          })
          .on('end', (event, d) => {
            if (!event.active) this.simulation.alphaTarget(0);
            d.fx = null;
            d.fy = null;
          })
      );

    // Outer Circle Glow
    node.append('circle')
      .attr('r', 18)
      .attr('fill', d => d.color)
      .attr('fill-opacity', 0.15)
      .attr('stroke', d => d.color)
      .attr('stroke-width', 2);

    // Inner Core Circle
    node.append('circle')
      .attr('r', 9)
      .attr('fill', d => d.color);

    // Label Text
    node.append('text')
      .text(d => d.name.replace('packages/', ''))
      .attr('x', 22)
      .attr('y', 4)
      .attr('fill', '#f1f5f9')
      .attr('font-size', '11px')
      .attr('font-weight', '600')
      .attr('font-family', 'monospace');

    // Click Handler
    node.on('click', (event, d) => {
      event.stopPropagation();
      const original = this.nodes.find(n => n.id === d.id);
      if (original) {
        this.selectedNode.set(original);
      }
    });

    // Hover Highlight Handler
    node.on('mouseover', (event, d) => {
      const connectedIds = new Set<string>();
      connectedIds.add(d.id);

      linksCopy.forEach(l => {
        const sourceId = typeof l.source === 'object' ? l.source.id : l.source;
        const targetId = typeof l.target === 'object' ? l.target.id : l.target;
        if (sourceId === d.id) connectedIds.add(targetId);
        if (targetId === d.id) connectedIds.add(sourceId);
      });

      node.style('opacity', n => connectedIds.has(n.id) ? 1 : 0.2);
      link.style('opacity', l => {
        const s = typeof l.source === 'object' ? l.source.id : l.source;
        const t = typeof l.target === 'object' ? l.target.id : l.target;
        return (s === d.id || t === d.id) ? 1 : 0.1;
      });
    }).on('mouseout', () => {
      node.style('opacity', 1);
      link.style('opacity', 0.6);
    });

    // Tick Handler
    this.simulation.on('tick', () => {
      link
        .attr('x1', d => (d.source as GraphNode).x!)
        .attr('y1', d => (d.source as GraphNode).y!)
        .attr('x2', d => (d.target as GraphNode).x!)
        .attr('y2', d => (d.target as GraphNode).y!);

      node.attr('transform', d => `translate(${d.x},${d.y})`);
    });
  }

  private applyNodeFilter() {
    const filter = this.activeFilter();
    if (!this.svgSelection) return;

    this.svgSelection.selectAll<SVGGElement, GraphNode>('.node').style('opacity', d => {
      if (filter === 'all') return 1;
      return d.type === filter ? 1 : 0.15;
    });
  }
}
