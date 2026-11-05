import React, { useState, useRef, useId, useCallback } from 'react';
import { useFocusScope } from '../../hooks/useFocusScope';
import { ZoomIn, ZoomOut, RotateCcw, Maximize2, Minimize2, Info } from 'lucide-react';

export interface SvgDiagramFrameProps {
  title: string;
  description?: string;
  viewBox: string;
  className?: string;
  children: React.ReactNode;
  selectedComponent?: string | null;
  onSelectComponent?: (id: string | null) => void;
  componentDetails?: Record<string, { title: string; type: string; width?: string; description: string; signals?: string[] }>;
}

export const SvgDiagramFrame: React.FC<SvgDiagramFrameProps> = ({
  title,
  description,
  viewBox,
  className = '',
  children,
  selectedComponent,
  onSelectComponent,
  componentDetails,
}) => {
  const [scale, setScale] = useState(1);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const panelId = useId().replace(/:/g, '');
  const closeFullscreen = useCallback(() => setIsFullscreen(false), []);
  useFocusScope(isFullscreen, `[data-diagram="${panelId}"]`, closeFullscreen);

  const handleZoomIn = () => setScale((prev) => Math.min(prev + 0.25, 2.5));
  const handleZoomOut = () => setScale((prev) => Math.max(prev - 0.25, 0.75));
  const handleResetZoom = () => setScale(1);

  const toggleFullscreen = () => {
    setIsFullscreen((prev) => !prev);
  };

  const activeDetails = selectedComponent && componentDetails ? componentDetails[selectedComponent] : null;

  return (
    <div
      ref={containerRef}
      data-diagram={panelId}
      role={isFullscreen ? 'dialog' : 'group'}
      aria-modal={isFullscreen || undefined}
      aria-label={title}
      className={`rounded-2xl border border-surface-border bg-surface-card overflow-hidden shadow-xl transition-all ${
        isFullscreen ? 'fixed inset-4 z-50 flex flex-col bg-surface shadow-2xl' : ''
      } ${className}`}
    >
      {/* Header bar */}
      <div className="px-5 py-3.5 border-b border-surface-border bg-surface flex flex-wrap items-center justify-between gap-3">
        <div>
          <div className="flex items-center space-x-2">
            <h3 className="text-sm font-bold text-slate-100 tracking-tight font-mono">{title}</h3>
            <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-cyber-sky/10 border border-cyber-sky/30 text-cyber-sky">
              Interactive Schematic
            </span>
          </div>
          {description && <p className="text-xs text-slate-400 mt-0.5">{description}</p>}
        </div>

        {/* Zoom and view controls */}
        <div className="flex items-center space-x-1.5">
          <div className="flex items-center bg-surface-card border border-surface-border rounded-lg p-1 text-slate-400">
            <button
              onClick={handleZoomOut}
              disabled={scale <= 0.75}
              aria-label="Zoom out diagram"
              className="p-1 hover:text-slate-200 disabled:opacity-40 transition"
              title="Zoom Out"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
            <span className="text-[10px] font-mono px-2 text-slate-300 select-none">
              {Math.round(scale * 100)}%
            </span>
            <button
              onClick={handleZoomIn}
              disabled={scale >= 2.5}
              aria-label="Zoom in diagram"
              className="p-1 hover:text-slate-200 disabled:opacity-40 transition"
              title="Zoom In"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={handleResetZoom}
              aria-label="Reset zoom to 100%"
              className="p-1 ml-1 hover:text-slate-200 border-l border-surface-border transition"
              title="Reset Zoom"
            >
              <RotateCcw className="w-3 h-3" />
            </button>
          </div>

          <button
            onClick={toggleFullscreen}
            aria-label={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
            className="p-2 rounded-lg bg-surface-card border border-surface-border text-slate-400 hover:text-slate-200 transition"
            title={isFullscreen ? 'Exit Fullscreen' : 'Expand Fullscreen'}
          >
            {isFullscreen ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {/* Main Diagram Area with scrollable canvas */}
      <div className={`relative overflow-auto bg-void p-6 ${isFullscreen ? 'flex-1' : 'min-h-[380px]'}`}>
        <div
          style={{ width: `${scale * 100}%`, minWidth: `${640 * scale}px` }}
          className="flex items-center justify-center"
        >
          <svg
            viewBox={viewBox}
            className="w-full h-auto select-none"
            role="group"
            aria-label={title}
          >
            {children}
          </svg>
        </div>
      </div>

      {/* Interactive Node Inspector Drawer / Footer */}
      {activeDetails ? (
        <div className="px-5 py-3 border-t border-surface-border bg-surface-elevated/70 flex items-start justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <span className="w-2 h-2 rounded-full bg-cyber-amber animate-pulse" />
              <span className="text-xs font-mono font-bold text-slate-100">{activeDetails.title}</span>
              <span className="px-1.5 py-0.5 rounded text-[10px] font-mono bg-cyber-purple/20 text-cyber-purple border border-cyber-purple/30">
                {activeDetails.type}
              </span>
              {activeDetails.width && (
                <span className="px-1.5 py-0.5 rounded text-[10px] font-mono bg-cyber-sky/20 text-cyber-sky border border-cyber-sky/30">
                  {activeDetails.width}
                </span>
              )}
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">{activeDetails.description}</p>
            {activeDetails.signals && activeDetails.signals.length > 0 && (
              <div className="flex items-center space-x-1.5 pt-1">
                <span className="text-[10px] font-mono text-slate-400">Signals:</span>
                {activeDetails.signals.map((sig) => (
                  <span key={sig} className="px-1.5 py-0.2 rounded text-[9px] font-mono bg-surface border border-surface-border text-slate-300">
                    {sig}
                  </span>
                ))}
              </div>
            )}
          </div>
          {onSelectComponent && (
            <button
              onClick={() => onSelectComponent(null)}
              className="text-xs font-mono text-slate-400 hover:text-slate-200 px-2 py-1 rounded bg-surface border border-surface-border shrink-0"
            >
              Clear Inspector
            </button>
          )}
        </div>
      ) : (
        <div className="px-5 py-2 border-t border-surface-border bg-surface text-[11px] font-mono text-slate-400 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Info className="w-3.5 h-3.5 text-cyber-sky" />
            <span>Click any hardware component to inspect internal registers, signals, and bitwidths.</span>
          </div>
          <span>Status: Interactive Ready</span>
        </div>
      )}
    </div>
  );
};
