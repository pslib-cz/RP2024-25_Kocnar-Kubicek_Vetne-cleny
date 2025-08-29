import React from "react";
import tutorialStart from '@/data/tutorialTree'
import { TutorialNode } from "@/types/tutorialNode";
import { TranslateWordType } from "@/constants/WordTypes";

export interface TutorialRuntimeNode{
  node: TutorialNode;
  yes: boolean;
}

function traverseByTitles(root: TutorialNode, titles: string[]): {usedNodes: TutorialRuntimeNode[], currentNode: TutorialRuntimeNode} {
  let current = root;
  const usedNodes: TutorialRuntimeNode[] = [];
  let lastYes = false;
  for (let i = 0; i < titles.length; i++) {
    if (!current || current.title !== titles[i]) break;
    // Look ahead to next title to determine yes/no
    if (i < titles.length - 1) {
      if (current.yesNode && current.yesNode.title === titles[i + 1]) {
        usedNodes.push({ node: current, yes: true });
        current = current.yesNode;
        lastYes = true;
      } else if (current.noNode && current.noNode.title === titles[i + 1]) {
        usedNodes.push({ node: current, yes: false });
        current = current.noNode;
        lastYes = false;
      } else {
        break;
      }
    }
  }
  // The currentNode is the last node in the path
  return {
    usedNodes,
    currentNode: { node: current, yes: lastYes }
  };
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

  function reset() {
    setUsedNodes([]);
    setCurrentNode({
      node: tutorialStart,
      yes: false,
    });
  }

  function setPath(titles: string[]) {
    if (!titles || titles.length === 0) {
      reset();
      return;
    }
    const { usedNodes, currentNode } = traverseByTitles(tutorialStart, titles);
    setUsedNodes(usedNodes);
    setCurrentNode(currentNode);
  }

  function pathExists(currentNode: TutorialRuntimeNode, title: string, yes : boolean): boolean {
    function dfs(node: TutorialNode | null): boolean {
      console.log("DFS checking node:", node?.title, "with title:", TranslateWordType(title).toUpperCase());
      if (!node) return false;
      if (node.title === TranslateWordType(title).toUpperCase()) return true;
      return dfs(node.yesNode) || dfs(node.noNode);
    }
    return yes ? dfs(currentNode.node.yesNode) : dfs(currentNode.node.noNode);
  }

  return {usedNodes, currentNode, AddNode, reset, setPath, pathExists};
}