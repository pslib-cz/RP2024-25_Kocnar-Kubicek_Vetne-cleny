import { TutorialNode } from "@/data/tutorial";
import React from "react";
import tutorialStart from '@/data/tutorial'

interface TutorialRuntimeNode{
  node: TutorialNode;
  yes: boolean;
}

export const useTutorial = () => {

  const [usedNodes, setUsedNodes] = React.useState<TutorialRuntimeNode[]>([
    {
      node: tutorialStart,
      yes: false,
    }
  ]);

  let currentNode : TutorialRuntimeNode = usedNodes[usedNodes.length - 1];

  function AddNode(node: TutorialNode, yes: boolean) {

    const newNode : TutorialRuntimeNode = {
      node: node,
      yes: yes,
    } 

    setUsedNodes((prev) => [...prev, newNode]);

    currentNode = newNode;
  }

  return {usedNodes, currentNode, AddNode};
}