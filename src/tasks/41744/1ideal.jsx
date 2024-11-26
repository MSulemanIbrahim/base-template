import React, { useState, useEffect } from "react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

const SHAPES = ["circle", "square", "star"];

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getRandomShape() {
  return SHAPES[getRandomInt(0, SHAPES.length - 1)];
}

function PlaceholderShape({ shape, size, position }) {
  return (
    <div
      className={`absolute ${shape} bg-gray-500`}
      style={{
        width: `${size}px`,
        height: `${size}px`,
        left: `${position.x}px`,
        top: `${position.y}px`,
      }}
    />
  );
}

function UserShape({ shape, size, position }) {
  return (
    <div
      className={`absolute ${shape} bg-blue-500`}
      style={{
        width: `${size}px`,
        height: `${size}px`,
        left: `${position.x}px`,
        top: `${position.y}px`,
      }}
    />
  );
}

function App() {
  const [placeholder, setPlaceholder] = useState({
    shape: getRandomShape(),
    size: getRandomInt(50, 100),
    position: { x: getRandomInt(50, 200), y: getRandomInt(50, 200) },
  });
  const [userShape, setUserShape] = useState(null);
  const [userPosition, setUserPosition] = useState({ x: 0, y: 0 });
  const [userSize, setUserSize] = useState(50);
  const [success, setSuccess] = useState(false);

  // Function to check if the user shape matches the placeholder shape closely enough
  useEffect(() => {
    const positionMatch =
      Math.abs(userPosition.x - placeholder.position.x) <= placeholder.size * 0.3 &&
      Math.abs(userPosition.y - placeholder.position.y) <= placeholder.size * 0.3;
    const sizeMatch = Math.abs(userSize - placeholder.size) <= placeholder.size * 0.3;

    if (userShape === placeholder.shape && positionMatch && sizeMatch) {
      setSuccess(true);
    } else {
      setSuccess(false);
    }
  }, [userShape, userPosition, userSize, placeholder]);

  const handleNext = () => {
    setPlaceholder({
      shape: getRandomShape(),
      size: getRandomInt(50, 100),
      position: { x: getRandomInt(50, 200), y: getRandomInt(50, 200) },
    });
    setUserShape(null);
    setUserPosition({ x: 0, y: 0 });
    setUserSize(50);
    setSuccess(false);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-4">
      {/* Main game card container */}
      <Card className="relative w-full max-w-md bg-gray-50 border">
        <CardHeader>
          <CardTitle>Shape Matching Game</CardTitle>
        </CardHeader>
        <CardContent className="relative w-full h-[400px] border bg-gray-300 flex justify-center items-center">
          {/* Placeholder shape */}
          <PlaceholderShape
            shape={placeholder.shape}
            size={placeholder.size}
            position={placeholder.position}
          />
          {/* User's shape */}
          {userShape && (
            <UserShape
              shape={userShape}
              size={userSize}
              position={userPosition}
            />
          )}
        </CardContent>
        <CardFooter className="flex flex-col gap-4 mt-4">
          {success && (
            <div className="text-green-600 text-center">Nicely done!</div>
          )}
          {success && (
            <button
              className="bg-blue-500 text-white px-4 py-2 rounded w-full"
              onClick={handleNext}
            >
              Next
            </button>
          )}
          {/* Shape selection buttons */}
          <div className="flex justify-between">
            {SHAPES.map((shape) => (
              <button
                key={shape}
                className={`px-4 py-2 rounded ${
                  userShape === shape ? "bg-blue-500 text-white" : "bg-gray-300 text-gray-700"
                }`}
                onClick={() => setUserShape(shape)}
              >
                {shape}
              </button>
            ))}
          </div>
          {/* Sliders for shape manipulation */}
          {userShape && (
            <div className="flex flex-col gap-2">
              <label className="flex flex-col">
                Horizontal Position
                <input
                  type="range"
                  min="0"
                  max="300"
                  value={userPosition.x}
                  onChange={(e) =>
                    setUserPosition((pos) => ({ ...pos, x: +e.target.value }))
                  }
                />
              </label>
              <label className="flex flex-col">
                Vertical Position
                <input
                  type="range"
                  min="0"
                  max="300"
                  value={userPosition.y}
                  onChange={(e) =>
                    setUserPosition((pos) => ({ ...pos, y: +e.target.value }))
                  }
                />
              </label>
              <label className="flex flex-col">
                Size
                <input
                  type="range"
                  min="30"
                  max="150"
                  value={userSize}
                  onChange={(e) => setUserSize(+e.target.value)}
                />
              </label>
            </div>
          )}
        </CardFooter>
      </Card>

      {/* Star shape CSS */}
      <style jsx>{`
        .star {
          clip-path: polygon(
            50% 0%,
            61% 35%,
            98% 35%,
            68% 57%,
            79% 91%,
            50% 70%,
            21% 91%,
            32% 57%,
            2% 35%,
            39% 35%
          );
        }
      `}</style>
    </div>
  );
}

export default App;
