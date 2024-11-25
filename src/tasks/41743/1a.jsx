import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const defaultButtonStyle = {
  borderWidth: 1,
  borderStyle: "solid",
  borderColor: "#000000",
  borderRadius: 4,
  backgroundColor: "#3b82f6",
  color: "#ffffff",
  fontSize: 16,
  fontWeight: 400,
  paddingX: 4,
  paddingY: 2,
  marginX: 0,
  marginY: 0,
};

const ColorPicker = ({ value, onChange }) => (
  <Input
    type="color"
    value={value}
    onChange={(e) => onChange(e.target.value)}
    className="w-12 h-8 p-0 border-none"
  />
);

const ButtonPreview = ({ style }) => (
  <button
    style={{
      borderWidth: `${style.borderWidth}px`,
      borderStyle: style.borderStyle,
      borderColor: style.borderColor,
      borderRadius: `${style.borderRadius}px`,
      backgroundColor: style.backgroundColor,
      color: style.color,
      fontSize: `${style.fontSize}px`,
      fontWeight: style.fontWeight,
      padding: `${style.paddingY}px ${style.paddingX}px`,
      margin: `${style.marginY}px ${style.marginX}px`,
    }}
    className="transition-all duration-200"
  >
    Button Preview
  </button>
);

const CodeOutput = ({ style }) => {
  const cssCode = `
.custom-button {
  border: ${style.borderWidth}px ${style.borderStyle} ${style.borderColor};
  border-radius: ${style.borderRadius}px;
  background-color: ${style.backgroundColor};
  color: ${style.color};
  font-size: ${style.fontSize}px;
  font-weight: ${style.fontWeight};
  padding: ${style.paddingY}px ${style.paddingX}px;
  margin: ${style.marginY}px ${style.marginX}px;
}
  `.trim();

  const htmlCode = `<button class="custom-button">Button Text</button>`;

  const fullCode = `${cssCode}\n\n${htmlCode}`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(fullCode);
  };

  return (
    <div className="mt-4">
      <pre className="bg-gray-100 p-4 rounded-md overflow-x-auto">
        <code>{fullCode}</code>
      </pre>
      <Button onClick={copyToClipboard} className="mt-2">
        Copy to Clipboard
      </Button>
    </div>
  );
};

export default function App() {
  const [buttonStyle, setButtonStyle] = useState(defaultButtonStyle);

  const updateStyle = (key, value) => {
    setButtonStyle((prev) => ({ ...prev, [key]: value }));
  };

  const resetStyle = () => {
    setButtonStyle(defaultButtonStyle);
  };

  return (
    <div className="container mx-auto p-4 max-w-3xl">
      <h1 className="text-3xl font-bold mb-6">Button Designer</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Customize Button</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <Label>Border Width</Label>
                <Slider
                  min={0}
                  max={10}
                  step={1}
                  value={[buttonStyle.borderWidth]}
                  onValueChange={([value]) => updateStyle("borderWidth", value)}
                />
              </div>
              <div>
                <Label>Border Style</Label>
                <Select
                  value={buttonStyle.borderStyle}
                  onValueChange={(value) => updateStyle("borderStyle", value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {["solid", "dashed", "dotted", "double"].map((style) => (
                      <SelectItem key={style} value={style}>
                        {style}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Border Color</Label>
                <ColorPicker
                  value={buttonStyle.borderColor}
                  onChange={(value) => updateStyle("borderColor", value)}
                />
              </div>
              <div>
                <Label>Border Radius</Label>
                <Slider
                  min={0}
                  max={20}
                  step={1}
                  value={[buttonStyle.borderRadius]}
                  onValueChange={([value]) => updateStyle("borderRadius", value)}
                />
              </div>
              <div>
                <Label>Background Color</Label>
                <ColorPicker
                  value={buttonStyle.backgroundColor}
                  onChange={(value) => updateStyle("backgroundColor", value)}
                />
              </div>
              <div>
                <Label>Text Color</Label>
                <ColorPicker
                  value={buttonStyle.color}
                  onChange={(value) => updateStyle("color", value)}
                />
              </div>
              <div>
                <Label>Font Size</Label>
                <Slider
                  min={8}
                  max={32}
                  step={1}
                  value={[buttonStyle.fontSize]}
                  onValueChange={([value]) => updateStyle("fontSize", value)}
                />
              </div>
              <div>
                <Label>Font Weight</Label>
                <Select
                  value={buttonStyle.fontWeight.toString()}
                  onValueChange={(value) => updateStyle("fontWeight", parseInt(value))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {[300, 400, 500, 600, 700].map((weight) => (
                      <SelectItem key={weight} value={weight.toString()}>
                        {weight}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Padding X</Label>
                <Slider
                  min={0}
                  max={20}
                  step={1}
                  value={[buttonStyle.paddingX]}
                  onValueChange={([value]) => updateStyle("paddingX", value)}
                />
              </div>
              <div>
                <Label>Padding Y</Label>
                <Slider
                  min={0}
                  max={20}
                  step={1}
                  value={[buttonStyle.paddingY]}
                  onValueChange={([value]) => updateStyle("paddingY", value)}
                />
              </div>
              <div>
                <Label>Margin X</Label>
                <Slider
                  min={0}
                  max={20}
                  step={1}
                  value={[buttonStyle.marginX]}
                  onValueChange={([value]) => updateStyle("marginX", value)}
                />
              </div>
              <div>
                <Label>Margin Y</Label>
                <Slider
                  min={0}
                  max={20}
                  step={1}
                  value={[buttonStyle.marginY]}
                  onValueChange={([value]) => updateStyle("marginY", value)}
                />
              </div>
              <Button onClick={resetStyle}>Reset</Button>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Preview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex justify-center items-center h-32 bg-gray-100 rounded-md">
              <ButtonPreview style={buttonStyle} />
            </div>
            <CodeOutput style={buttonStyle} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}