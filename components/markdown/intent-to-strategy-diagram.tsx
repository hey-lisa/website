'use client';

import React, { useState, useEffect, useCallback, useMemo } from 'react';
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

// Custom USER node - Top and bottom handles
function UserNode({ data, isConnectable }: { data: { isUserActive: boolean, label: string }, isConnectable: boolean }) {
  const isUserActive = data.isUserActive;
  
  return (
    <>
      {/* Top handle for connecting to LISA */}
      <Handle
        type="source"
        position={Position.Top}
        id="top"
        isConnectable={isConnectable}
      />
      
      {/* Bottom handle for receiving from LISA */}
      <Handle
        type="target"
        position={Position.Bottom}
        id="bottom"
        isConnectable={isConnectable}
      />
      
      <div style={{
        background: 'rgba(255, 255, 255, 0.1)',
        backdropFilter: 'blur(10px)',
        color: '#065f46',
        border: isUserActive 
          ? '2px solid rgba(16, 185, 129, 0.8)' 
          : '1px solid rgba(16, 185, 129, 0.3)',
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
          ? '0 0 15px rgba(16, 185, 129, 0.3)' 
          : '0 2px 8px rgba(0, 0, 0, 0.05)',
        transition: 'opacity 0.3s ease, border 0.5s ease, box-shadow 0.5s ease'
      }}>
        {data.label}
      </div>
    </>
  );
}

// Custom LISA node - Simple layout with 1 top + 2 bottom handles
function LisaNode({ data, isConnectable }: { data: { isProcessing: boolean, label: string }, isConnectable: boolean }) {
  const isProcessing = data.isProcessing;
  
  return (
    <>
      {/* Top handle for USER connection */}
      <Handle
        type="target"
        position={Position.Top}
        id="top"
        isConnectable={isConnectable}
      />
      
      {/* Bottom1 handle for USER return (LEFT side) */}
      <Handle
        type="source"
        position={Position.Bottom}
        id="bottom1"
        isConnectable={isConnectable}
        style={{ left: '35%' }}
      />
      
      {/* Bottom2 handle for AGENT connection (RIGHT side) */}
      <Handle
        type="source"
        position={Position.Bottom}
        id="bottom2-source"
        isConnectable={isConnectable}
        style={{ left: '65%' }}
      />
      
      <Handle
        type="target"
        position={Position.Bottom}
        id="bottom2-target"
        isConnectable={isConnectable}
        style={{ left: '65%' }}
      />
      
      <div style={{
        background: 'rgba(255, 255, 255, 0.1)',
        backdropFilter: 'blur(10px)',
        color: '#065f46',
        border: isProcessing 
          ? '2px solid rgba(16, 185, 129, 0.8)' 
          : '1px solid rgba(16, 185, 129, 0.3)',
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
        opacity: isProcessing ? 1 : 0.7,
        boxShadow: isProcessing 
          ? '0 0 15px rgba(16, 185, 129, 0.3)' 
          : '0 2px 8px rgba(0, 0, 0, 0.05)',
        transition: 'opacity 0.3s ease, border 0.5s ease, box-shadow 0.5s ease',
        animation: isProcessing ? 'pulse 2s infinite' : 'none'
      }}>
        {data.label}
      </div>
    </>
  );
}

// Custom AGENT node - appears/disappears like Aggregators
function AgentNode({ data, isConnectable }: { data: { isPulsing: boolean, isFadingOut: boolean, label: string }, isConnectable: boolean }) {
  const isPulsing = data.isPulsing;
  const isFadingOut = data.isFadingOut;
  
  return (
    <>
      {/* Top handle for receiving from LISA */}
      <Handle
        type="target"
        position={Position.Top}
        id="top"
        isConnectable={isConnectable}
      />
      
      {/* Top handle for sending back to LISA */}
      <Handle
        type="source"
        position={Position.Top}
        id="top"
        isConnectable={isConnectable}
      />
      
      <div style={{
        background: 'rgba(255, 255, 255, 0.1)',
        backdropFilter: 'blur(10px)',
        color: '#065f46',
        border: isPulsing 
          ? '2px solid rgba(16, 185, 129, 0.8)' 
          : '1px solid rgba(16, 185, 129, 0.3)',
        borderRadius: '12px',
        padding: '8px',
        fontSize: '11px',
        fontWeight: '600',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        whiteSpace: 'pre-line',
        textAlign: 'center',
        opacity: isFadingOut ? 0 : 1,
        boxShadow: isPulsing 
          ? '0 0 15px rgba(16, 185, 129, 0.3)' 
          : '0 2px 8px rgba(0, 0, 0, 0.05)',
        transition: 'opacity 0.5s ease, border 0.5s ease, box-shadow 0.5s ease',
        animation: isPulsing ? 'pulse 2s infinite' : 'none'
      }}>
        {data.label}
      </div>
    </>
  );
}

// Custom Group node with handles
function GroupNode({ data, isConnectable }: { data: { isActive: boolean, label: string }, isConnectable: boolean }) {
  const isActive = data.isActive;
  
  return (
    <>
      {/* Right handle for receiving from LISA */}
      <Handle
        type="target"
        position={Position.Right}
        id="right"
        isConnectable={isConnectable}
      />
      
      <div style={{
        width: '200px', 
        height: '120px',
        background: 'transparent',
        color: '#065f46',
        border: isActive 
          ? '2px dashed rgba(16, 185, 129, 0.8)' 
          : '1px dashed rgba(16, 185, 129, 0.3)',
        borderRadius: '12px',
        padding: '10px',
        fontSize: '12px',
        fontWeight: '600',
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'center',
        opacity: isActive ? 1 : 0.7,
        boxShadow: isActive 
          ? '0 0 15px rgba(16, 185, 129, 0.3)' 
          : 'none',
        transition: 'opacity 0.3s ease, border 0.5s ease, box-shadow 0.5s ease',
        animation: isActive ? 'pulse 2s infinite' : 'none'
      }}>
        {data.label}
      </div>
    </>
  );
}

// Helper functions
function getUserStage(step: AnimationStep): string {
  switch (step) {
    case 0: return "USER\nChat with LISA";
    case 1:
    case 2: return "USER\nDescribe Strategy";
    case 10: return "USER\nStrategy Received";
    default: return "USER";
  }
}

function getLisaStage(step: AnimationStep): string {
  switch (step) {
    case 3: return "LISA\nChat with User";
    case 4:
    case 5: return "LISA\nValidates Strategy";
    case 6:
    case 7:
    case 8: return "LISA\nContacting Agent";
    case 9: return "LISA\nAdds to Hub";
    default: return "LISA";
  }
}

export default function IntentToStrategyDiagram() {
  const [animationStep, setAnimationStep] = useState<AnimationStep>(0);
  const [reactFlowInstance, setReactFlowInstance] = useState<ReactFlowInstance | null>(null);
  const [strategiesCreated, setStrategiesCreated] = useState<number>(0);

  const animateStep = useCallback(() => {
    setAnimationStep(prev => prev === 10 ? 0 : (prev + 1) as AnimationStep);
  }, []);

  // Separate effect to handle strategy creation when step 9 is reached
  useEffect(() => {
    if (animationStep === 9) {
      setStrategiesCreated(prevCount => (prevCount + 1) % 4);
    }
  }, [animationStep]);

  useEffect(() => {
    const interval = setInterval(animateStep, 1500);
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

  // Animation state
  const isUserActive = (animationStep >= 0 && animationStep <= 2) || animationStep === 10;
  const isLisaProcessing = (animationStep >= 3 && animationStep <= 9); // Stay focused during Agent exchange
  const isAgentActive = animationStep === 6 || animationStep === 7 || animationStep === 8;
  const isGroupActive = animationStep === 9;

  // Node types
  const nodeTypes = useMemo(() => ({
    user: UserNode,
    lisa: LisaNode,
    agent: AgentNode,
    groupNode: GroupNode,
  }), []);

  // Define nodes - aligned horizontally (memoized to prevent React Flow warnings)
  const nodes: Node[] = useMemo(() => {
    const baseNodes: Node[] = [
      {
        id: 'user',
        type: 'user',
        position: { x: 0, y: 150 },
        data: { 
          label: getUserStage(animationStep), 
          isUserActive
        },
        style: { width: '160px', height: '70px' }
      },
      {
        id: 'lisa',
        type: 'lisa',
        position: { x: 350, y: 150 },
        data: { 
          label: getLisaStage(animationStep), 
          isProcessing: isLisaProcessing
        },
        style: { width: '160px', height: '70px' }
      },
    ];

    // Add Agent node when active (appears during steps 6-8)
    if (isAgentActive) {
      let agentLabel = 'AGENT\nWaiting';
      if (animationStep === 6) {
        agentLabel = 'AGENT\nReceiving';
      } else if (animationStep === 7) {
        agentLabel = 'AGENT\nCreating Strategy';
      } else if (animationStep === 8) {
        agentLabel = 'AGENT\nSending Back';
      }
      
      baseNodes.push({
        id: 'agent',
        type: 'agent',
        position: { x: 394, y: 300 }, // Aligned with LISA's bottom2 handle (65%) - centered for straight link
        data: { 
          label: agentLabel,
          isPulsing: true,
          isFadingOut: false
        },
        style: { width: '120px', height: '50px' }
      });
    }

    // Add Fourth node as GROUP (always visible, activates when receiving link)
    baseNodes.push({
      id: 'fourth',
      type: 'groupNode',
      position: { x: 155, y: 320 }, // Centered on X axis, lowered a bit
      data: { 
        label: 'STRATEGY HUB',
        isActive: isGroupActive
      },
      style: { width: '200px', height: '120px' }
    });

    // Add child nodes inside the group dynamically based on strategies created
    const childNodePositions = [
      { x: 10, y: 50 },
      { x: 75, y: 50 },
      { x: 140, y: 50 }
    ];

    // Only show strategies if strategiesCreated > 0 (when = 0, hub is empty)
    for (let i = 0; i < strategiesCreated; i++) {
      // The newest strategy is the one at position (strategiesCreated - 1) during step 9
      const isNewest = (i === strategiesCreated - 1) && animationStep === 9;
      
      baseNodes.push({
        id: `fourth-child-${i + 1}`,
        type: 'default',
        parentId: 'fourth',
        position: childNodePositions[i],
        data: { label: `S${i + 1}` },
        style: { 
          width: '50px', 
          height: '50px',
          background: isNewest ? 'rgba(16, 185, 129, 0.2)' : 'rgba(255, 255, 255, 0.1)',
          backdropFilter: 'blur(10px)',
          color: '#065f46',
          border: isNewest ? '2px solid rgba(16, 185, 129, 0.8)' : '1px solid rgba(16, 185, 129, 0.3)',
          borderRadius: '8px',
          fontSize: '8px',
          fontWeight: '600',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: isNewest ? '0 0 10px rgba(16, 185, 129, 0.4)' : 'none',
          animation: isNewest ? 'pulse 2s infinite' : 'none',
          transition: 'all 0.3s ease'
        },
        draggable: false,
        extent: 'parent'
      });
    }
    
    return baseNodes;
  }, [animationStep, isUserActive, isLisaProcessing, isAgentActive, isGroupActive, strategiesCreated]);

  // Define edges - always visible, highlighted when active (memoized to prevent React Flow warnings)
  const edges: Edge[] = useMemo(() => {
    const baseEdges: Edge[] = [
    // USER → LISA (always visible, animated on step 3)
    {
      id: 'user-to-lisa',
      source: 'user',
      target: 'lisa',
      sourceHandle: 'top',
      targetHandle: 'top',
      type: 'step',
      animated: animationStep === 3,
      style: { 
        stroke: animationStep === 3 ? '#10b981' : 'rgba(16, 185, 129, 0.4)', 
        strokeWidth: 2,
        strokeDasharray: '6 4',
        filter: animationStep === 3 ? 'drop-shadow(0 0 6px rgba(16, 185, 129, 0.6))' : 'none',
        transition: 'all 0.3s ease'
      },
      markerEnd: {
        type: MarkerType.ArrowClosed,
        color: animationStep === 3 ? '#10b981' : 'rgba(16, 185, 129, 0.4)',
      },
      label: animationStep === 3 ? 'Description' : undefined,
      labelStyle: {
        fontSize: '10px',
        fill: '#10b981',
        fontWeight: '500'
      }
    },
    // LISA → USER (always visible, animated on step 10)
    {
      id: 'lisa-to-user',
      source: 'lisa',
      target: 'user',
      sourceHandle: 'bottom1',
      targetHandle: 'bottom',
      type: 'step',
      animated: animationStep === 10,
      style: { 
        stroke: animationStep === 10 ? '#10b981' : 'rgba(16, 185, 129, 0.4)', 
        strokeWidth: 2,
        strokeDasharray: '6 4',
        filter: animationStep === 10 ? 'drop-shadow(0 0 6px rgba(16, 185, 129, 0.6))' : 'none',
        transition: 'all 0.3s ease'
      },
      markerEnd: {
        type: MarkerType.ArrowClosed,
        color: animationStep === 10 ? '#10b981' : 'rgba(16, 185, 129, 0.4)',
      },
      label: animationStep === 10 ? 'Strategy Ready' : undefined,
      labelStyle: {
        fontSize: '10px',
        fill: '#10b981',
        fontWeight: '500'
      }
    }
    ];

    // Add Agent edges when Agent is active
    if (isAgentActive) {
      // LISA → Agent (step 6 and 7 - Link 1 stays open during "creating")
      if (animationStep === 6 || animationStep === 7) {
        baseEdges.push({
          id: 'lisa-to-agent',
          source: 'lisa',
          target: 'agent',
          sourceHandle: 'bottom2-source',
          targetHandle: 'top',
          type: 'step',
          animated: animationStep === 6, // Only animate on first appearance
          style: { 
            stroke: '#10b981', 
            strokeWidth: 2,
            strokeDasharray: '6 4',
            filter: 'drop-shadow(0 0 6px rgba(16, 185, 129, 0.6))'
          },
          markerEnd: {
            type: MarkerType.ArrowClosed,
            color: '#10b981',
          },
          label: 'Request',
          labelStyle: {
            fontSize: '10px',
            fill: '#10b981',
            fontWeight: '500'
          }
        });
      }

      // Agent → LISA (step 8 only - Link 2)
      if (animationStep === 8) {
        baseEdges.push({
          id: 'agent-to-lisa',
          source: 'agent',
          target: 'lisa',
          sourceHandle: 'top',
          targetHandle: 'bottom2-target',
          type: 'step',
          animated: true,
          style: { 
            stroke: '#10b981', 
            strokeWidth: 2,
            strokeDasharray: '6 4',
            filter: 'drop-shadow(0 0 6px rgba(16, 185, 129, 0.6))'
          },
          markerEnd: {
            type: MarkerType.ArrowClosed,
            color: '#10b981',
          },
          label: 'Strategy Spec',
          labelStyle: {
            fontSize: '10px',
            fill: '#10b981',
            fontWeight: '500'
          }
        });
      }
    }

    // Add LISA → GROUP link (step 9 - after Agent interaction, before final USER response)
    if (animationStep === 9) {
      baseEdges.push({
        id: 'lisa-to-group',
        source: 'lisa',
        target: 'fourth',
        sourceHandle: 'bottom2-source',
        targetHandle: 'right',
        type: 'step',
        animated: true,
        style: { 
          stroke: '#10b981', 
          strokeWidth: 2,
          strokeDasharray: '6 4',
          filter: 'drop-shadow(0 0 6px rgba(16, 185, 129, 0.6))'
        },
        markerEnd: {
          type: MarkerType.ArrowClosed,
          color: '#10b981',
        },
        label: 'Adding Strategy',
        labelStyle: {
          fontSize: '10px',
          fill: '#10b981',
          fontWeight: '500'
        }
      });
    }
    
    return baseEdges;
  }, [animationStep, isAgentActive]);

  return (
    <>
      <style jsx global>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.7; }
        }
        
        /* Hide all ReactFlow handles */
        .react-flow__handle {
          opacity: 0 !important;
        }

        /* Hide ReactFlow attribution */
        .react-flow__attribution {
          display: none !important;
        }

        /* Style ReactFlow edge labels */
        .react-flow__edge-text {
          fill: #10b981 !important;
        }
        
        .react-flow__edge-textbg {
          fill: #1f2937 !important;
          stroke: none !important;
          fill-opacity: 1 !important;
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
        background: 'transparent',
        border: '1px solid rgba(16, 185, 129, 0.2)',
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
