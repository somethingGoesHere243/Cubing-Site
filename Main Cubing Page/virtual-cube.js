const virtualCubeCanvas = document.getElementById('virtual-cube-canvas');

const rotateFBtn = document.getElementById('rotate-F');
const rotateBBtn = document.getElementById('rotate-B');
const rotateUBtn = document.getElementById('rotate-U');
const rotateDBtn = document.getElementById('rotate-D');
const rotateLBtn = document.getElementById('rotate-L');
const rotateRBtn = document.getElementById('rotate-R');
const changeDirectionBtn = document.getElementById('change-direction');

const context = virtualCubeCanvas.getContext('2d');
// Store dimenions of canvas
const height = virtualCubeCanvas.height
const width = virtualCubeCanvas.width

// 2D vector/point
class Point2D {
    constructor(x,y) {
        this.x = x;
        this.y = y;
    }
}

// 3D vector/point
class Point3D {
    constructor(x,y,z) {
        this.x = x;
        this.y = y;
        this.z = z;
    }
}

// Cube centered at (x,y,z) with side length "size" and face colors specified by array "colors"
class Cube {
    constructor(x,y,z, size, colors) {
        this.size = size
        
        // List of vertices [FUL, FUR, FDR, FDL, BUL, BUR, BDR, BDL]
        this.vertices = [new Point3D(x-0.5*size, y-0.5*size, z-0.5*size),
                        new Point3D(x+0.5*size, y-0.5*size, z-0.5*size),
                        new Point3D(x+0.5*size, y+0.5*size, z-0.5*size),
                        new Point3D(x-0.5*size, y+0.5*size, z-0.5*size),
                        new Point3D(x-0.5*size, y-0.5*size, z+0.5*size),
                        new Point3D(x+0.5*size, y-0.5*size, z+0.5*size),
                        new Point3D(x+0.5*size, y+0.5*size, z+0.5*size),
                        new Point3D(x-0.5*size, y+0.5*size, z+0.5*size)];

        // List of faces [front, up, right, back, down, left] 
        this.faces = [[0,1,2,3], [0,4,5,1], [1,5,6,2], [4,7,6,5], [3,2,6,7], [0,3,7,4]];

        // List of colors of faces [front, up, right, back, down, left] 
        this.colors = colors
    };

    // Function to get the current center of cube
    getCenter() {
        const vertex = this.vertices[0];
        const oppositeVertex = this.vertices[6];
        return new Point3D((vertex.x + oppositeVertex.x) / 2, (vertex.y + oppositeVertex.y) / 2, (vertex.z + oppositeVertex.z) / 2)
    }
    
    // Function to rotate cube around the x axis by a specified angle about a specified center of rotation
    rotateX(radian, rotationOrigin) {
        const cosine = Math.cos(radian);
        const sine = Math.sin(radian);

        // Rotate each vertex seperately
        for (let index = 0; index<this.vertices.length; index++) {
            let p = this.vertices[index];
            let y = (p.y - rotationOrigin.y) * cosine - (p.z - rotationOrigin.z) * sine + rotationOrigin.y;
            let z = (p.y - rotationOrigin.y) * sine + (p.z -rotationOrigin.z) * cosine + rotationOrigin.z;
        
            p.y = y ;
            p.z = z ;        
        };
    };
    
    // Function to rotate cube around the y axis by a specified angle about a specified center of rotation
    rotateY(radian, rotationOrigin) {
        const cosine = Math.cos(radian);
        const sine = Math.sin(radian);

        // Rotate each vertex seperately
        for (let index = 0; index<this.vertices.length; index++) {
            let p = this.vertices[index];
            let x = (p.x - rotationOrigin.x) * cosine + (p.z- rotationOrigin.z) * sine + rotationOrigin.x;
            let z = -(p.x - rotationOrigin.x) * sine + (p.z - rotationOrigin.z) * cosine + rotationOrigin.z;

            p.x = x ;
            p.z = z ;
        }
    };

    // Function to rotate cube around a given axis (with unit vector u) by a specified angle about a specified center of rotation
    rotateAroundAxis(radian, rotationOrigin, u) {
        const cosine = Math.cos(radian);
        const sine = Math.sin(radian);
        
        // Rotation Matrix about (0,0,0)
        const rotationMatrix = [[(u.x**2)*(1-cosine)+cosine, u.x * u.y * (1-cosine) - u.z * sine, u.x * u.z * (1-cosine) + u.y * sine, 0], 
                                [u.x * u.y * (1-cosine) + u.z * sine, (u.y**2)*(1-cosine)+cosine, u.y * u.z * (1-cosine) - u.x * sine, 0], 
                                [u.x * u.z * (1-cosine) - u.y * sine, u.y * u.z * (1-cosine) + u.x * sine, (u.z**2)*(1-cosine)+cosine, 0], 
                                [0, 0, 0, 1]];
        // Translation Matrices to shift rotationOrigin to and from (0,0,0)
        const translationMatrixOne = [[1, 0, 0, -rotationOrigin.x], [0, 1, 0, -rotationOrigin.y], [0, 0, 1, -rotationOrigin.z], [0, 0, 0, 1]];
        const translationMatrixTwo = [[1, 0, 0, rotationOrigin.x], [0, 1, 0, rotationOrigin.y], [0, 0, 1, rotationOrigin.z], [0, 0, 0, 1]];

        const adjustedRotationMatrix = matrixMult(translationMatrixTwo, matrixMult(rotationMatrix, translationMatrixOne));

        // Apply transformation to cube vertices
        for (let index = 0; index<this.vertices.length; index++) {
            let p = this.vertices[index];
            const homogenousCoordinates = [[p.x], [p.y], [p.z], [1]];
            const rotatedCoordinates = matrixMult(adjustedRotationMatrix, homogenousCoordinates);
            p.x = rotatedCoordinates[0][0];
            p.y = rotatedCoordinates[1][0];
            p.z = rotatedCoordinates[2][0];
        }
    }
}
    
// Define all smaller cubes which will make up the rubiks cube
const cube1 = new Cube(-40, -40, 160, 40, ['green', 'white', 'black', 'black', 'black', 'orange']);
const cube2 = new Cube(-40, 0, 160, 40, ['green', 'black', 'black', 'black', 'black', 'orange']);
const cube3 = new Cube(-40, 40, 160, 40, ['green', 'black', 'black', 'black', 'yellow', 'orange']);
const cube4 = new Cube(0, -40, 160, 40, ['green', 'white', 'black', 'black', 'black', 'black']);
const cube5 = new Cube(0, 0, 160, 40, ['green', 'black', 'black', 'black', 'black', 'black']);
const cube6 = new Cube(0, 40, 160, 40, ['green', 'black', 'black', 'black', 'yellow', 'black']);
const cube7 = new Cube(40, -40, 160, 40, ['green', 'white', 'red', 'black', 'black', 'black']);
const cube8 = new Cube(40, 0, 160, 40, ['green', 'black', 'red', 'black', 'black', 'black']);
const cube9 = new Cube(40, 40, 160, 40, ['green', 'black', 'red', 'black', 'yellow', 'black']);
const cube10 = new Cube(-40, -40, 200, 40, ['black', 'white', 'black', 'black', 'black', 'orange']);
const cube11 = new Cube(-40, 0, 200, 40, ['black', 'black', 'black', 'black', 'black', 'orange']);
const cube12 = new Cube(-40, 40, 200, 40, ['black', 'black', 'black', 'black', 'yellow', 'orange']);
const cube13 = new Cube(0, -40, 200, 40, ['black', 'white', 'black', 'black', 'black', 'black']);
const cube14 = new Cube(0, 0, 200, 40, ['black', 'black', 'black', 'black', 'black', 'black']);
const cube15 = new Cube(0, 40, 200, 40, ['black', 'black', 'black', 'black', 'yellow', 'black']);
const cube16 = new Cube(40, -40, 200, 40, ['black', 'white', 'red', 'black', 'black', 'black']);
const cube17 = new Cube(40, 0, 200, 40, ['black', 'black', 'red', 'black', 'black', 'black']);
const cube18 = new Cube(40, 40, 200, 40, ['black', 'black', 'red', 'black', 'yellow', 'black']);
const cube19 = new Cube(-40, -40, 240, 40, ['black', 'white', 'black', 'blue', 'black', 'orange']);
const cube20 = new Cube(-40, 0, 240, 40, ['black', 'black', 'black', 'blue', 'black', 'orange']);
const cube21 = new Cube(-40, 40, 240, 40, ['black', 'black', 'black', 'blue', 'yellow', 'orange']);
const cube22 = new Cube(0, -40, 240, 40, ['black', 'white', 'black', 'blue', 'black', 'black']);
const cube23 = new Cube(0, 0, 240, 40, ['black', 'black', 'black', 'blue', 'black', 'black']);
const cube24 = new Cube(0, 40, 240, 40, ['black', 'black', 'black', 'blue', 'yellow', 'black']);
const cube25 = new Cube(40, -40, 240, 40, ['black', 'white', 'red', 'blue', 'black', 'black']);
const cube26 = new Cube(40, 0, 240, 40, ['black', 'black', 'red', 'blue', 'black', 'black']);
const cube27 = new Cube(40, 40, 240, 40, ['black', 'black', 'red', 'blue', 'yellow', 'black']);
const cubes = [cube1, cube2, cube3, cube4, cube5, cube6, cube7, cube8, cube9, cube10, cube11, cube12, cube13, cube14, cube15, cube16, cube17, cube18, cube19, cube20, cube21, cube22, cube23, cube24, cube25, cube26, cube27];

// Define constant center of rubiks cube
const rubiksCubeCenter = new Point3D(0,0,200);

// Define faces of cube
let frontFace = [cube1, cube2, cube3, cube4, cube5, cube6, cube7, cube8, cube9];
let backFace = [cube19, cube20, cube21, cube22, cube23, cube24, cube25, cube26, cube27];
let leftFace = [cube1, cube2, cube3, cube10, cube11, cube12, cube19, cube20, cube21];
let rightFace = [cube7, cube8, cube9, cube16, cube17, cube18, cube25, cube26, cube27];
let upFace = [cube1, cube4, cube7, cube10, cube13, cube16, cube19, cube22, cube25];
let downFace = [cube3, cube6, cube9, cube12, cube15, cube18, cube21, cube24, cube27];

const virtualCubeFaces = [frontFace, upFace, rightFace, backFace, downFace, leftFace];

// Keep track of mouse movement for camera controls
let currMouse = new Point2D(-1, -1);
let currMouseVelocity = new Point2D(0, 0);
let timeSinceMouseMovement = 2;

// Add flag to check if user wants to rotate the cube
let isRotating = false;

// Store the face of the cube which is currently rotating (if it exists)
let faceRotating = null;
let rotatingFaceVertices = [];

// Add flag to check if user is attempting to rotate a face ACW
let rotateACW = false;

// Function to multiply 2 matrices together
const matrixMult = (A,B) => {
    const Ans = [];
    for (let i=0; i<A.length; i++) {
        Ans.push([]);
        for (let j=0; j<A[0].length; j++) {
            let newEntry = 0;
            for (let k=0; k<A.length; k++) {
                newEntry += A[i][k] * B[k][j];
            }
            Ans[i].push(newEntry);
        }
    }
    return Ans
}

// Function to rotate specified face of cube in specified direction
const rotationLoop = (isAntiClockWise) => {
    // Alter to always match center of cube 5
    const centerOfRotation = faceRotating[4].getCenter();
    // Find axis around which rotation should occur
    let rotationAxis = new Point3D(rubiksCubeCenter.x - centerOfRotation.x, rubiksCubeCenter.y - centerOfRotation.y, rubiksCubeCenter.z - centerOfRotation.z)
    // Normalise rotationAxis
        const normalisingFactor = Math.sqrt((rotationAxis.x ** 2 + rotationAxis.y ** 2 + rotationAxis.z ** 2))
    if (isAntiClockWise) {
        rotationAxis = new Point3D(-rotationAxis.x / normalisingFactor, -rotationAxis.y / normalisingFactor, -rotationAxis.z / normalisingFactor)
    } else {
        rotationAxis = new Point3D(rotationAxis.x / normalisingFactor, rotationAxis.y / normalisingFactor, rotationAxis.z / normalisingFactor)
    }
    for(const cube of faceRotating ) {
    cube.rotateAroundAxis(Math.PI / 24, centerOfRotation, rotationAxis);
    }
    rotationStepsTaken += 1;
    if (rotationStepsTaken < 12) {
        requestAnimationFrame(() => {rotationLoop(isAntiClockWise)});
    } else {
        faceRotating = null;
    }
}

// Function to project a set of 3D points onto the 2d canvas
const project = (points3d, width, height) => {

    const points2d = new Array(points3d.length);

    //  Distance of camera from screen being projected onto
    const focal_length = 200;
    
    for (let index = 0; index<points3d.length; index++) {
        let p = points3d[index];

        let x = p.x * (focal_length / (p.z) ) + width * 0.5;
        let y = p.y * (focal_length / (p.z)) + height * 0.5;

        points2d[index] = new Point2D(x,y);
    }
    
    return points2d;
}

// Functions to move individual cubes around faces when a specific face is rotated
const rotateF = () => {
    // Rotate cubes of the front face
    frontFace = [frontFace[2], frontFace[5], frontFace[8], frontFace[1], frontFace[4], frontFace[7], frontFace[0], frontFace[3], frontFace[6]];
    virtualCubeFaces[0] = frontFace;

    for (const cube of frontFace) {
        // Reorder vertices array
        cube.vertices = [cube.vertices[3], cube.vertices[0], cube.vertices[1], cube.vertices[2], cube.vertices[7], cube.vertices[4], cube.vertices[5], cube.vertices[6]];
        // Reorder colors array
        cube.colors = [cube.colors[0], cube.colors[5], cube.colors[1], cube.colors[3], cube.colors[2], cube.colors[4]];
    }

    // Store a copy of the cubes on the front-up edge
    const savedUpFace = [upFace[0], upFace[1], upFace[2]];
    // Replace front-up edge with front-left edge
    upFace[0] = leftFace[2];
    upFace[1] = leftFace[1];
    upFace[2] = leftFace[0];
    // Replace front-left edge with front-down edge
    leftFace[0] = downFace[0];
    leftFace[1] = downFace[1];
    leftFace[2] = downFace[2];
    // Replace front-down edge with front-right edge
    downFace[0] = rightFace[2];
    downFace[1] = rightFace[1];
    downFace[2] = rightFace[0];
    // Replace front-right edge with front-up edge
    rightFace[0] = savedUpFace[0];
    rightFace[1] = savedUpFace[1];
    rightFace[2] = savedUpFace[2];
}
const rotateB = () => {
    // Rotate cubes of the back face
    backFace = [backFace[6], backFace[3], backFace[0], backFace[7], backFace[4], backFace[1], backFace[8], backFace[5], backFace[2]];
    virtualCubeFaces[3] = backFace;

    for (const cube of backFace) {
        // Reorder vertices array
        cube.vertices = [cube.vertices[1], cube.vertices[2], cube.vertices[3], cube.vertices[0], cube.vertices[5], cube.vertices[6], cube.vertices[7], cube.vertices[4]];
        // Reorder colors array
        cube.colors = [cube.colors[0], cube.colors[2], cube.colors[4], cube.colors[3], cube.colors[5], cube.colors[1]];
    }

    // Store a copy of the back-up edge
    const savedUpFace = [upFace[6], upFace[7], upFace[8]];
    // Replace back-up edge with back-right edge
    upFace[6] = rightFace[6];
    upFace[7] = rightFace[7];
    upFace[8] = rightFace[8];
    // Replace back-right edge with back-down edge
    rightFace[6] = downFace[8];
    rightFace[7] = downFace[7];
    rightFace[8] = downFace[6];
    // Replace back-down edge with back-left edge
    downFace[6] = leftFace[6];
    downFace[7] = leftFace[7];
    downFace[8] = leftFace[8];
    // Replace back-left edge with back-up edge
    leftFace[6] = savedUpFace[2];
    leftFace[7] = savedUpFace[1];
    leftFace[8] = savedUpFace[0];
}
const rotateL = () => {
    // Rotate cubes of left face
    leftFace = [leftFace[6], leftFace[3], leftFace[0], leftFace[7], leftFace[4], leftFace[1], leftFace[8], leftFace[5], leftFace[2]];
    virtualCubeFaces[5] = leftFace;

    for (const cube of leftFace) {
        // Reorder vertices array
        cube.vertices = [cube.vertices[4], cube.vertices[5], cube.vertices[1], cube.vertices[0], cube.vertices[7], cube.vertices[6], cube.vertices[2], cube.vertices[3]];
        // Reorder colors array
        cube.colors = [cube.colors[1], cube.colors[3], cube.colors[2], cube.colors[4], cube.colors[0], cube.colors[5]];
    }

    // Store a copy of the left-up edge
    const savedUpFace = [upFace[0], upFace[3], upFace[6]];
    // Replace left-up edge with left-back edge
    upFace[0] = backFace[0];
    upFace[3] = backFace[1];
    upFace[6] = backFace[2];
    // Replace left-back edge with left-down edge
    backFace[0] = downFace[6];
    backFace[1] = downFace[3];
    backFace[2] = downFace[0];
    // Replace left-down edge with left-front edge
    downFace[0] = frontFace[0];
    downFace[3] = frontFace[1];
    downFace[6] = frontFace[2];
    // Replace left-front edge with left-up edge
    frontFace[0] = savedUpFace[2];
    frontFace[1] = savedUpFace[1];
    frontFace[2] = savedUpFace[0];
}
const rotateR = () => {
    // Rotate cubes of right face
    rightFace = [rightFace[2], rightFace[5], rightFace[8], rightFace[1], rightFace[4], rightFace[7], rightFace[0], rightFace[3], rightFace[6]];
    virtualCubeFaces[2] = rightFace;

    for (const cube of rightFace) {
        // Reorder vertices array
        cube.vertices = [cube.vertices[3], cube.vertices[2], cube.vertices[6], cube.vertices[7], cube.vertices[0], cube.vertices[1], cube.vertices[5], cube.vertices[4]];
        // Reorder colors array
        cube.colors = [cube.colors[4], cube.colors[0], cube.colors[2], cube.colors[1], cube.colors[3], cube.colors[5]];
    }

    // Store a copy of the right-up edge
    const savedUpFace = [upFace[2], upFace[5], upFace[8]];
    // Replace right-up edge with right-front edge
    upFace[2] = frontFace[8];
    upFace[5] = frontFace[7];
    upFace[8] = frontFace[6];
    // Replace right-front edge with right-down edge
    frontFace[6] = downFace[2];
    frontFace[7] = downFace[5];
    frontFace[8] = downFace[8];
    // Replace right-down edge with right-back edge
    downFace[2] = backFace[8];
    downFace[5] = backFace[7];
    downFace[8] = backFace[6];
    // Replace right-back edge with right-up edge
    backFace[6] = savedUpFace[0];
    backFace[7] = savedUpFace[1];
    backFace[8] = savedUpFace[2];
}
const rotateU = () => {
    // Rotate cubes of up face
    upFace = [upFace[2], upFace[5], upFace[8], upFace[1], upFace[4], upFace[7], upFace[0], upFace[3], upFace[6]];
    virtualCubeFaces[1] = upFace;

    for (const cube of upFace) {
        // Reorder vertices array
        cube.vertices = [cube.vertices[1], cube.vertices[5], cube.vertices[6], cube.vertices[2], cube.vertices[0], cube.vertices[4], cube.vertices[7], cube.vertices[3]];
        // Reorder colors array
        cube.colors = [cube.colors[2], cube.colors[1], cube.colors[3], cube.colors[5], cube.colors[4], cube.colors[0]];
    }

    // Save copy of up-right edge
    const savedRightFace = [rightFace[0], rightFace[3], rightFace[6]];
    // Replace up-right edge with up-back edge
    rightFace[0] = backFace[6];
    rightFace[3] = backFace[3];
    rightFace[6] = backFace[0];
    // Replace up-back edge with up-left edge
    backFace[0] = leftFace[0];
    backFace[3] = leftFace[3];
    backFace[6] = leftFace[6];
    // Replace up-left edge with up-front edge
    leftFace[0] = frontFace[6];
    leftFace[3] = frontFace[3];
    leftFace[6] = frontFace[0];
    // Replace up-front edge with up-right edge
    frontFace[0] = savedRightFace[0];
    frontFace[3] = savedRightFace[1];
    frontFace[6] = savedRightFace[2];
}
const rotateD = () => { 
    // Rotate cubes of down face
    downFace = [downFace[6], downFace[3], downFace[0], downFace[7], downFace[4], downFace[1], downFace[8], downFace[5], downFace[2]];
    virtualCubeFaces[4] = downFace;

    for (const cube of downFace) {
        // Reorder vertices array
        cube.vertices = [cube.vertices[4], cube.vertices[0], cube.vertices[3], cube.vertices[7], cube.vertices[5], cube.vertices[1], cube.vertices[2], cube.vertices[6]];
        // Reorder colors array
        cube.colors = [cube.colors[5], cube.colors[1], cube.colors[0], cube.colors[2], cube.colors[4], cube.colors[3]];
    }

    // Save copy of down-right edge
    const savedRightFace = [rightFace[2], rightFace[5], rightFace[8]];
    // Replace down-right edge with down-front edge
    rightFace[2] = frontFace[2];
    rightFace[5] = frontFace[5];
    rightFace[8] = frontFace[8];
    // Replace down-front edge with down-left edge
    frontFace[2] = leftFace[8];
    frontFace[5] = leftFace[5];
    frontFace[8] = leftFace[2];
    // Replace down-left edge with down-back edge
    leftFace[2] = backFace[2];
    leftFace[5] = backFace[5];
    leftFace[8] = backFace[8];
    // Replace down-back edge with down-right edge
    backFace[2] = savedRightFace[2];
    backFace[5] = savedRightFace[1];
    backFace[8] = savedRightFace[0];
}

// Function to determine if a face of a given cube is facing the camera
const isFacingCamera = (cube, face) => {
    let p1 = cube.vertices[face[0]];
    let p2 = cube.vertices[face[1]];
    let p3 = cube.vertices[face[2]];
        
    let v2 = new Point3D(p2.x - p1.x, p2.y - p1.y, p2.z - p1.z);
    let v1 = new Point3D(p3.x - p1.x, p3.y - p1.y, p3.z - p1.z);

    // Get surface normal to face (using cross product)
    let n = new Point3D(v1.y * v2.z - v1.z * v2.y, v1.z * v2.x - v1.x * v2.z, v1.x * v2.y - v1.y * v2.x);

    return p1.x * n.x + p1.y * n.y + p1.z * n.z <= 0
}

// Function to draw face of cube to canvas
const drawFace = (cube, face) => {
    const vertices = project(cube.vertices, width, height);
    // Only draw face if it is facing the camera 
    if (isFacingCamera(cube, face)) {
        context.beginPath();
        context.moveTo(vertices[face[0]].x, vertices[face[0]].y);
        context.lineTo(vertices[face[1]].x, vertices[face[1]].y);
        context.lineTo(vertices[face[2]].x, vertices[face[2]].y);
        context.lineTo(vertices[face[3]].x, vertices[face[3]].y);
        context.closePath();
        context.fill();
        context.stroke();
    }
}

// Function to draw rubiks cube to screen once each frame
const loop = () => {  
    // Set canvas background to match webpage background
    context.fillStyle = '#c0d6df';
    context.fillRect(0,0,width,height);
    
    // Prepare for outlining cubes of rubiks cube
    context.lineWidth = 1;
    context.strokeStyle = "#000000";

    // Increment timer tracking mouse movement
    timeSinceMouseMovement += 1;

    // Rotate cube based on mouse movement unless a face is currently being rotated
    if (!faceRotating) {
        for (const cube of cubes) {
            if (isRotating && timeSinceMouseMovement < 2) {
                cube.rotateX(currMouseVelocity.y * 0.01, rubiksCubeCenter);
                cube.rotateY(-currMouseVelocity.x * 0.01, rubiksCubeCenter);
            } 
        } 
    }

    // Check if a face is rotating, if it faces away from camera draw this face first
    if (faceRotating) {
        // Find sticker at center of face
        const centerPiece = faceRotating[4];
        const stickerColor = centerPiece.colors.find(color => color !== 'black');
        const stickerIndex = centerPiece.colors.indexOf(stickerColor);
        // Check if face faces away from camera
        if (!isFacingCamera(cube14, cube14.faces[stickerIndex])) {
            for (const cube of faceRotating) {      
                for (let i=0; i<6; i++) {
                    // Set canvas fill colour to match colour of current cube face
                    const faceColor = cube.colors[i]
                    context.fillStyle = faceColor;
                    // Only draw faces which should be visible during the rotation 
                    if (faceColor !== 'black' || Math.abs(stickerIndex - i) === 3) {
                        drawFace(cube, cube.faces[i], faceColor);
                    }
                }
            }
        }
    }
    // Draw all cubes which arent a part of the rotating face
    for (const cube of cubes) {
        if (!faceRotating || !faceRotating.includes(cube)) {   
            for (let i=0; i<6; i++) {
                // Set canvas fill colour to match colour of current cube face
                const faceColor = cube.colors[i]
                context.fillStyle = faceColor;
                // Only draw faces which should be visible
                if (faceColor !== 'black') {
                    drawFace(cube, cube.faces[i], faceColor);
                }
            }
        } 
    }

    // Draw rotating face last if it is facing towards the camera
    if (faceRotating) {
        // Find sticker of center of face
        const centerPiece = faceRotating[4];
        const stickerColor = centerPiece.colors.find(color => color !== 'black');
        const stickerIndex = centerPiece.colors.indexOf(stickerColor);
        // Check if face faces towards camera
        if (isFacingCamera(cube14, cube14.faces[stickerIndex])) {
            // Draw black pieces behind rotating face
            const projectedRotatingFaceVertices = project(rotatingFaceVertices, width, height);
            context.fillStyle = 'black'
            context.beginPath();
            context.moveTo(projectedRotatingFaceVertices[0].x, projectedRotatingFaceVertices[0].y);
            context.lineTo(projectedRotatingFaceVertices[1].x, projectedRotatingFaceVertices[1].y);
            context.lineTo(projectedRotatingFaceVertices[2].x, projectedRotatingFaceVertices[2].y);
            context.lineTo(projectedRotatingFaceVertices[3].x, projectedRotatingFaceVertices[3].y);
            context.closePath();
            context.fill();
            // Draw rotating face
            for (const cube of faceRotating) {  
                for (let i=0; i<6; i++) {
                    // Set canvas fill colour to match colour of current cube face
                    const faceColor = cube.colors[i]
                    context.fillStyle = faceColor;
                    // Only draw faces which should be visible during the rotation 
                    if (faceColor !== 'black') {
                        drawFace(cube, cube.faces[i], faceColor);
                    }
                }
            }
        }
    }
    

    window.requestAnimationFrame(loop);
}

// Start loop to draw cube to canvas
loop();

// Mouse event listeners to control camera 
window.addEventListener('mousedown', () => {
    // Begin camera rotation
    isRotating = true;
})

window.addEventListener('mouseup', () => {
    // Reset mouse position
    currMouse.x = -1;
    currMouse.y = -1;
    // End camera rotation
    isRotating = false;
})

window.addEventListener('mousemove', (event) => {
    timeSinceMouseMovement = 0;

    if (currMouse.x === -1 && currMouse.y === -1) {
        // Set initial mouse position
        currMouse.x = event.pageX;
        currMouse.y = event.pageY;
    } else {
        // Find direction in which mouse is moving
        currMouseVelocity.x = event.pageX - currMouse.x;
        currMouseVelocity.y = event.pageY - currMouse.y;
        // Update current position of mouse
        currMouse.x = event.pageX;
        currMouse.y = event.pageY;
    }
})

// Touchscreen event listeners for mobile use
window.addEventListener('touchstart', () => {
    // Begin camera rotation
    isRotating = true;
})

window.addEventListener('touchend', () => {
    // Reset mouse position
    currMouse.x = -1;
    currMouse.y = -1;
    // End camera rotation
    isRotating = false;
})

window.addEventListener('touchmove', (event) => {
    timeSinceMouseMovement = 0;
    const touch = event.touches[0];

    if (currMouse.x === -1 && currMouse.y === -1) {
        // Set initial mouse position
        currMouse.x = touch.pageX;
        currMouse.y = touch.pageY;
    } else {
        // Find direction in which mouse is moving
        currMouseVelocity.x = touch.pageX - currMouse.x;
        currMouseVelocity.y = touch.pageY - currMouse.y;
        // Update current position of mouse
        currMouse.x = touch.pageX;
        currMouse.y = touch.pageY;
    }
})

// Keyboard event listeners to control face rotations
window.addEventListener('keydown', (key) => {
    // Check a face is currently rotating
    if (!faceRotating) {
        if (key.code === 'KeyG') {
            // Set rotating face correctly
            faceRotating = frontFace
            rotationStepsTaken = 0;

            // Store a copy of the rotating face's vertices
            rotatingFaceVertices = [new Point3D(frontFace[0].vertices[4].x, frontFace[0].vertices[4].y, frontFace[0].vertices[4].z), 
                                    new Point3D(frontFace[2].vertices[7].x, frontFace[2].vertices[7].y, frontFace[2].vertices[7].z),
                                    new Point3D(frontFace[8].vertices[6].x, frontFace[8].vertices[6].y, frontFace[8].vertices[6].z), 
                                    new Point3D(frontFace[6].vertices[5].x, frontFace[6].vertices[5].y, frontFace[6].vertices[5].z)];
            // Perform rotation
            rotationLoop(rotateACW);
            rotateF();
            if (rotateACW) {
                rotateF();
                rotateF();
            }
        } else if (key.code === 'KeyB') {
            // Set rotating face correctly
            faceRotating = backFace
            rotationStepsTaken = 0;

            // Store a copy of the rotating face's vertices
            rotatingFaceVertices = [new Point3D(backFace[0].vertices[0].x, backFace[0].vertices[0].y, backFace[0].vertices[0].z), 
                                    new Point3D(backFace[2].vertices[3].x, backFace[2].vertices[3].y, backFace[2].vertices[3].z),
                                    new Point3D(backFace[8].vertices[2].x, backFace[8].vertices[2].y, backFace[8].vertices[2].z), 
                                    new Point3D(backFace[6].vertices[1].x, backFace[6].vertices[1].y, backFace[6].vertices[1].z)];
            // Perform rotation
            rotationLoop(rotateACW);
            rotateB();
            if (rotateACW) {
                rotateB();
                rotateB();
            }
        } else if (key.code === 'KeyO') {
            // Set rotating face correctly
            faceRotating = leftFace
            rotationStepsTaken = 0;

            // Store a copy of the rotating face's vertices
            rotatingFaceVertices = [new Point3D(leftFace[0].vertices[1].x, leftFace[0].vertices[1].y, leftFace[0].vertices[1].z), 
                                    new Point3D(leftFace[2].vertices[2].x, leftFace[2].vertices[2].y, leftFace[2].vertices[2].z),
                                    new Point3D(leftFace[8].vertices[6].x, leftFace[8].vertices[6].y, leftFace[8].vertices[6].z), 
                                    new Point3D(leftFace[6].vertices[5].x, leftFace[6].vertices[5].y, leftFace[6].vertices[5].z)];
            // Perform rotation
            rotationLoop(rotateACW);
            rotateL();
            if (rotateACW) {
                rotateL();
                rotateL();
            }
        } else if (key.code === 'KeyR') {
            // Set rotating face correctly
            faceRotating = rightFace
            rotationStepsTaken = 0;

            // Store a copy of the rotating face's vertices
            rotatingFaceVertices = [new Point3D(rightFace[0].vertices[0].x, rightFace[0].vertices[0].y, rightFace[0].vertices[0].z), 
                                    new Point3D(rightFace[2].vertices[3].x, rightFace[2].vertices[3].y, rightFace[2].vertices[3].z),
                                    new Point3D(rightFace[8].vertices[7].x,rightFace[8].vertices[7].y, rightFace[8].vertices[7].z), 
                                    new Point3D(rightFace[6].vertices[4].x, rightFace[6].vertices[4].y, rightFace[6].vertices[4].z)];
            // Perform rotation
            rotationLoop(rotateACW);
            rotateR();
            if (rotateACW) {
                rotateR();
                rotateR();
            }
        } else if (key.code === 'KeyW') {
            // Set rotating face correctly
            faceRotating = upFace
            rotationStepsTaken = 0;

            // Store a copy of the rotating face's vertices
            rotatingFaceVertices = [new Point3D(upFace[0].vertices[3].x, upFace[0].vertices[3].y, upFace[0].vertices[3].z), 
                                    new Point3D(upFace[2].vertices[2].x, upFace[2].vertices[2].y, upFace[2].vertices[2].z), 
                                    new Point3D(upFace[8].vertices[6].x, upFace[8].vertices[6].y, upFace[8].vertices[6].z),
                                    new Point3D(upFace[6].vertices[7].x, upFace[6].vertices[7].y, upFace[6].vertices[7].z)];
            // Perform rotation
            rotationLoop(rotateACW);
            rotateU();
            if (rotateACW) {
                rotateU();
                rotateU();
            }
        } else if (key.code === 'KeyY') {
            // Set rotating face correctly
            faceRotating = downFace
            rotationStepsTaken = 0;

            // Store a copy of the rotating face's vertices
            rotatingFaceVertices = [new Point3D(downFace[0].vertices[0].x, downFace[0].vertices[0].y, downFace[0].vertices[0].z), 
                                    new Point3D(downFace[2].vertices[1].x, downFace[2].vertices[1].y, downFace[2].vertices[1].z),
                                    new Point3D(downFace[8].vertices[5].x, downFace[8].vertices[5].y, downFace[8].vertices[5].z),
                                    new Point3D(downFace[6].vertices[4].x, downFace[6].vertices[4].y, downFace[6].vertices[4].z) ];
            // Perform rotation
            rotationLoop(rotateACW);
            rotateD();
            if (rotateACW) {
                rotateD();
                rotateD();
            }
        }
    }
})
// When shift key pressed change direction which faces are rotated
window.addEventListener('keyup', (key) => {
    if (key.code === 'ShiftLeft' || key.code === 'ShiftRight') {
        rotateACW = !rotateACW;
        if (rotateACW) {
            changeDirectionBtn.innerText = 'Anti-Clockwise (Shift)'
        } else {
            changeDirectionBtn.innerText = 'Clockwise (Shift)'
        }
    }
})

// Click event listeners for buttons controlling cube
rotateFBtn.addEventListener('click', () => {
    if (!faceRotating) {
        // Set rotating face correctly
        faceRotating = frontFace
        rotationStepsTaken = 0;

        // Store a copy of the rotating face's vertices
        rotatingFaceVertices = [new Point3D(frontFace[0].vertices[4].x, frontFace[0].vertices[4].y, frontFace[0].vertices[4].z), 
                                new Point3D(frontFace[2].vertices[7].x, frontFace[2].vertices[7].y, frontFace[2].vertices[7].z),
                                new Point3D(frontFace[8].vertices[6].x, frontFace[8].vertices[6].y, frontFace[8].vertices[6].z), 
                                new Point3D(frontFace[6].vertices[5].x, frontFace[6].vertices[5].y, frontFace[6].vertices[5].z)];
        // Perform rotation
        rotationLoop(rotateACW);
        rotateF();
        if (rotateACW) {
            rotateF();
            rotateF();
        }
    }
})
rotateBBtn.addEventListener('click', () => {
    if (!faceRotating) {
        // Set rotating face correctly
        faceRotating = backFace
        rotationStepsTaken = 0;

        // Store a copy of the rotating face's vertices
        rotatingFaceVertices = [new Point3D(backFace[0].vertices[0].x, backFace[0].vertices[0].y, backFace[0].vertices[0].z), 
                                new Point3D(backFace[2].vertices[3].x, backFace[2].vertices[3].y, backFace[2].vertices[3].z),
                                new Point3D(backFace[8].vertices[2].x, backFace[8].vertices[2].y, backFace[8].vertices[2].z), 
                                new Point3D(backFace[6].vertices[1].x, backFace[6].vertices[1].y, backFace[6].vertices[1].z)];
        // Perform rotation
        rotationLoop(rotateACW);
        rotateB();
        if (rotateACW) {
            rotateB();
            rotateB();
        }
    }
})
rotateLBtn.addEventListener('click', () => {
    if (!faceRotating) {
        // Set rotating face correctly
        faceRotating = leftFace
        rotationStepsTaken = 0;

        // Store a copy of the rotating face's vertices
        rotatingFaceVertices = [new Point3D(leftFace[0].vertices[1].x, leftFace[0].vertices[1].y, leftFace[0].vertices[1].z), 
                                new Point3D(leftFace[2].vertices[2].x, leftFace[2].vertices[2].y, leftFace[2].vertices[2].z),
                                new Point3D(leftFace[8].vertices[6].x, leftFace[8].vertices[6].y, leftFace[8].vertices[6].z), 
                                new Point3D(leftFace[6].vertices[5].x, leftFace[6].vertices[5].y, leftFace[6].vertices[5].z)];
        // Perform rotation
        rotationLoop(rotateACW);
        rotateL();
        if (rotateACW) {
            rotateL();
            rotateL();
        }
    }
})
rotateRBtn.addEventListener('click', () => {
    if (!faceRotating) {
        // Set rotating face correctly
        faceRotating = rightFace
        rotationStepsTaken = 0;

        // Store a copy of the rotating face's vertices
        rotatingFaceVertices = [new Point3D(rightFace[0].vertices[0].x, rightFace[0].vertices[0].y, rightFace[0].vertices[0].z), 
                                new Point3D(rightFace[2].vertices[3].x, rightFace[2].vertices[3].y, rightFace[2].vertices[3].z),
                                new Point3D(rightFace[8].vertices[7].x,rightFace[8].vertices[7].y, rightFace[8].vertices[7].z), 
                                new Point3D(rightFace[6].vertices[4].x, rightFace[6].vertices[4].y, rightFace[6].vertices[4].z)];
        // Perform rotation
        rotationLoop(rotateACW);
        rotateR();
        if (rotateACW) {
            rotateR();
            rotateR();
        }
    }  
})
rotateUBtn.addEventListener('click', () => {
    if (!faceRotating) {
        // Set rotating face correctly
        faceRotating = upFace
        rotationStepsTaken = 0;

        // Store a copy of the rotating face's vertices
        rotatingFaceVertices = [new Point3D(upFace[0].vertices[3].x, upFace[0].vertices[3].y, upFace[0].vertices[3].z), 
                                new Point3D(upFace[2].vertices[2].x, upFace[2].vertices[2].y, upFace[2].vertices[2].z), 
                                new Point3D(upFace[8].vertices[6].x, upFace[8].vertices[6].y, upFace[8].vertices[6].z),
                                new Point3D(upFace[6].vertices[7].x, upFace[6].vertices[7].y, upFace[6].vertices[7].z)];
        // Perform rotation
        rotationLoop(rotateACW);
        rotateU();
        if (rotateACW) {
            rotateU();
            rotateU();
        }
    }
})
rotateDBtn.addEventListener('click', () => {
    if (!faceRotating) {
        // Set rotating face correctly
        faceRotating = downFace
        rotationStepsTaken = 0;

        // Store a copy of the rotating face's vertices
        rotatingFaceVertices = [new Point3D(downFace[0].vertices[0].x, downFace[0].vertices[0].y, downFace[0].vertices[0].z), 
                                new Point3D(downFace[2].vertices[1].x, downFace[2].vertices[1].y, downFace[2].vertices[1].z),
                                new Point3D(downFace[8].vertices[5].x, downFace[8].vertices[5].y, downFace[8].vertices[5].z),
                                new Point3D(downFace[6].vertices[4].x, downFace[6].vertices[4].y, downFace[6].vertices[4].z) ];
        // Perform rotation
        rotationLoop(rotateACW);
        rotateD();
        if (rotateACW) {
            rotateD();
            rotateD();
        }
    }
})
changeDirectionBtn.addEventListener('click', () => {
    rotateACW = !rotateACW;
        if (rotateACW) {
            changeDirectionBtn.innerText = 'Anti-Clockwise (Shift)'
        } else {
            changeDirectionBtn.innerText = 'Clockwise (Shift)'
        }
})