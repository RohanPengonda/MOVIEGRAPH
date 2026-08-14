import React, { useRef, useCallback, useEffect } from 'react';
import ForceGraph2D from 'react-force-graph-2d';
import type { ConnectionPathNode, ConnectionLink } from '../../types';

interface Props {
  nodes: ConnectionPathNode[];
  links: ConnectionLink[];
  onNodeClick?: (node: ConnectionPathNode) => void;
  height?: number;
}

export const InteractiveGraph: React.FC<Props> = ({
  nodes,
  links,
  onNodeClick,
  height = 420
}) => {
  const fgRef = useRef<any>(null);

  useEffect(() => {
    if (fgRef.current && nodes.length > 0) {
      setTimeout(() => {
        fgRef.current.zoomToFit(400, 50);
      }, 300);
    }
  }, [nodes, links]);

  const drawNode = useCallback((node: any, ctx: CanvasRenderingContext2D, globalScale: number) => {
    const label = node.name || node.title || '';
    const fontSize = Math.max(12 / globalScale, 3.5);
    const isActor = node.type === 'Actor';

    const radius = isActor ? 14 : 12;
    const color = isActor ? '#818cf8' : '#22d3ee';
    const glowColor = isActor ? 'rgba(129, 140, 248, 0.5)' : 'rgba(34, 211, 238, 0.5)';

    ctx.beginPath();
    ctx.arc(node.x, node.y, radius + 4, 0, 2 * Math.PI, false);
    ctx.fillStyle = glowColor;
    ctx.fill();

    ctx.beginPath();
    ctx.arc(node.x, node.y, radius, 0, 2 * Math.PI, false);
    ctx.fillStyle = color;
    ctx.fill();

    ctx.lineWidth = 2 / globalScale;
    ctx.strokeStyle = '#ffffff';
    ctx.stroke();

    if (globalScale > 0.6) {
      ctx.font = `600 ${fontSize}px Inter, sans-serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillStyle = '#f8fafc';

      const textWidth = ctx.measureText(label).width;
      const bckgDimensions = [textWidth + 8, fontSize + 4];
      ctx.fillStyle = 'rgba(15, 23, 42, 0.85)';
      ctx.fillRect(
        node.x - bckgDimensions[0] / 2,
        node.y + radius + 4,
        bckgDimensions[0],
        bckgDimensions[1]
      );

      ctx.fillStyle = '#ffffff';
      ctx.fillText(label, node.x, node.y + radius + 4 + fontSize / 2);
    }
  }, []);

  const formattedGraphData = {
    nodes: nodes.map(n => ({ ...n })),
    links: links.map(l => ({ ...l }))
  };

  return (
    <div className="dark-panel" style={{
      width: '100%',
      height: `${height}px`,
      borderRadius: 'var(--radius-md)',
      overflow: 'hidden',
      position: 'relative',
      background: 'rgba(9, 13, 22, 0.8)',
      border: '1px solid rgba(255, 255, 255, 0.1)'
    }}>
      <div style={{
        position: 'absolute',
        top: '12px',
        right: '12px',
        display: 'flex',
        gap: '12px',
        background: 'rgba(15, 23, 42, 0.8)',
        padding: '6px 12px',
        borderRadius: 'var(--radius-full)',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        zIndex: 10,
        fontSize: '11px',
        fontWeight: 600,
        color: '#ffffff'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#818cf8', display: 'inline-block' }} />
          Actor
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#22d3ee', display: 'inline-block' }} />
          Movie
        </div>
      </div>

      <ForceGraph2D
        ref={fgRef}
        graphData={formattedGraphData}
        nodeCanvasObject={drawNode}
        nodePointerAreaPaint={(node: any, color: string, ctx: CanvasRenderingContext2D) => {
          ctx.fillStyle = color;
          ctx.beginPath();
          ctx.arc(node.x, node.y, 16, 0, 2 * Math.PI, false);
          ctx.fill();
        }}
        linkColor={() => 'rgba(99, 102, 241, 0.6)'}
        linkWidth={3}
        linkDirectionalParticles={2}
        linkDirectionalParticleWidth={3}
        linkDirectionalParticleSpeed={0.006}
        onNodeClick={(node: any) => onNodeClick && onNodeClick(node as ConnectionPathNode)}
        cooldownTicks={100}
        enableNodeDrag={true}
      />
    </div>
  );
};
