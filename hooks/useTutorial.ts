import React from "react";
import tutorialStart from '@/data/tutorialTree'
import { TutorialNode } from "@/types/tutorialNode";
import Tutorial from "@/app/(tabs)/tutorial";

interface TutorialRuntimeNode{
  node: TutorialNode;
  yes: boolean;
}

export const useTutorial = () => {
  const [usedNodes, setUsedNodes] = React.useState<TutorialRuntimeNode[]>([]);
  const [currentNode, setCurrentNode] = React.useState<TutorialRuntimeNode>({
    node: tutorialStart,
    yes: false,
  });

  function AddNode(currentInputNode: TutorialRuntimeNode, yes: boolean) {
    const nextNode: TutorialNode | null = yes ? currentInputNode.node.yesNode : currentInputNode.node.noNode;

    if (!currentInputNode || !nextNode) return;

    const newNode : TutorialRuntimeNode = {
      node: nextNode,
      yes: yes,
    } 

    setUsedNodes((prev) => [...prev, { node: currentNode.node, yes }]);

    setCurrentNode(newNode);
  }

  return {usedNodes, currentNode, AddNode};
}