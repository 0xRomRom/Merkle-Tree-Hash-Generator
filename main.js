const { MerkleTree } = require("merkletreejs");
const keccak256 = require("keccak256");

const arrayInput = document.querySelector(".array-input");
const generateRootButton = document.querySelector(".generate-hash");
const resultRootText = document.querySelector(".result-root");
const copyRootButton = document.querySelector(".copy-root");
const compareRootText = document.querySelector(".compare-root");
const validateRootButton = document.querySelector(".validate-root");
const hashResultBox = document.querySelector(".result-box");
const hashAgainstBox = document.querySelector(".result-box2");
const validateOutcomeText = document.querySelector(".validate-outcome");
const creditsBox = document.querySelector(".made-by-box");

const inputs = [
  "0xdAbc5B9d3fec5c82140a79DDA28c474f7825caa9",
  "0x3b0Ca591d50cbB5C7A312E9d99837ec0B9693951",
  "0xB63D295abD3f02CAfBcD7bD4Fb1c15f828E14eaF",
];

let currentRootHash;
let currentLeafNodes;

generateRootButton.addEventListener("click", () => {
  if (arrayInput.value.length === 0) {
    alert("No array found");
    return;
  }
  let regex = /[\s,\[\]"]+/g;

  let userInput = arrayInput.value.split(",");
  let filteredArray = userInput.map((str) => str.replace(regex, ""));
  let finalArray = filteredArray.filter((item) => item.length > 0);

  const leafNodes = finalArray.map((addr) => keccak256(addr));
  currentLeafNodes = leafNodes;
  const tree = new MerkleTree(leafNodes, keccak256, { sort: true });
  const rootHash = tree.getHexRoot();

  resultRootText.value = rootHash;
  currentRootHash = rootHash;
  arrayInput.value = "";
  hashResultBox.classList.remove("hidden");
  hashAgainstBox.classList.remove("hidden");
  creditsBox.classList.remove("hidden");
});

copyRootButton.addEventListener("click", () => {
  let input = document.querySelector(".result-root");
  if (input.value.length === 0) {
    alert("No hash to copy");
    return;
  }
  input.select();
  document.execCommand("copy");
  window.getSelection().removeAllRanges();
  copyRootButton.textContent = "Copied!";
  setTimeout(() => {
    copyRootButton.innerHTML = `<i class="fa-regular fa-clone"></i> Copy`;
  }, 2000);
});

validateRootButton.addEventListener("click", () => {
  let userInput = compareRootText.value;
  let keccakInput = keccak256(userInput);

  const tree = new MerkleTree(currentLeafNodes, keccak256, { sort: true });
  const proof = tree.getHexProof(keccakInput);

  let outcome = tree.verify(proof, keccakInput, currentRootHash);

  if (outcome) {
    validateOutcomeText.style.color = "green";
    validateOutcomeText.textContent = "TRUE";
  }
  if (!outcome) {
    validateOutcomeText.style.color = "red";
    validateOutcomeText.textContent = "FALSE";
  }
});
