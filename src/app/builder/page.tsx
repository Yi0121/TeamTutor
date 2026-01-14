'use client';

import { useCallback, useState } from 'react';
import {
    ReactFlow,
    Background,
    Controls,
    MiniMap,
    addEdge,
    useNodesState,
    useEdgesState,
    type Node,
    type Edge,
    type OnConnect,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';

import { NodePalette } from '@/components/builder/NodePalette';
import { PropertyPanel } from '@/components/builder/PropertyPanel';
import { CanvasToolbar } from '@/components/builder/CanvasToolbar';
import { AgentNode } from '@/components/builder/nodes/AgentNode';
import { TriggerNode } from '@/components/builder/nodes/TriggerNode';
import { ConditionNode } from '@/components/builder/nodes/ConditionNode';
import { ActionNode } from '@/components/builder/nodes/ActionNode';
import { EndNode } from '@/components/builder/nodes/EndNode';

// Custom node types
const nodeTypes = {
    agent: AgentNode,
    trigger: TriggerNode,
    condition: ConditionNode,
    action: ActionNode,
    end: EndNode,
};

// Initial nodes for demo
const initialNodes: Node[] = [
    {
        id: 'trigger-1',
        type: 'trigger',
        position: { x: 250, y: 50 },
        data: { label: '學生發言', triggerType: 'user_message' },
    },
    {
        id: 'agent-1',
        type: 'agent',
        position: { x: 100, y: 200 },
        data: { label: '小助教', agentId: 'agent-tutor', model: 'gpt-4o' },
    },
    {
        id: 'agent-2',
        type: 'agent',
        position: { x: 400, y: 200 },
        data: { label: '蘇格拉底', agentId: 'agent-socratic', model: 'gemini-1.5-pro' },
    },
    {
        id: 'condition-1',
        type: 'condition',
        position: { x: 250, y: 350 },
        data: { label: '是否需要深入解釋？', condition: 'understanding < 0.7' },
    },
    {
        id: 'action-1',
        type: 'action',
        position: { x: 250, y: 500 },
        data: { label: '呼叫 GeoGebra', actionType: 'tool_call', toolName: 'geogebra' },
    },
    {
        id: 'end-1',
        type: 'end',
        position: { x: 250, y: 650 },
        data: { label: '結束' },
    },
];

const initialEdges: Edge[] = [
    { id: 'e1', source: 'trigger-1', target: 'agent-1', animated: true },
    { id: 'e2', source: 'trigger-1', target: 'agent-2', animated: true },
    { id: 'e3', source: 'agent-1', target: 'condition-1' },
    { id: 'e4', source: 'condition-1', target: 'action-1', label: 'Yes' },
    { id: 'e5', source: 'action-1', target: 'end-1' },
];

export default function BuilderPage() {
    const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
    const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
    const [selectedNode, setSelectedNode] = useState<Node | null>(null);
    const [history, setHistory] = useState<{ nodes: Node[]; edges: Edge[] }[]>([]);
    const [historyIndex, setHistoryIndex] = useState(-1);

    const onConnect: OnConnect = useCallback(
        (params) => setEdges((eds) => addEdge({ ...params, animated: true }, eds)),
        [setEdges]
    );

    const onNodeClick = useCallback((_: React.MouseEvent, node: Node) => {
        setSelectedNode(node);
    }, []);

    const onPaneClick = useCallback(() => {
        setSelectedNode(null);
    }, []);

    const onDragOver = useCallback((event: React.DragEvent<HTMLDivElement>) => {
        event.preventDefault();
        event.dataTransfer.dropEffect = 'move';
    }, []);

    const onDrop = useCallback(
        (event: React.DragEvent<HTMLDivElement>) => {
            event.preventDefault();

            const type = event.dataTransfer.getData('application/reactflow');
            if (!type) return;

            const position = {
                x: event.clientX - 300,
                y: event.clientY - 100,
            };

            const newNode: Node = {
                id: `${type}-${Date.now()}`,
                type,
                position,
                data: { label: `新 ${type} 節點` },
            };

            setNodes((nds) => [...nds, newNode]);
        },
        [setNodes]
    );

    return (
        <div className="h-screen flex bg-slate-100">
            {/* Left Panel - Node Palette */}
            <NodePalette />

            {/* Main Canvas */}
            <div className="flex-1">
                <ReactFlow
                    nodes={nodes}
                    edges={edges}
                    onNodesChange={onNodesChange}
                    onEdgesChange={onEdgesChange}
                    onConnect={onConnect}
                    onNodeClick={onNodeClick}
                    onPaneClick={onPaneClick}
                    onDragOver={onDragOver}
                    onDrop={onDrop}
                    nodeTypes={nodeTypes}
                    fitView
                    className="bg-slate-50"
                >
                    <Background color="#cbd5e1" gap={20} />
                    <Controls />
                    <MiniMap
                        nodeColor={(n) => {
                            switch (n.type) {
                                case 'agent':
                                    return '#3b82f6';
                                case 'trigger':
                                    return '#22c55e';
                                case 'condition':
                                    return '#f59e0b';
                                case 'action':
                                    return '#8b5cf6';
                                case 'end':
                                    return '#ef4444';
                                default:
                                    return '#94a3b8';
                            }
                        }}
                    />
                </ReactFlow>

                {/* Toolbar */}
                <div className="absolute top-4 left-1/2 -translate-x-1/2 z-10">
                    <CanvasToolbar
                        onSave={() => alert('Workflow 儲存成功!')}
                        onLoad={() => alert('載入範本')}
                        onExport={() => alert('匯出 JSON')}
                        onPreview={() => alert('預覽模式')}
                        onUndo={() => { }}
                        onRedo={() => { }}
                        onZoomIn={() => { }}
                        onZoomOut={() => { }}
                        onFitView={() => { }}
                        canUndo={historyIndex > 0}
                        canRedo={historyIndex < history.length - 1}
                    />
                </div>
            </div>

            {/* Right Panel - Properties */}
            <PropertyPanel selectedNode={selectedNode} />
        </div>
    );
}
