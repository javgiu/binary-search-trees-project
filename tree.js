class Node {
  constructor(value) {
    this.data = value;
    this.left = null;
    this.right = null;
  }
}

class Tree {
  constructor(array) {
    this.sortedAndUniqueArray = [...new Set(array)].sort((a, b) => a - b);
    this.root = this.buildTree(this.sortedAndUniqueArray);
  }

  buildTree(array) {
    if (array.length <= 1) return array[0] ? new Node(array[0]) : null;
    const mid = Math.floor((array.length - 1) / 2);
    const left = array.slice(0, mid);
    const right = array.slice(mid + 1, array.length);
    const root = new Node(array[mid]);
    root.left = this.buildTree(left);
    root.right = this.buildTree(right);
    return root;
  }

  insert(value) {
    const insertRec = (value, node) => {
      if (node === null) return new Node(value);
      if (value < node.data) node.left = insertRec(value, node.left);
      else node.right = insertRec(value, node.right);
      return node;
    };

    this.root = insertRec(value, this.root);
  }

  getSuccessor(node) {
    let current = node.right;
    while (current !== null && current.left !== null) {
      current = current.left;
    }
    return current;
  }

  deleteItem(value) {
    const deleteRec = (value, node) => {
      if (node === null) return node;
      if (value > node.data) node.right = deleteRec(value, node.right);
      else if (value < node.data) node.left = deleteRec(value, node.left);
      else {
        // Node with 0 or 1 child
        if (node.left === null) return node.right;
        if (node.right === null) return node.left;

        // Node with 2 children
        const successor = this.getSuccessor(node);
        node.data = successor.data;
        node.right = deleteRec(successor.data, node.right);
      }
      return node;
    };

    this.root = deleteRec(value, this.root);
  }

  find(value) {
    let currentNode = this.root;
    while (currentNode) {
      if (currentNode.data > value) currentNode = currentNode.left;
      else if (currentNode.data < value) currentNode = currentNode.right;
      else if (currentNode.data === value) break;
    }
    return currentNode;
  }

  levelOrderForEach(callback) {
    if (!callback) throw new Error("Callback required");
    const queue = [];
    queue.push(this.root);
    while (queue.length > 0) {
      const currentNode = queue[0];
      callback(currentNode);
      if (currentNode.left !== null) queue.push(currentNode.left);
      if (currentNode.right !== null) queue.push(currentNode.right);
      queue.shift();
    }
  }

  levelOrderRecursiveForEach(callback) {
    if (!callback) throw new Error("Callback required");

    function recursive(queue) {
      if (queue.length === 0) return;

      const node = queue.shift();
      callback(node);
      if (node.left) queue.push(node.left);
      if (node.right) queue.push(node.right);

      recursive(queue);
    }

    recursive([this.root]);
  }

  preOrderForEach(callback) {
    if (!callback) throw new Error("Callback required");
    function recursive(node) {
      if (node == null) return;
      callback(node);
      recursive(node.left);
      recursive(node.right);
    }
    recursive(this.root);
  }

  inOrderForEach(callback) {
    if (!callback) throw new Error("Callback required");
    function recursive(node) {
      if (!node) return;
      recursive(node.left);
      callback(node);
      recursive(node.right);
    }
    recursive(this.root);
  }

  postOrderForEach(callback) {
    if (!callback) throw new Error("Callback required");
    function recursive(node) {
      if (!node) return;
      recursive(node.left);
      recursive(node.right);
      callback(node);
    }
    recursive(this.root);
  }

  height(value) {
    const node = this.find(value);
    if (node) return calculateHeight(node);
    else return null;

    function calculateHeight(node) {
      if (node == null) return 0;

      const leftHeight = calculateHeight(node.left);
      const rightHeight = calculateHeight(node.right);

      return 1 + Math.max(leftHeight, rightHeight);
    }
  }

  depth(value) {
    let currentNode = this.root;
    if (currentNode == null) return null;
    let depth = 0;
    while (currentNode) {
      if (value > currentNode.data) currentNode = currentNode.right;
      else if (value < currentNode.data) currentNode = currentNode.left;
      else if (value === currentNode.data) break;
      depth++;
    }
    if (currentNode) return depth;
    else return null;
  }

  depthRecursive(value) {
    function calculateDepth(node) {
      if (node == null) return null;
      if (node.data === value) return 0;
      if (value > node.data) {
        const rightDepth = calculateDepth(node.right);
        if (rightDepth === null) return null;
        return 1 + rightDepth;
      }
      if (value < node.data) {
        const leftDepth = calculateDepth(node.left);
        if (leftDepth === null) return null;
        return 1 + leftDepth;
      }
    }

    return calculateDepth(this.root);
  }
}

const array = [1, 1, 2, 2, 3, 3, 4, 5, 6, 7, 8, 9];
const tree = new Tree(array);

const prettyPrint = (node, prefix = "", isLeft = true) => {
  if (node === null) {
    return;
  }
  if (node.right !== null) {
    prettyPrint(node.right, `${prefix}${isLeft ? "│   " : "    "}`, false);
  }
  console.log(`${prefix}${isLeft ? "└── " : "┌── "}${node.data}`);
  if (node.left !== null) {
    prettyPrint(node.left, `${prefix}${isLeft ? "    " : "│   "}`, true);
  }
};

// Testing //

console.log("Testing...");
console.log("Original tree");
prettyPrint(tree.root);

console.log("Inseting value 10...");
tree.insert(10);
prettyPrint(tree.root);

console.log("Deleting value 7...");
tree.deleteItem(7);
prettyPrint(tree.root);

console.log("Looking for value 7...");
tree.find(7);

console.log("Looking for value 10...");
tree.find(10);

console.log("Level Order Traversal");
tree.levelOrderRecursiveForEach((node) => console.log(node.data));

console.log("Pre Order Traversal");
tree.preOrderForEach((node) => console.log(node.data));

console.log("In Order Traversal");
tree.inOrderForEach((node) => console.log(node.data));

console.log("Post Order Traversal");
tree.postOrderForEach((node) => console.log(node.data));

console.log("Get height of 3");
prettyPrint(tree.root);
console.log(tree.height(5));

console.log("Get depth of 6");
prettyPrint(tree.root);
console.log(tree.depth(6));

console.log("Get recursive depth of 5");
prettyPrint(tree.root);
console.log(tree.depthRecursive(5));
