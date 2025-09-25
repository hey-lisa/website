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

type AnimationStep = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10;

// Custom USER node - TOP/BOTTOM HANDLES ONLY
function UserNode({ data, isConnectable }: { data: { isUserActive: boolean, label: string }, isConnectable: boolean }) {
  const isUserActive = data.isUserActive;
  
  return (
    <>
      {/* Top handle for LISA connection */}
      <Handle
        type="source"
        position={Position.Top}
        id="top-lisa"
        isConnectable={isConnectable}
      />
      
      {/* OUTER bottom handle for SMART CONTRACTS connection (LEFT side) */}
      <Handle
        type="target"
        position={Position.Bottom}
        id="bottom-outer"
        isConnectable={isConnectable}
        style={{ left: '35%' }}
      />
      
      <Handle
        type="source"
        position={Position.Bottom}
        id="bottom-outer"
        isConnectable={isConnectable}
        style={{ left: '35%' }}
      />
      
      {/* INNER bottom handle for LISA connection (RIGHT side - closer to LISA) */}
      <Handle
        type="source"
        position={Position.Bottom}
        id="bottom-inner"
        isConnectable={isConnectable}
        style={{ left: '65%' }}
      />
      
      <Handle
        type="target"
        position={Position.Bottom}
        id="bottom-inner"
        isConnectable={isConnectable}
        style={{ left: '65%' }}
      />
      
      <div style={{
        background: 'var(--diagram-bg)',
        backdropFilter: 'blur(10px)',
        color: 'var(--diagram-text)',
        border: isUserActive 
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
        opacity: isUserActive ? 1 : 0.7,
        boxShadow: isUserActive 
          ? '0 0 15px var(--lisa-green-subtle)' 
          : '0 2px 8px rgba(0, 0, 0, 0.05)',
        transition: 'opacity 0.3s ease, border 0.5s ease, box-shadow 0.5s ease'
      }}>
        {data.label}
      </div>
    </>
  );
}

// Custom LISA node - TOP/BOTTOM HANDLES ONLY
function LisaNode({ data, isConnectable }: { data: { isProcessing: boolean, label: string }, isConnectable: boolean }) {
  const isProcessing = data.isProcessing;
  
  return (
    <>
      {/* Top handle for USER input */}
      <Handle
        type="target"
        position={Position.Top}
        id="top-user"
        isConnectable={isConnectable}
      />
      
      {/* INNER bottom handle for USER connection (LEFT side - closer to USER) */}
      <Handle
        type="source"
        position={Position.Bottom}
        id="bottom-inner"
        isConnectable={isConnectable}
        style={{ left: '35%' }}
      />
      
      <Handle
        type="target"
        position={Position.Bottom}
        id="bottom-inner"
        isConnectable={isConnectable}
        style={{ left: '35%' }}
      />
      
      {/* OUTER bottom handle for AGGREGATORS connection (RIGHT side) */}
      <Handle
        type="source"
        position={Position.Bottom}
        id="bottom-outer"
        isConnectable={isConnectable}
        style={{ left: '65%' }}
      />
      
      <Handle
        type="target"
        position={Position.Bottom}
        id="bottom-outer"
        isConnectable={isConnectable}
        style={{ left: '65%' }}
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
        opacity: isProcessing ? 1 : 0.6,
        boxShadow: isProcessing 
          ? '0 0 15px var(--lisa-green-subtle), 0 0 30px var(--lisa-green-glow)' 
          : '0 2px 8px rgba(0, 0, 0, 0.05)',
        transition: 'opacity 0.5s ease, border 0.5s ease, box-shadow 0.5s ease'
      }}>
        {data.label}
      </div>
    </>
  );
}

// Custom AGGREGATORS node - SINGLE TOP HANDLE with FADE-IN ANIMATION and PULSING
function AggregatorsNode({ data, isConnectable }: { data: { isPulsing: boolean, isFadingOut: boolean, label: string }, isConnectable: boolean }) {
  const isPulsing = data.isPulsing;
  
  return (
    <>
      {/* Single top handle for LISA connection (both target and source) */}
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
        border: isPulsing 
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
        transition: 'opacity 0.8s ease, border 0.5s ease, box-shadow 0.5s ease, transform 0.8s ease',
        opacity: data.isFadingOut ? 0 : (isPulsing ? 1 : 0.6),
        animation: data.isFadingOut ? 'fadeOut 0.8s ease forwards' : 'fadeIn 0.8s ease',
        boxShadow: isPulsing 
          ? '0 0 15px var(--lisa-green-subtle), 0 0 30px var(--lisa-green-glow)' 
          : '0 2px 8px rgba(0, 0, 0, 0.05)'
      }}>
        {data.label}
      </div>
    </>
  );
}

// Custom SMART CONTRACTS node - SINGLE TOP HANDLE with FADE-IN/OUT ANIMATION and PULSING
function SmartContractsNode({ data, isConnectable }: { data: { isPulsing: boolean, isFadingOut: boolean, label: string }, isConnectable: boolean }) {
  const isPulsing = data.isPulsing;
  
  return (
    <>
      {/* Single top handle for USER connection (both target and source) */}
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
        border: isPulsing 
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
        transition: 'opacity 0.8s ease, border 0.5s ease, box-shadow 0.5s ease, transform 0.8s ease',
        opacity: data.isFadingOut ? 0 : (isPulsing ? 1 : 0.6),
        animation: data.isFadingOut ? 'fadeOut 0.8s ease forwards' : 'fadeIn 0.8s ease',
        boxShadow: isPulsing 
          ? '0 0 15px var(--lisa-green-subtle), 0 0 30px var(--lisa-green-glow)' 
          : '0 2px 8px rgba(0, 0, 0, 0.05)'
      }}>
        {data.label}
      </div>
    </>
  );
}

// Separator Line Node - ReactFlow element
function SeparatorNode() {
  return (
    <div style={{
      width: '1px',
      height: '400px',
      background: 'linear-gradient(to bottom, transparent 0%, var(--white-transparent-1) 20%, var(--white-transparent-1) 80%, transparent 100%)',
      borderLeft: '1px dashed var(--white-transparent-1)',
      pointerEvents: 'none'
    }} />
  );
}

// Annotation Text Node - ReactFlow element
function AnnotationNode({ data }: { data: { label: string } }) {
  return (
    <div style={{
      fontSize: '14px',
      fontWeight: '300',
      color: 'var(--white-transparent-1)',
      pointerEvents: 'none',
      textAlign: 'center',
      width: '100px',
      height: '30px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }}>
      {data.label}
    </div>
  );
}

// Register custom node types
const nodeTypes = {
  userNode: UserNode,
  lisaNode: LisaNode,
  aggregatorsNode: AggregatorsNode,
  smartContractsNode: SmartContractsNode,
  separatorNode: SeparatorNode,
  annotationNode: AnnotationNode,
};

export default function TransactionFlowDiagram() {
  const dict = useDictionary();
  const [animationStep, setAnimationStep] = useState<AnimationStep>(0);
  const [reactFlowInstance, setReactFlowInstance] = useState<ReactFlowInstance | null>(null);

  // Get USER's current stage
  const getUserStage = useCallback((): string => {
    switch (animationStep) {
      case 0:
      case 1: return dict.diagrams.transaction_flow.user_chats_with_lisa;
      case 8: return dict.diagrams.transaction_flow.user_examines_txs;
      case 9: return dict.diagrams.transaction_flow.user_signs_txs;
      case 10: return dict.diagrams.transaction_flow.user_tx_confirmed;
      default: return dict.diagrams.transaction_flow.user;
    }
  }, [animationStep, dict]);

  // Get LISA's current internal stage
  const getLisaStage = useCallback((): string => {
    switch (animationStep) {
      case 2: return dict.diagrams.transaction_flow.lisa_verifications;
      case 3: return dict.diagrams.transaction_flow.lisa_parsing;
      case 4: return dict.diagrams.transaction_flow.lisa_crafting;
      case 5: return dict.diagrams.transaction_flow.lisa_crafting;
      case 6: return dict.diagrams.transaction_flow.lisa_crafting;
      case 7: return dict.diagrams.transaction_flow.lisa_tx_ready;
      default: return dict.diagrams.transaction_flow.lisa;
    }
  }, [animationStep, dict]);

  const isUserActive = animationStep === 0 || animationStep === 1 || animationStep === 8 || animationStep === 9 || animationStep === 10;
  const isLisaProcessing = animationStep >= 2 && animationStep <= 7;
  const isLifiActive = animationStep >= 5 && animationStep <= 7; // AGGREGATORS appears during steps 5-7 (includes fade-out)
  const isSmartContractsActive = animationStep >= 9 || animationStep === 0; // SMART CONTRACTS appears during steps 9-10 and fades out at step 0

  // DYNAMIC nodes - appear and disappear based on animation step (memoized to prevent React Flow warnings)
  const nodes: Node[] = useMemo(() => {
    const baseNodes: Node[] = [
    // USER node (always present) - PROPERLY SPACED AND ALIGNED
    {
      id: 'user',
      type: 'userNode',
      position: { x: 0, y: 150 },
      data: { 
        label: getUserStage(),
        isUserActive: isUserActive
      }
    },
    // LISA node (always present) - PROPERLY SPACED AND ALIGNED
    {
      id: 'lisa',
      type: 'lisaNode',
      position: { x: 350, y: 150 },
      data: { 
        label: getLisaStage(),
        isProcessing: isLisaProcessing
      }
    },
    // Separator Line - positioned at the center between USER and LISA
    {
      id: 'separator',
      type: 'separatorNode',
      position: { x: 255, y: 50 },
      data: {},
      draggable: false,
      selectable: false
    },
    // Frontend Annotation - positioned so its CENTER is 60px left of separator
    {
      id: 'frontend-annotation',
      type: 'annotationNode',
      position: { x: 145, y: 80 }, // x = 195 - 50 (half of 100px width)
      data: { label: dict.diagrams.transaction_flow.frontend },
      draggable: false,
      selectable: false
    },
    // Backend Annotation - positioned so its CENTER is 60px right of separator
    {
      id: 'backend-annotation',
      type: 'annotationNode',
      position: { x: 265, y: 80 }, // x = 315 - 50 (half of 100px width)
      data: { label: dict.diagrams.transaction_flow.backend },
      draggable: false,
      selectable: false
    }
    ];

    // AGGREGATORS node (appears only during steps 5-6) - ALIGNED WITH LISA'S OUTER HANDLE
    if (isLifiActive) {
      baseNodes.push({
        id: 'aggregators',
        type: 'aggregatorsNode',
        position: { x: 374, y: 300 }, // Aligned with LISA's 65% handle (350 + 0.65*160 - 80)
        data: { 
          label: dict.diagrams.transaction_flow.aggregators,
          isPulsing: animationStep === 5,  // Pulse when link TO appears
          isFadingOut: animationStep === 7  // Fade out at step 7
        }
      });
    }

    // SMART CONTRACTS node (appears only during steps 9-10) - ALIGNED WITH USER'S OUTER HANDLE
    if (isSmartContractsActive) {
      baseNodes.push({
        id: 'smart-contracts',
        type: 'smartContractsNode',
        position: { x: -24, y: 300 }, // Aligned with USER's 35% handle (0 + 0.35*160 - 80)
        data: { 
          label: dict.diagrams.transaction_flow.smart_contracts,
          isPulsing: animationStep === 9,  // Pulse when link TO appears
          isFadingOut: animationStep === 0  // Fade out at step 0 (graceful transition)
        }
      });
    }
    
    return baseNodes;
  }, [
    animationStep, 
    isUserActive, 
    isLisaProcessing, 
    isLifiActive, 
    isSmartContractsActive, 
    getLisaStage, 
    getUserStage,
    dict.diagrams.transaction_flow.aggregators,
    dict.diagrams.transaction_flow.backend,
    dict.diagrams.transaction_flow.frontend,
    dict.diagrams.transaction_flow.smart_contracts
  ]);

  // DYNAMIC edges - some appear/disappear with LIFI node (memoized to prevent React Flow warnings)
  const edges: Edge[] = useMemo(() => {
    const baseEdges: Edge[] = [
    // Top route: USER top → LISA top (chat request flow)
    {
      id: 'request',
      source: 'user',
      target: 'lisa',
      sourceHandle: 'top-lisa',
      targetHandle: 'top-user',
      type: 'step',
      animated: animationStep === 1,
      style: { 
        stroke: animationStep === 1 ? 'var(--diagram-edge)' : 'var(--lisa-green-subtle)', 
        strokeWidth: 2,
        strokeDasharray: '6 4',
        filter: animationStep === 1 ? 'drop-shadow(0 0 6px var(--lisa-green-dim))' : 'none',
        transition: 'all 0.3s ease'
      },
      markerEnd: {
        type: MarkerType.ArrowClosed,
        color: animationStep === 1 ? 'var(--diagram-edge)' : 'var(--lisa-green-subtle)'
      },
      label: animationStep === 1 ? dict.diagrams.transaction_flow.nl_request : undefined,
      labelStyle: {
        fontSize: '10px',
        fill: 'var(--diagram-edge)',
        fontWeight: '500'
      }
    },
    // Bottom route: LISA bottom → USER bottom (response flow) - INNER HANDLES
    {
      id: 'response',
      source: 'lisa',
      target: 'user',
      sourceHandle: 'bottom-inner',
      targetHandle: 'bottom-inner',
      type: 'step',
      animated: animationStep === 7,  // Moved to step 8
      style: { 
        stroke: animationStep === 7 ? 'var(--diagram-edge)' : 'var(--lisa-green-subtle)', 
        strokeWidth: 2,
        strokeDasharray: '6 4',
        filter: animationStep === 7 ? 'drop-shadow(0 0 6px var(--lisa-green-dim))' : 'none',
        transition: 'all 0.3s ease'
      },
      markerEnd: {
        type: MarkerType.ArrowClosed,
        color: animationStep === 7 ? 'var(--diagram-edge)' : 'var(--lisa-green-subtle)'
      },
      label: animationStep === 7 ? dict.diagrams.transaction_flow.unsigned_transactions : undefined,
      labelStyle: {
        fontSize: '10px',
        fill: 'var(--diagram-edge)',
        fontWeight: '500'
      }
    }
    ];

    // Add AGGREGATORS edges when AGGREGATORS node is active - vertical connection
    if (isLifiActive) {
      // LINK 3: LISA → AGGREGATORS (step 5) - TO AGGREGATORS
      if (animationStep === 5) {
        baseEdges.push({
          id: 'lisa-to-aggregators',
          source: 'lisa',
          target: 'aggregators',
          sourceHandle: 'bottom-outer',
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
            color: '#10b981'
          },
          label: dict.diagrams.transaction_flow.requests,
          labelStyle: {
            fontSize: '10px',
            fill: 'var(--diagram-edge)',
            fontWeight: '500'
          }
        });
      }

      // LINK 4: AGGREGATORS → LISA (step 6) - FROM AGGREGATORS (immediate replacement)
      if (animationStep === 6) {
        baseEdges.push({
          id: 'aggregators-to-lisa',
          source: 'aggregators',
          target: 'lisa',
          sourceHandle: 'top',
          targetHandle: 'bottom-outer',
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
            color: '#10b981'
          },
          label: dict.diagrams.transaction_flow.quotes_routes,
          labelStyle: {
            fontSize: '10px',
            fill: 'var(--diagram-edge)',
            fontWeight: '500'
          }
        });
      }
    }

    // Add SMART CONTRACTS edges when SMART CONTRACTS node is active - vertical connection
    if (isSmartContractsActive) {
      // LINK 5: USER → SMART CONTRACTS (step 9) - TO SMART CONTRACTS
      if (animationStep === 9) {
        baseEdges.push({
          id: 'user-to-smart-contracts',
          source: 'user',
          target: 'smart-contracts',
          sourceHandle: 'bottom-outer',
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
            color: '#10b981'
          },
          label: dict.diagrams.transaction_flow.execute_txs,
          labelStyle: {
            fontSize: '10px',
            fill: 'var(--diagram-edge)',
            fontWeight: '500'
          }
        });
      }

      // LINK 6: SMART CONTRACTS → USER (step 10) - FROM SMART CONTRACTS (immediate replacement)
      if (animationStep === 10) {
        baseEdges.push({
          id: 'smart-contracts-to-user',
          source: 'smart-contracts',
          target: 'user',
          sourceHandle: 'top',
          targetHandle: 'bottom-outer',
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
            color: '#10b981'
          },
          label: dict.diagrams.transaction_flow.tx_confirmed,
          labelStyle: {
            fontSize: '10px',
            fill: 'var(--diagram-edge)',
            fontWeight: '500'
          }
        });
      }
    }
    
    return baseEdges;
  }, [
    animationStep, 
    isLifiActive, 
    isSmartContractsActive,
    dict.diagrams.transaction_flow.execute_txs,
    dict.diagrams.transaction_flow.nl_request,
    dict.diagrams.transaction_flow.quotes_routes,
    dict.diagrams.transaction_flow.requests,
    dict.diagrams.transaction_flow.tx_confirmed,
    dict.diagrams.transaction_flow.unsigned_transactions
  ]);

  // Animation sequence (expanded for LIFI)
  const animateStep = useCallback(() => {
    setAnimationStep(prev => (prev === 10 ? 0 : (prev + 1)) as AnimationStep);
  }, []);

  // Auto-play animation - consistent timing for smooth flow
  useEffect(() => {
    const timing = 1800; // Harmonized timing for all steps
    
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
        height: 'clamp(450px, 65vh, 650px)', 
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
