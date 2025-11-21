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

prettyPrint(tree.root);
