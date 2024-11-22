// ****************************************
// !IMPORTANT
// COMMENTED  CODE INTENTIONALLY TO HIDE THE ERROR MESAGE 
// I AM GETTING FOR ALL OTHER TASKS.
// ***************************************
// import React, { useState, useEffect } from "react";
// import { DndProvider, useDrag, useDrop } from "react-dnd";
// import { HTML5Backend } from "react-dnd-html5-backend";
// import { Button } from "@/components/ui/button";
// import { Card, CardContent } from "@/components/ui/card";

// const shapes = ["triangle", "circle", "star"];

// const ShapeComponent = ({ shape }) => {
//   const shapeStyles = {
//     triangle: "w-0 h-0 border-l-[30px] border-r-[30px] border-b-[52px] border-l-transparent border-r-transparent border-b-current",
//     circle: "w-[60px] h-[60px] rounded-full",
//     star: "w-0 h-0 border-l-[30px] border-r-[30px] border-b-[52px] border-l-transparent border-r-transparent border-b-current relative before:content-[''] before:absolute before:top-[18px] before:left-[-30px] before:w-0 before:h-0 before:border-l-[30px] before:border-r-[30px] before:border-t-[52px] before:border-l-transparent before:border-r-transparent before:border-t-current",
//   };

//   return <div className={`${shapeStyles[shape]} text-current`} />;
// };

// const DraggableShape = ({ shape, index }) => {
//   const [{ isDragging }, drag] = useDrag(() => ({
//     type: "shape",
//     item: { shape, index },
//     collect: (monitor) => ({
//       isDragging: !!monitor.isDragging(),
//     }),
//   }));

//   return (
//     <div
//       ref={drag}
//       className={`w-20 h-20 border-2 border-black bg-white flex items-center justify-center cursor-move ${
//         isDragging ? "opacity-50" : "opacity-100"
//       }`}
//     >
//       <ShapeComponent shape={shape} />
//     </div>
//   );
// };

// const PlaceholderSquare = ({ shape, onDrop, isCorrect }) => {
//   const [{ isOver }, drop] = useDrop(() => ({
//     accept: "shape",
//     drop: (item) => onDrop(item, shape),
//     collect: (monitor) => ({
//       isOver: !!monitor.isOver(),
//     }),
//   }));

//   return (
//     <div
//       ref={drop}
//       className={`w-20 h-20 border-4 border-dotted bg-gray-100 flex items-center justify-center transition-colors duration-300 ${
//         isOver ? "border-blue-500" : isCorrect ? "border-green-500" : "border-gray-300"
//       }`}
//     >
//       <div className="text-gray-300 opacity-50">
//         <ShapeComponent shape={shape} />
//       </div>
//     </div>
//   );
// };

// const GameBoard = ({ placeholders, draggables, onDrop, correctPlacements }) => (
//   <div className="flex flex-col items-center space-y-8">
//     <div className="grid grid-cols-3 gap-4">
//       {placeholders.map((shape, index) => (
//         <PlaceholderSquare
//           key={index}
//           shape={shape}
//           onDrop={onDrop}
//           isCorrect={correctPlacements[index]}
//         />
//       ))}
//     </div>
//     <div className="grid grid-cols-3 gap-4">
//       {draggables.map((shape, index) => (
//         <DraggableShape key={index} shape={shape} index={index} />
//       ))}
//     </div>
//   </div>
// );

// const shuffleArray = (array) => {
//   const newArray = [...array];
//   for (let i = newArray.length - 1; i > 0; i--) {
//     const j = Math.floor(Math.random() * (i + 1));
//     [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
//   }
//   return newArray;
// };

// export default function App() {
//   const [gameState, setGameState] = useState("instructions");
//   const [placeholders, setPlaceholders] = useState([]);
//   const [draggables, setDraggables] = useState([]);
//   const [correctPlacements, setCorrectPlacements] = useState([]);

//   const initializeGame = () => {
//     const shuffledShapes = shuffleArray(shapes);
//     setPlaceholders(shuffledShapes);
//     setDraggables(shuffleArray(shuffledShapes));
//     setCorrectPlacements(Array(3).fill(false));
//     setGameState("playing");
//   };

//   useEffect(() => {
//     if (correctPlacements.every((placement) => placement)) {
//       setGameState("won");
//       setTimeout(() => initializeGame(), 3000);
//     }
//   }, [correctPlacements]);

//   const handleDrop = (item, targetShape) => {
//     if (item.shape === targetShape) {
//       setCorrectPlacements((prev) => {
//         const newPlacements = [...prev];
//         newPlacements[placeholders.indexOf(targetShape)] = true;
//         return newPlacements;
//       });
//     } else {
//       // Animate back to original position
//       const draggableElement = document.querySelectorAll(".cursor-move")[item.index];
//       draggableElement.style.transition = "transform 0.3s ease-out";
//       draggableElement.style.transform = "translate(0, 0)";
//       setTimeout(() => {
//         draggableElement.style.transition = "";
//         draggableElement.style.transform = "";
//       }, 300);
//     }
//   };

//   return (
//     <DndProvider backend={HTML5Backend}>
//       <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
//         <Card className="w-full max-w-md">
//           <CardContent className="p-6">
//             {gameState === "instructions" && (
//               <div className="text-center space-y-4">
//                 <h1 className="text-2xl font-bold">Shape Matching Game</h1>
//                 <p>
//                   Drag and drop the shapes from the bottom to their corresponding
//                   placeholders at the top. Match all shapes correctly to win!
//                 </p>
//                 <Button onClick={initializeGame}>Start Game</Button>
//               </div>
//             )}
//             {gameState === "playing" && (
//               <GameBoard
//                 placeholders={placeholders}
//                 draggables={draggables}
//                 onDrop={handleDrop}
//                 correctPlacements={correctPlacements}
//               />
//             )}
//             {gameState === "won" && (
//               <div className="text-center">
//                 <h2 className="text-2xl font-bold text-green-600 mb-4">You Won!</h2>
//                 <p>Restarting game in 3 seconds...</p>
//               </div>
//             )}
//           </CardContent>
//         </Card>
//         {gameState !== "instructions" && (
//           <Button onClick={initializeGame} className="mt-4">
//             Restart Game
//           </Button>
//         )}
//       </div>
//     </DndProvider>
//   );
// }