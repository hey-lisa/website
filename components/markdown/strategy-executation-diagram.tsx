'use client';

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useDictionary } from '@/components/contexts/dictionary-provider';
import ReactFlow, { 
  Node, 
  Edge, 
  MarkerType,
  ReactFlowProvider,
  Handle,
  Position,
  ReactFlowInstance
} from 'reactflow';
import 'reactflow/dist/style.css';

type AnimationStep = 0 | 1 | 2 | 3 | 4 | 5 | 6;

// Custom ORACLE node - feeds data to Trading Engine
function OracleNode({ data, isConnectable }: { data: { isActive: boolean, label: string }, isConnectable: boolean }) {
  const isActive = data.isActive;
  
  return (
    <>
      <Handle
        type="source"
        position={Position.Bottom}
        id="bottom"
        isConnectable={isConnectable}
      />
      
      <div style={{
        background: 'var(--diagram-bg)',
        backdropFilter: 'blur(10px)',
        color: 'var(--diagram-text)',
        border: isActive 
          ? '2px solid var(--lisa-green)' 
          : '1px solid var(--lisa-green-subtle)',
        borderRadius: '12px',
        padding: '10px',
        fontSize: '12px',
        fontWeight: '600',
        width: '160px',
        height: '70px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        whiteSpace: 'pre-line',
        textAlign: 'center',
        opacity: isActive ? 1 : 0.7,
        boxShadow: isActive 
          ? '0 0 15px var(--lisa-green-subtle)' 
          : '0 2px 8px var(--black-transparent-05)',
        transition: 'opacity 0.3s ease, border 0.5s ease, box-shadow 0.5s ease'
      }}>
        {data.label}
      </div>
    </>
  );
}

// Custom STRATEGY node - feeds parameters to Trading Engine
function StrategyNode({ data, isConnectable }: { data: { isActive: boolean, label: string }, isConnectable: boolean }) {
  const isActive = data.isActive;
  
  return (
    <>
      <Handle
        type="target"
        position={Position.Top}
        id="top"
        isConnectable={isConnectable}
      />
      
      <Handle
        type="source"
        position={Position.Top}
        id="top"
        isConnectable={isConnectable}
      />
      
      <div style={{
        background: 'var(--diagram-bg)',
        backdropFilter: 'blur(10px)',
        color: 'var(--diagram-text)',
        border: isActive 
          ? '2px solid var(--lisa-green)' 
          : '1px solid var(--lisa-green-subtle)',
        borderRadius: '12px',
        padding: '10px',
        fontSize: '12px',
        fontWeight: '600',
        width: '160px',
        height: '70px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        whiteSpace: 'pre-line',
        textAlign: 'center',
        opacity: isActive ? 1 : 0.7,
        boxShadow: isActive 
          ? '0 0 15px var(--lisa-green-subtle)' 
          : '0 2px 8px var(--black-transparent-05)',
        transition: 'opacity 0.3s ease, border 0.5s ease, box-shadow 0.5s ease'
      }}>
        {data.label}
      </div>
    </>
  );
}

// Custom TRADING ENGINE node - Central hub with multiple handles
function TradingEngineNode({ data, isConnectable }: { data: { isProcessing: boolean, label: string }, isConnectable: boolean }) {
  const isProcessing = data.isProcessing;
  
  return (
    <>
      {/* Top handle for Oracle data */}
      <Handle
        type="target"
        position={Position.Top}
        id="top"
        isConnectable={isConnectable}
      />
      
      {/* Bottom handle for Strategy communication */}
      <Handle
        type="source"
        position={Position.Bottom}
        id="bottom-source"
        isConnectable={isConnectable}
      />
      
      <Handle
        type="target"
        position={Position.Bottom}
        id="bottom-target"
        isConnectable={isConnectable}
      />
      
      {/* Right handle for Hyperliquid output */}
      <Handle
        type="source"
        position={Position.Right}
        id="right"
        isConnectable={isConnectable}
      />
      
      <div style={{
        background: 'var(--diagram-bg)',
        backdropFilter: 'blur(10px)',
        color: 'var(--diagram-text)',
        border: isProcessing 
          ? '2px solid var(--lisa-green)' 
          : '1px solid var(--lisa-green-subtle)',
        borderRadius: '12px',
        padding: '10px',
        fontSize: '12px',
        fontWeight: '600',
        width: '160px',
        height: '70px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        whiteSpace: 'pre-line',
        textAlign: 'center',
        opacity: isProcessing ? 1 : 0.8,
        boxShadow: isProcessing 
          ? '0 0 20px var(--lisa-green-dim), 0 0 40px var(--lisa-green-subtle)' 
          : '0 2px 8px var(--black-transparent-05)',
        transition: 'opacity 0.5s ease, border 0.5s ease, box-shadow 0.5s ease'
      }}>
        {data.label}
      </div>
    </>
  );
}

// Custom HYPERLIQUID node - receives trades from Trading Engine
function HyperliquidNode({ data, isConnectable }: { data: { isActive: boolean, label: string }, isConnectable: boolean }) {
  const isActive = data.isActive;
  
  return (
    <>
      <Handle
        type="target"
        position={Position.Left}
        id="left"
        isConnectable={isConnectable}
      />
      
      <div style={{
        background: 'var(--diagram-bg)',
        backdropFilter: 'blur(10px)',
        color: 'var(--diagram-text)',
        border: isActive 
          ? '2px solid var(--lisa-green)' 
          : '1px solid var(--lisa-green-subtle)',
        borderRadius: '12px',
        padding: '10px',
        fontSize: '12px',
        fontWeight: '600',
        width: '160px',
        height: '70px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        whiteSpace: 'pre-line',
        textAlign: 'center',
        opacity: isActive ? 1 : 0.7,
        boxShadow: isActive 
          ? '0 0 15px var(--lisa-green-subtle)' 
          : '0 2px 8px var(--black-transparent-05)',
        transition: 'opacity 0.3s ease, border 0.5s ease, box-shadow 0.5s ease'
      }}>
        {data.label}
      </div>
    </>
  );
}

// Register custom node types
const nodeTypes = {
  oracleNode: OracleNode,
  strategyNode: StrategyNode,
  tradingEngineNode: TradingEngineNode,
  hyperliquidNode: HyperliquidNode,
};

export default function StrategyExecutionDiagram() {
  const dict = useDictionary();
  const [animationStep, setAnimationStep] = useState<AnimationStep>(0);
  const [reactFlowInstance, setReactFlowInstance] = useState<ReactFlowInstance | null>(null);

  // Get TRADING ENGINE's current stage
  const getTradingEngineStage = useCallback((): string => {
    switch (animationStep) {
      case 0: return dict.diagrams.strategy_execution.trading_engine;
      case 1: return dict.diagrams.strategy_execution.analyzing_data;
      case 2: return dict.diagrams.strategy_execution.requesting_strategy;
      case 3: return dict.diagrams.strategy_execution.receiving_strategy;
      case 4: return dict.diagrams.strategy_execution.decision_taking;
      case 5: return dict.diagrams.strategy_execution.placing_order;
      case 6: return dict.diagrams.strategy_execution.order_sent;
      default: return dict.diagrams.strategy_execution.trading_engine;
    }
  }, [animationStep, dict]);

  // Active states for animation
  const isOracleActive = true; // Oracle always active (continuous data feed)
  const isStrategyActive = animationStep === 3; // Strategy responds when requested
  const isTradingEngineProcessing = animationStep >= 1 && animationStep <= 6;
  const isHyperliquidActive = animationStep === 5 || animationStep === 6;

  // TWO-COLUMN layout - Left column: Oracle/Trading Engine/Strategy, Right column: Hyperliquid
  const nodes: Node[] = useMemo(() => [
    // ORACLE node (top left) - continuously feeds market data
    {
      id: 'oracle',
      type: 'oracleNode',
      position: { x: 80, y: 80 },
      data: { 
        label: dict.diagrams.strategy_execution.oracle_market_data,
        isActive: isOracleActive
      }
    },
    // TRADING ENGINE node (middle left) - main processor
    {
      id: 'trading-engine',
      type: 'tradingEngineNode',
      position: { x: 80, y: 240 },
      data: { 
        label: getTradingEngineStage(),
        isProcessing: isTradingEngineProcessing
      }
    },
    // STRATEGY node (bottom left) - responds when requested
    {
      id: 'strategy',
      type: 'strategyNode',
      position: { x: 80, y: 400 },
      data: { 
        label: dict.diagrams.strategy_execution.strategy_rules_params,
        isActive: isStrategyActive
      }
    },
    // HYPERLIQUID node (middle right) - executes trades
    {
      id: 'hyperliquid',
      type: 'hyperliquidNode',
      position: { x: 400, y: 240 },
      data: { 
        label: isHyperliquidActive && animationStep === 6 ? dict.diagrams.strategy_execution.hyperliquid_executing_trades : dict.diagrams.strategy_execution.hyperliquid_trade_execution,
        isActive: isHyperliquidActive
      }
    }
  ], [isOracleActive, isTradingEngineProcessing, isStrategyActive, isHyperliquidActive, animationStep, getTradingEngineStage]);

  // DYNAMIC edges - Trading Engine flow
  const edges: Edge[] = useMemo(() => {
    const baseEdges: Edge[] = [
    // Oracle → Trading Engine (market data flow) - ALWAYS ACTIVE
    {
      id: 'oracle-data',
      source: 'oracle',
      target: 'trading-engine',
      sourceHandle: 'bottom',
      targetHandle: 'top',
      type: 'straight',
      animated: true,
      style: { 
        stroke: 'var(--diagram-edge)', 
        strokeWidth: 2,
        strokeDasharray: '6 4',
        filter: 'drop-shadow(0 0 6px var(--lisa-green-dim))',
        transition: 'all 0.3s ease'
      },
      markerEnd: {
        type: MarkerType.ArrowClosed,
        color: 'var(--diagram-edge)'
      },
      label: dict.diagrams.strategy_execution.market_data,
      labelStyle: {
        fontSize: '10px',
        fill: 'var(--diagram-edge)',
        fontWeight: '500'
      }
    }
    ];

    // Add Trading Engine → Strategy request (step 2)
    if (animationStep === 2) {
      baseEdges.push({
        id: 'request-strategy',
        source: 'trading-engine',
        target: 'strategy',
        sourceHandle: 'bottom-source',
        targetHandle: 'top',
        type: 'straight',
        animated: true,
        style: { 
          stroke: 'var(--diagram-edge)', 
          strokeWidth: 2,
          strokeDasharray: '6 4',
          filter: 'drop-shadow(0 0 6px var(--lisa-green-dim))',
          transition: 'all 0.3s ease'
        },
        markerEnd: {
          type: MarkerType.ArrowClosed,
          color: 'var(--diagram-edge)'
        },
        label: dict.diagrams.strategy_execution.request_strategy,
        labelStyle: {
          fontSize: '10px',
          fill: 'var(--diagram-edge)',
          fontWeight: '500'
        }
      });
    }

    // Add Strategy → Trading Engine response (step 3)
    if (animationStep === 3) {
      baseEdges.push({
        id: 'strategy-response',
        source: 'strategy',
        target: 'trading-engine',
        sourceHandle: 'top',
        targetHandle: 'bottom-target',
        type: 'straight',
        animated: true,
        style: { 
          stroke: 'var(--diagram-edge)', 
          strokeWidth: 2,
          strokeDasharray: '6 4',
          filter: 'drop-shadow(0 0 6px var(--lisa-green-dim))',
          transition: 'all 0.3s ease'
        },
        markerEnd: {
          type: MarkerType.ArrowClosed,
          color: 'var(--diagram-edge)'
        },
        label: dict.diagrams.strategy_execution.strategy_rules,
        labelStyle: {
          fontSize: '10px',
          fill: 'var(--diagram-edge)',
          fontWeight: '500'
        }
      });
    }

    // Add Trading Engine → Hyperliquid (step 5)
    if (animationStep === 5) {
      baseEdges.push({
        id: 'place-order',
        source: 'trading-engine',
        target: 'hyperliquid',
        sourceHandle: 'right',
        targetHandle: 'left',
        type: 'straight',
        animated: true,
        style: { 
          stroke: 'var(--diagram-edge)', 
          strokeWidth: 2,
          strokeDasharray: '6 4',
          filter: 'drop-shadow(0 0 6px var(--lisa-green-dim))',
          transition: 'all 0.3s ease'
        },
        markerEnd: {
          type: MarkerType.ArrowClosed,
          color: 'var(--diagram-edge)'
        },
        label: dict.diagrams.strategy_execution.place_order,
        labelStyle: {
          fontSize: '10px',
          fill: 'var(--diagram-edge)',
          fontWeight: '500'
        }
      });
    }
    
    return baseEdges;
  }, [animationStep]);

  // Animation sequence for Trading Engine flow
  const animateStep = useCallback(() => {
    setAnimationStep(prev => (prev === 6 ? 0 : (prev + 1)) as AnimationStep);
  }, []);

  // Auto-play animation - faster for trading engine cycle
  useEffect(() => {
    const timing = 2000; // 2 second timing for trading flow
    
    const interval = setInterval(animateStep, timing);
    return () => clearInterval(interval);
  }, [animateStep]);

  // Handle window resize to keep diagram responsive
  useEffect(() => {
    if (!reactFlowInstance) return;

    const handleResize = () => {
      reactFlowInstance.fitView();
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [reactFlowInstance]);

  return (
    <>
      {/* CSS Animations for AGGREGATORS and HIDE HANDLES */}
      <style jsx global>{`
        @keyframes fadeIn {
          0% { 
            opacity: 0;
          }
          100% { 
            opacity: 1;
          }
        }
        
        @keyframes fadeOut {
          0% { 
            opacity: 1;
          }
          100% { 
            opacity: 0;
          }
        }
          
          @keyframes aggregatorPulse {
          0%, 100% { 
            box-shadow: 0 0 15px var(--lisa-green-subtle), 0 0 30px var(--lisa-green-glow);
            transform: scale(1);
          }
          50% { 
            box-shadow: 0 0 25px var(--lisa-green-dim), 0 0 50px var(--lisa-green-subtle);
            transform: scale(1.02);
          }
        }
        
        /* Hide all ReactFlow handles */
                  .react-flow__handle {
            opacity: 0 !important;
            visibility: hidden !important;
          }

          /* Hide ReactFlow attribution */
          .react-flow__attribution {
            display: none !important;
          }
          
          .react-flow__edge-text {
            fill: var(--diagram-edge) !important;
          }
          
          .react-flow__edge-textbg {
            fill: var(--diagram-edge-bg) !important;
            stroke: none !important;
          }

          /* Mobile responsive styles */
          @media (max-width: 768px) {
            .react-flow__edge-text {
              font-size: 8px !important;
            }
            
            .react-flow__attribution {
              display: none !important;
            }
          }

          @media (max-width: 480px) {
            .react-flow__controls {
              bottom: 10px !important;
              right: 10px !important;
            }
            
            .react-flow__edge-text {
              font-size: 7px !important;
            }
          }
      `}</style>
      
      <div style={{ 
        height: 'clamp(400px, 60vh, 600px)', 
        width: '100%', 
        position: 'relative',
        background: 'transparent',
        border: '1px solid var(--border-dark)',
        borderRadius: '12px',
        marginBottom: '20px'
      }}>
        <ReactFlowProvider>
          <ReactFlow
            nodes={nodes}
            edges={edges}
            nodeTypes={nodeTypes}
            onInit={setReactFlowInstance}
            fitView
            fitViewOptions={{ padding: 0.1, minZoom: 0.5, maxZoom: 1.2 }}
            nodesDraggable={false}
            nodesConnectable={false}
            elementsSelectable={false}
            panOnDrag={false}
            zoomOnScroll={false}
            zoomOnPinch={false}
            zoomOnDoubleClick={false}
            preventScrolling={false}
            attributionPosition="bottom-left"
            style={{ background: 'transparent' }}
            minZoom={0.3}
            maxZoom={1.5}
          >
          </ReactFlow>
        </ReactFlowProvider>
      </div>
    </>
  );
}
