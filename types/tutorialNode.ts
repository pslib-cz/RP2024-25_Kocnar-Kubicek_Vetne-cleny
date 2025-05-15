
// 
//  This type represents each node in the tutorial binary tree (including leaf ones)
//

export interface TutorialNode {
  // is the leaf node - threrefore there is 'no' next nor 'yes' node
  isResult: boolean;
  
  title: string;
  description: string;

  yesNode: TutorialNode | null;
  noNode: TutorialNode | null;
}
  