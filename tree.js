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
    while (currentNode !== null) {
      if (currentNode.data > value) currentNode = currentNode.left;
      else if (currentNode.data < value) currentNode = currentNode.right;
      else if (currentNode.data === value) break;
    }
    if (currentNode === null) console.log("Value not found");
    else {
      console.log(currentNode);
      return currentNode;
    }
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

  inOrderForEach(callback) {}

  preOrderForEach(callback) {}

  postOrderForEach(callback) {}
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

tree.insert(10);
tree.deleteItem(7);
tree.find(5);
tree.levelOrderRecursiveForEach();

prettyPrint(tree.root);
