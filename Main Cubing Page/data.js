// Data for algorithm pages

const twoLookOLLAlgorithms = [
    {name: 'Dot', type: 'edges', src:'Two-Look-OLL-IMGs\\Dot.png', algorithm:"F R U R' U' F' f R U R' U' f'"},
    {name: 'I Shape', type: 'edges', src:'Two-Look-OLL-IMGs\\I-Shape.png', algorithm:"F R U R' U' F'"},
    {name: 'L Shape', type: 'edges', src:'Two-Look-OLL-IMGs\\L-Shape.png', algorithm:"F U R U' R' F'"},
    {name: 'Anti Sune', type: 'corners', src:'Two-Look-OLL-IMGs\\AntiSune.png', algorithm:"R U2 R' U' R U' R'"},
    {name: 'H', type: 'corners', src:'Two-Look-OLL-IMGs\\H.png', algorithm:"R U R' U R U' R' U R U2 R'"},
    {name: 'L', type: 'corners', src:'Two-Look-OLL-IMGs\\L.png', algorithm:"F R' F' r U R U' r'"},
    {name: 'Pi', type: 'corners', src:'Two-Look-OLL-IMGs\\Pi.png', algorithm:"R U2 R2 U' R2 U' R2 U2 R"},
    {name: 'Sune', type: 'corners', src:'Two-Look-OLL-IMGs\\Sune.png', algorithm:"R U R' U R U2 R'"},
    {name: 'T', type: 'corners', src:'Two-Look-OLL-IMGs\\T.png', algorithm:"r U R' U' r' F R F'"},
    {name: 'U', type: 'corners', src:'Two-Look-OLL-IMGs\\U.png', algorithm:"R2 D R' U2 R D' R' U2 R'"},
];

const twoLookOLLAlgorithmsTypes = ['edges', 'corners'];

const twoLookPLLAlgorithms = [
    {name: 'Diagonal', type: 'corners', src:'Two-Look-PLL-IMGs\\Diagonal.png', algorithm:"F R U' R' U' R U R' F' R U R' U' R' F R F'"},
    {name: 'Headlights', type: 'corners', src:'Two-Look-PLL-IMGs\\Headlights.png', algorithm:"R U R' U' R' F R2 U' R' U' R U R' F'"},
    {name: 'H', type: 'edges', src:'Two-Look-PLL-IMGs\\H.png', algorithm:"M2 U M2 U2 M2 U M2"},
    {name: 'Ua', type: 'edges', src:'Two-Look-PLL-IMGs\\Ua.png', algorithm:"R U' R U R U R U' R' U' R2"},
    {name: 'Ub', type: 'edges', src:'Two-Look-PLL-IMGs\\Ub.png', algorithm:"R2 U R U R' U' R' U' R' U R'"},
    {name: 'Z', type: 'edges', src:'Two-Look-PLL-IMGs\\Z.png', algorithm:"M2 U M2 U M' U2 M2 U2 M' U2"},
];

const twoLookPLLAlgorithmsTypes = ['edges', 'corners'];

// Appearance value is an array of the form [[stickers of yellow face], [stickers of blue face (on yellow edge)], [stickers of orange face] , [stickers of green face] , [stickers of red face]]
// Where a 1 is a yellow sticker and a 0 is a non-yellow sticker
const oneLookOLLAlgorithms = [
    {name: 'solved', algorithm: '', appearance: [[1,1,1,1,1,1,1,1,1],[0,0,0],[0,0,0],[0,0,0],[0,0,0]]},
    {name: 'Awkward Shape 1', type: 'awkward-shape', src:'One-Look-OLL-IMGs\\Awkward-1.png', algorithm:"R U R' U' R U' R' F' U' F R U R'", appearance: [[0,1,1,1,1,0,0,0,1],[0,1,0],[0,1,1],[0,0,0],[1,0,0]]},
    {name: 'Awkward Shape 2', type: 'awkward-shape', src:'One-Look-OLL-IMGs\\Awkward-2.png', algorithm:"F R' F R2 U' R' U' R U R' F2", appearance: [[0,1,0,1,1,0,1,0,1],[1,1,0],[0,1,0],[0,0,1],[0,0,0]]},
    {name: 'Awkward Shape 3', type: 'awkward-shape', src:'One-Look-OLL-IMGs\\Awkward-3.png', algorithm:"R U R' U R U2 R' F R U R' U' F'", appearance: [[0,1,0,1,1,0,1,0,1],[0,1,0],[0,1,0],[0,0,0],[1,0,1]]},
    {name: 'Awkward Shape 4', type: 'awkward-shape', src:'One-Look-OLL-IMGs\\Awkward-4.png', algorithm:"R' U' R U' R' U2 R F R U R' U' F'", appearance: [[1,0,1,1,1,0,0,1,0],[0,1,0],[1,0,1],[0,0,0],[0,1,0]]},
    {name: 'Big Bolt 1', type: 'big-bolt', src:'One-Look-OLL-IMGs\\Big-Bolt-1.png', algorithm:"L F' L' U' L U F U' L'", appearance: [[0,0,1,1,1,1,1,0,0],[0,0,1],[0,1,0],[0,0,0],[1,1,0]]},
    {name: 'Big Bolt 2', type: 'big-bolt', src:'One-Look-OLL-IMGs\\Big-Bolt-2.png', algorithm:"R' F R U R' U' F' U R", appearance: [[1,0,0,1,1,1,0,0,1],[0,0,0],[0,1,0],[1,0,0],[0,1,1]]},
    {name: 'C Shape 1', type: 'c-shape', src:'One-Look-OLL-IMGs\\C-1.png', algorithm:"R U R2 U' R' F R U R U' F'", appearance: [[0,0,0,1,1,1,1,0,1],[1,0,0],[0,1,0],[0,0,1],[0,1,0]]},
    {name: 'C Shape 2', type: 'c-shape', src:'One-Look-OLL-IMGs\\C-2.png', algorithm:"R' U' R' F R F' U R", appearance: [[1,1,0,0,1,0,1,1,0],[1,1,1],[0,0,0],[0,1,0],[0,0,0]]},
    {name: 'Corners Oriented 1', type: 'corners-oriented', src:'One-Look-OLL-IMGs\\Corners-Oriented-1.png', algorithm:"r U R' U' r' R U R U' R'", appearance: [[1,1,1,1,1,0,1,0,1],[0,1,0],[0,1,0],[0,0,0],[0,0,0]]},
    {name: 'Corners Oriented 2', type: 'corners-oriented', src:'One-Look-OLL-IMGs\\Corners-Oriented-2.png', algorithm:"R U R' U' M' U R U' r'", appearance: [[1,0,1,1,1,1,1,0,1],[0,0,0],[0,1,0],[0,0,0],[0,1,0]]},
    {name: 'Cross 1', type: 'cross', src:'One-Look-OLL-IMGs\\Cross-1.png', algorithm:"R U R' U R U' R' U R U2 R'", appearance: [[0,1,0,1,1,1,0,1,0],[1,0,1],[0,0,0],[1,0,1],[0,0,0]]},
    {name: 'Cross 2', type: 'cross', src:'One-Look-OLL-IMGs\\Cross-2.png', algorithm:"R U2 R2 U' R2 U' R2 U2 R", appearance: [[0,1,0,1,1,1,0,1,0],[0,0,0],[1,0,0],[1,0,1],[0,0,1]]},
    {name: 'Cross 3', type: 'cross', src:'One-Look-OLL-IMGs\\Cross-3.png', algorithm:"R2 D R' U2 R D' R' U2 R'", appearance: [[1,1,1,1,1,1,0,1,0],[0,0,0],[1,0,1],[0,0,0],[0,0,0]]},
    {name: 'Cross 4', type: 'cross', src:'One-Look-OLL-IMGs\\Cross-4.png', algorithm:"r U R' U' r' F R F'", appearance: [[0,1,1,1,1,1,0,1,1],[0,0,0],[0,0,1],[0,0,0],[1,0,0]]},
    {name: 'Cross 5', type: 'cross', src:'One-Look-OLL-IMGs\\Cross-5.png', algorithm:"F R' F' r U R U' r'", appearance: [[1,1,0,1,1,1,0,1,1],[1,0,0],[0,0,1],[0,0,0],[0,0,0]]},
    {name: 'Cross 6', type: 'cross', src:'One-Look-OLL-IMGs\\Cross-6.png', algorithm:"R U2 R' U' R U' R'", appearance: [[0,1,1,1,1,1,0,1,0],[0,0,1],[0,0,1],[0,0,1],[0,0,0]]},
    {name: 'Cross 7', type: 'cross', src:'One-Look-OLL-IMGs\\Cross-7.png', algorithm:"R U R' U R U2 R'", appearance: [[0,1,0,1,1,1,1,1,0],[1,0,0],[1,0,0],[0,0,0],[1,0,0]]},
    {name: 'Dot 1', type: 'dot', src:'One-Look-OLL-IMGs\\Dot-1.png', algorithm:"R U2 R2 F R F' U2 R' F R F'", appearance: [[0,0,0,0,1,0,0,0,0],[1,1,1],[0,1,0],[1,1,1],[0,1,0]]},
    {name: 'Dot 2', type: 'dot', src:'One-Look-OLL-IMGs\\Dot-2.png', algorithm:"r U r' U2 r U2 R' U2 R U' r'", appearance: [[0,0,0,0,1,0,0,0,0],[0,1,1],[0,1,0],[1,1,0],[1,1,1]]},
    {name: 'Dot 3', type: 'dot', src:'One-Look-OLL-IMGs\\Dot-3.png', algorithm:"r' R2 U R' U r U2 r' U M'", appearance: [[0,0,0,0,1,0,1,0,0],[1,1,0],[1,1,0],[0,1,0],[1,1,0]]},
    {name: 'Dot 4', type: 'dot', src:'One-Look-OLL-IMGs\\Dot-4.png', algorithm:"M U' r U2 r' U' R U' R' M'", appearance: [[0,0,0,0,1,0,0,0,1],[0,1,0],[0,1,1],[0,1,1],[0,1,1]]},
    {name: 'Dot 5', type: 'dot', src:'One-Look-OLL-IMGs\\Dot-5.png', algorithm:"F R' F' R2 r' U R U' R' U' M'", appearance: [[1,0,0,0,1,0,0,0,1],[1,1,0],[0,1,1],[0,1,0],[0,1,0]]},
    {name: 'Dot 6', type: 'dot', src:'One-Look-OLL-IMGs\\Dot-6.png', algorithm:"r U R' U R U2 r2 U' R U' R' U2 r", appearance: [[1,0,1,0,1,0,0,0,0],[0,1,0],[1,1,1],[0,1,0],[0,1,0]]},
    {name: 'Dot 7', type: 'dot', src:'One-Look-OLL-IMGs\\Dot-7.png', algorithm:"r' R U R U R' U' M' R' F R F'", appearance: [[1,0,1,0,1,0,0,0,0],[0,1,1],[0,1,0],[1,1,0],[0,1,0]]},
    {name: 'Dot 8', type: 'dot', src:'One-Look-OLL-IMGs\\Dot-8.png', algorithm:"r U R' U' M2 U R U' R' U' M'", appearance: [[1,0,1,0,1,0,1,0,1],[0,1,0],[0,1,0],[0,1,0],[0,1,0]]},
    {name: 'Fish 1', type: 'fish', src:'One-Look-OLL-IMGs\\Fish-1.png', algorithm:"R U R' U' R' F R2 U R' U' F'", appearance: [[0,1,0,1,1,0,0,0,1],[0,1,0],[0,1,1],[0,0,1],[0,0,1]]},
    {name: 'Fish 2', type: 'fish', src:'One-Look-OLL-IMGs\\Fish-2.png', algorithm:"R U R' U R' F R F' R U2 R'", appearance: [[0,0,1,1,1,0,0,1,0],[0,1,0],[1,0,0],[1,0,0],[1,1,0]]},
    {name: 'Fish 3', type: 'fish', src:'One-Look-OLL-IMGs\\Fish-3.png', algorithm:"R U2 R2 F R F' R U2 R'", appearance: [[1,0,0,0,1,1,0,1,1],[1,0,0],[0,0,1],[0,1,0],[0,1,0]]},
    {name: 'Fish 4', type: 'fish', src:'One-Look-OLL-IMGs\\Fish-4.png', algorithm:"F R' F' R U R U' R'", appearance: [[1,1,0,1,1,0,0,0,1],[1,1,0],[0,1,1],[0,0,0],[0,0,0]]},
    {name: 'I Shape 1', type: 'i-shape', src:'One-Look-OLL-IMGs\\I-1.png', algorithm:"F U R U' R' U R U' R' F'", appearance: [[0,0,0,1,1,1,0,0,0],[1,0,1],[0,1,1],[0,0,0],[1,1,0]]},
    {name: 'I Shape 2', type: 'i-shape', src:'One-Look-OLL-IMGs\\I-2.png', algorithm:"R U R' U R U' B U' B' R'", appearance: [[0,1,0,0,1,0,0,1,0],[1,1,1],[0,0,1],[0,1,0],[1,0,0]]},
    {name: 'I Shape 3', type: 'i-shape', src:'One-Look-OLL-IMGs\\I-3.png', algorithm:"R' F R U R U' R2 F' R2 U' R' U R U R'", appearance: [[0,0,0,1,1,1,0,0,0],[0,0,0],[1,1,1],[0,0,0],[1,1,1]]},
    {name: 'I Shape 4', type: 'i-shape', src:'One-Look-OLL-IMGs\\I-4.png', algorithm:"r' U' r U' R' U R U' R' U R r' U r", appearance: [[0,0,0,1,1,1,0,0,0],[1,0,1],[0,1,0],[1,0,1],[0,1,0]]},
    {name: 'Knight 1', type: 'knight', src:'One-Look-OLL-IMGs\\Knight-1.png', algorithm:"F U R U' R2 F' R U R U' R'", appearance: [[0,0,0,1,1,1,1,0,0],[1,0,0],[1,1,0],[0,0,0],[1,1,0]]},
    {name: 'Knight 2', type: 'knight', src:'One-Look-OLL-IMGs\\Knight-2.png', algorithm:"R' F R U R' F' R F U' F'", appearance: [[0,0,0,1,1,1,0,0,1],[0,0,0],[0,1,1],[0,0,1],[0,1,1]]},
    {name: 'Knight 3', type: 'knight', src:'One-Look-OLL-IMGs\\Knight-3.png', algorithm:"l' U' l L' U' L U l' U l", appearance: [[1,0,0,1,1,1,0,0,0],[1,0,0],[1,1,0],[1,0,0],[0,1,0]]},
    {name: 'Knight 4', type: 'knight', src:'One-Look-OLL-IMGs\\Knight-4.png', algorithm:"r U r' R U R' U' r U' r'", appearance: [[0,0,1,1,1,1,0,0,0],[0,0,1],[0,1,1],[0,0,1],[0,1,0]]},
    {name: 'P Shape 1', type: 'p-shape', src:'One-Look-OLL-IMGs\\P-1.png', algorithm:"R' U' F U R U' R' F' R", appearance: [[0,1,1,0,1,1,0,0,1],[0,0,0],[0,1,1],[0,1,0],[1,0,0]]},
    {name: 'P Shape 2', type: 'p-shape', src:'One-Look-OLL-IMGs\\P-2.png', algorithm:"L U F' U' L' U L F L'", appearance: [[1,1,0,1,1,0,1,0,0],[0,1,0],[1,1,0],[0,0,0],[0,0,1]]},
    {name: 'P Shape 3', type: 'p-shape', src:'One-Look-OLL-IMGs\\P-3.png', algorithm:"F' U' L' U L F", appearance: [[0,1,1,0,1,1,0,0,1],[0,0,0],[0,1,0],[1,1,1],[0,0,0]]},
    {name: 'P Shape 4', type: 'p-shape', src:'One-Look-OLL-IMGs\\P-4.png', algorithm:"F U R U' R' F'", appearance: [[1,1,0,1,1,0,1,0,0],[1,1,1],[0,1,0],[0,0,0],[0,0,0]]},
    {name: 'Small Bolt 1', type: 'small-bolt', src:'One-Look-OLL-IMGs\\Small-Bolt-1.png', algorithm:"r U R' U R U2 r'", appearance: [[0,1,0,1,1,0,1,0,0],[1,1,0],[1,1,0],[0,0,0],[1,0,0]]},
    {name: 'Small Bolt 2', type: 'small-bolt', src:'One-Look-OLL-IMGs\\Small-Bolt-2.png', algorithm:"l' U' L U' L' U2 l", appearance: [[0,1,0,0,1,1,0,0,1],[0,0,0],[0,1,1],[0,1,1],[0,0,1]]},
    {name: 'Small Bolt 3', type: 'small-bolt', src:'One-Look-OLL-IMGs\\Small-Bolt-3.png', algorithm:"r U R' U R' F R F' R U2 r'", appearance: [[0,1,1,1,1,0,0,0,0],[0,1,0],[1,1,0],[1,0,0],[1,0,0]]},
    {name: 'Small Bolt 4', type: 'small-bolt', src:'One-Look-OLL-IMGs\\Small-Bolt-4.png', algorithm:"M' R' U' R U' R' U2 R U' R r'", appearance: [[1,1,0,0,1,1,0,0,0],[0,0,1],[0,1,1],[0,1,0],[0,0,1]]},
    {name: 'Small L 1', type: 'small-l', src:'One-Look-OLL-IMGs\\Small-L-1.png', algorithm:"R' U' R' F R F' R' F R F' U R", appearance: [[0,1,0,0,1,1,0,0,0],[1,0,1],[0,1,1],[0,1,0],[1,0,0]]},
    {name: 'Small L 2', type: 'small-l', src:'One-Look-OLL-IMGs\\Small-L-2.png', algorithm:"F R U R' U' R U R' U' F'", appearance: [[0,1,0,1,1,0,0,0,0],[0,1,0],[1,1,0],[1,0,1],[0,0,1]]},
    {name: 'Small L 3', type: 'small-l', src:'One-Look-OLL-IMGs\\Small-L-3.png', algorithm:"r U' r2 U r2 U r2 U' r", appearance: [[0,1,0,0,1,1,0,0,0],[0,0,0],[1,1,0],[1,1,1],[0,0,1]]},
    {name: 'Small L 4', type: 'small-l', src:'One-Look-OLL-IMGs\\Small-L-4.png', algorithm:"r' U r2 U' r2 U' r2 U r'", appearance: [[0,0,0,0,1,1,0,1,0],[0,0,0],[1,0,0],[1,1,1],[0,1,1]]},
    {name: 'Small L 5', type: 'small-l', src:'One-Look-OLL-IMGs\\Small-L-5.png', algorithm:"l' U2 L U L' U' L U L' U l", appearance: [[0,1,0,0,1,1,0,0,0],[0,0,0],[1,1,1],[0,1,0],[1,0,1]]},
    {name: 'Small L 6', type: 'small-l', src:'One-Look-OLL-IMGs\\Small-L-6.png', algorithm:"r U2 R' U' R U R' U' R U' r'", appearance: [[0,1,0,1,1,0,0,0,0],[0,1,0],[1,1,1],[0,0,0],[1,0,1]]},
    {name: 'Square 1', type: 'square', src:'One-Look-OLL-IMGs\\Square-1.png', algorithm:"l' U2 L U L' U l", appearance: [[1,1,0,1,1,0,0,0,0],[1,1,0],[1,1,0],[1,0,0],[0,0,0]]},
    {name: 'Square 2', type: 'square', src:'One-Look-OLL-IMGs\\Square-2.png', algorithm:"r U2 R' U' R U' r'", appearance: [[0,1,1,0,1,1,0,0,0],[0,0,1],[0,1,1],[0,1,1],[0,0,0]]},
    {name: 'T Shape 1', type: 't-shape', src:'One-Look-OLL-IMGs\\T-1.png', algorithm:"R U R' U' R' F R F'", appearance: [[0,0,1,1,1,1,0,0,1],[0,0,0],[0,1,1],[0,0,0],[1,1,0]]},
    {name: 'T Shape 2', type: 't-shape', src:'One-Look-OLL-IMGs\\T-2.png', algorithm:"F R U R' U' F'", appearance: [[0,0,1,1,1,1,0,0,1],[0,0,0],[0,1,0],[1,0,1],[0,1,0]]},
    {name: 'W Shape 1', type: 'w-shape', src:'One-Look-OLL-IMGs\\W-1.png', algorithm:"L' U' L U' L' U L U L F' L' F", appearance: [[1,1,0,0,1,1,0,0,1],[0,0,0],[0,1,0],[1,1,0],[0,0,1]]},
    {name: 'W Shape 2', type: 'w-shape', src:'One-Look-OLL-IMGs\\W-2.png', algorithm:"R U R' U R U' R' U' R' F R F'", appearance: [[0,1,1,1,1,0,1,0,0],[0,1,1],[0,1,0],[0,0,0],[1,0,0]]},
];

const oneLookOLLAlgorithmsTypes = ['awkward-shape', 'big-bolt', 'c-shape', 'corners-oriented', 'cross', 'dot', 'fish', 'i-shape', 'knight', 'p-shape', 'small-bolt', 'small-l', 'square', 't-shape', 'w-shape'];

// Appearance value is an array of the form [[stickers of blue face (on yellow edge)], [stickers of orange face] , [stickers of green face] , [stickers of red face]]
// Where a 4 = blue sticker, 5 = orange, 2 = green, 0 = red
const oneLookPLLAlgorithms = [
    {name: 'solved', algorithm: '', appearance: [[4,4,4],[5,5,5],[2,2,2],[0,0,0]]},
    {name: 'F', type: 'adj-corner-swap', src:'One-Look-PLL-IMGs\\F.png', algorithm:"R' U' F' R U R' U' R' F R2 U' R' U' R U R' U R", appearance: [[3, 2, 4], [5, 5, 5], [2, 4, 0], [4, 0, 2]]},
    {name: 'Ga', type: 'adj-corner-swap', src:'One-Look-PLL-IMGs\\Ga.png', algorithm:"R2 U R' U R' U' R U' R2 U' D R' U R D'", appearance: [[0, 0, 4], [5, 2, 5], [2, 4, 0], [4, 5, 2]]},
    {name: 'Gb', type: 'adj-corner-swap', src:'One-Look-PLL-IMGs\\Gb.png', algorithm:"R' U' R U D' R2 U R' U R U' R U' R2 D", appearance: [[0, 2, 4], [5, 0, 5], [2, 5, 0], [4, 4, 2]]},
    {name: 'Gc', type: 'adj-corner-swap', src:'One-Look-PLL-IMGs\\Gc.png', algorithm:"R2 U' R U' R U R' U R2 U D' R U' R' D", appearance: [[0, 2, 4], [5, 4, 5], [2, 0, 0], [4, 5, 2]]},
    {name: 'Gd', type: 'adj-corner-swap', src:'One-Look-PLL-IMGs\\Gd.png', algorithm:"R U R' U' D R2 U' R U' R' U R' U R2 D'", appearance: [[0, 5, 4], [5, 0, 5], [2, 4, 0], [4, 2, 2]]},
    {name: 'Ja', type: 'adj-corner-swap', src:'One-Look-PLL-IMGs\\Ja.png', algorithm:"x R2 F R F' R U2 r' U r U2 x'", appearance: [[0, 4, 4], [5, 5, 5], [2, 0, 0], [4, 2, 2]]},
    {name: 'Jb', type: 'adj-corner-swap', src:'One-Look-PLL-IMGs\\Jb.png', algorithm:"R U R' F' R U R' U' R' F R2 U' R'", appearance: [[0, 0, 4], [5, 5, 5], [2, 2, 0], [4, 4, 2]]},
    {name: 'Ra', type: 'adj-corner-swap', src:'One-Look-PLL-IMGs\\Ra.png', algorithm:"R U' R' U' R U R D R' U' R D' R' U2 R'", appearance: [[0, 4, 4], [5, 2, 5], [2, 5, 0], [4, 0, 2]]},
    {name: 'Rb', type: 'adj-corner-swap', src:'One-Look-PLL-IMGs\\Rb.png', algorithm:"R2 F R U R U' R' F' R U2 R' U2 R", appearance: [[0, 5, 4], [5, 4, 5], [2, 2, 0], [4, 0, 2]]},
    {name: 'T', type: 'adj-corner-swap', src:'One-Look-PLL-IMGs\\T.png', algorithm:"R U R' U' R' F R2 U' R' U' R U R' F'", appearance: [[0, 4, 4], [5, 0, 5], [2, 2, 0], [4, 5, 2]]},
    {name: 'Na', type: 'diag-corner-swap', src:'One-Look-PLL-IMGs\\Na.png', algorithm:"R U R' U R U R' F' R U R' U' R' F R2 U' R' U2 R U' R'", appearance: [[4, 4, 2], [0, 0, 5], [2, 2, 4], [5, 5, 0]]},
    {name: 'Nb', type: 'diag-corner-swap', src:'One-Look-PLL-IMGs\\Nb.png', algorithm:"R' U R U' R' F' U' F R U R' F R' F' R U' R", appearance: [[2, 4, 4], [5, 0, 0], [4, 2, 2], [0, 5, 5]]},
    {name: 'V', type: 'diag-corner-swap', src:'One-Look-PLL-IMGs\\V.png', algorithm:"R' U R' U' y R' F' R2 U' R' U R' F R F y'", appearance: [[2, 4, 4], [5, 5, 0], [4, 0, 2], [0, 2, 5]]},
    {name: 'Y', type: 'diag-corner-swap', src:'One-Look-PLL-IMGs\\Y.png', algorithm:"F R U' R' U' R U R' F' R U R' U' R' F R F'", appearance: [[2, 4, 4], [5, 2, 0], [4, 5, 2], [0, 0, 5]]},
    {name: 'Aa', type: 'corners-only', src:'One-Look-PLL-IMGs\\Aa.png', algorithm:"x R' U R' D2 R U' R' D2 R2 x'", appearance: [[2, 4, 4], [5, 5, 2], [0, 2, 0], [4, 0, 5]]},
    {name: 'Ab', type: 'corners-only', src:'One-Look-PLL-IMGs\\Ab.png', algorithm:"x R2 D2 R U R' D2 R U' R x'", appearance: [[0, 4, 4], [5, 5, 0], [4, 2, 5], [2, 0, 2]]},
    {name: 'E', type: 'corners-only', src:'One-Look-PLL-IMGs\\E.png', algorithm:"x' R U' R' D R U R' D' R U R' D R U' R' D' x", appearance: [[0, 4, 5], [2, 5, 4], [5, 2, 0], [4, 0, 2]]},
    {name: 'H', type: 'edges-only', src:'Two-Look-PLL-IMGs\\H.png', algorithm:"M2 U M2 U2 M2 U M2" , appearance: [[4, 2, 4], [5, 0, 5], [2, 4, 2], [0, 5, 0]]},
    {name: 'Ua', type: 'edges-only', src:'Two-Look-PLL-IMGs\\Ua.png', algorithm:"R U' R U R U R U' R' U' R2", appearance: [[4, 0, 4], [5, 4, 5], [2, 2, 2], [0, 5, 0]]},
    {name: 'Ub', type: 'edges-only', src:'Two-Look-PLL-IMGs\\Ub.png', algorithm:"R2 U R U R' U' R' U' R' U R'" , appearance: [[4, 5, 4], [5, 0, 5], [2, 2, 2], [0, 4, 0]]},
    {name: 'Z', type: 'edges-only', src:'Two-Look-PLL-IMGs\\Z.png', algorithm:"M2 U M2 U M' U2 M2 U2 M' U2", appearance: [[4, 0, 4], [5, 2, 5], [2, 5, 2], [0, 4, 0]]},
];

const oneLookPLLAlgorithmsTypes = ['adj-corner-swap', 'diag-corner-swap', 'corners-only', 'edges-only'];

// Data for solver page

const validEdges = [
    '01', '10', '02', '20', '03', '30', '04', '40',
    '14', '41', '12', '21', '23', '32', '34', '43',
    '51', '15', '52', '25', '53', '35', '54', '45'
]

const validCorners = [
    '014', '021', '032', '043', '541', '512', '523', '534',
    '140', '210', '320', '430', '415', '125', '235', '345',
    '401', '102', '203', '304', '154', '251', '352', '453'
]