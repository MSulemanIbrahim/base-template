import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const shapes = ["circle", "square", "rectangle"];
const fontStyles = ["normal", "italic", "bold"];
const alignments = ["left", "center", "right"];
const templates = [
  { name: "Default", bg: "#3b82f6", text: "#ffffff", border: "#2563eb" },
  { name: "Dark", bg: "#1f2937", text: "#f3f4f6", border: "#4b5563" },
  { name: "Nature", bg: "#10b981", text: "#f0fdf4", border: "#059669" },
];

export default function App() {
  const [badge, setBadge] = useState({
    shape: "circle",
    text: "Badge",
    fontSize: 16,
    fontStyle: "normal",
    alignment: "center",
    bgColor: "#3b82f6",
    textColor: "#ffffff",
    borderColor: "#2563eb",
    showBorder: true,
    borderWidth: 2,
  });

  const [showCode, setShowCode] = useState(false);

  const updateBadge = (key, value) => {
    setBadge((prev) => ({ ...prev, [key]: value }));
  };

  const resetBadge = () => {
    setBadge({
      shape: "circle",
      text: "Badge",
      fontSize: 16,
      fontStyle: "normal",
      alignment: "center",
      bgColor: "#3b82f6",
      textColor: "#ffffff",
      borderColor: "#2563eb",
      showBorder: true,
      borderWidth: 2,
    });
  };

  const getBadgeStyle = () => ({
    backgroundColor: badge.bgColor,
    color: badge.textColor,
    border: badge.showBorder ? `${badge.borderWidth}px solid ${badge.borderColor}` : "none",
    borderRadius: badge.shape === "circle" ? "50%" : badge.shape === "square" ? "10%" : "5px",
    padding: "10px",
    display: "flex",
    alignItems: "center",
    justifyContent: badge.alignment, // Flexbox alignment for proper justification
    fontSize: `${badge.fontSize}px`,
    fontStyle: badge.fontStyle,
    minWidth: badge.shape === "circle" ? "100px" : "auto",
    minHeight: badge.shape === "circle" ? "100px" : "auto",
    width: badge.shape === "rectangle" ? "200px" : "auto",
  });

  const getBadgeCode = () => `
<div style="${Object.entries(getBadgeStyle())
    .map(([key, value]) => `${key.replace(/([A-Z])/g, "-$1").toLowerCase()}: ${value};`)
    .join(" ")}">
  ${badge.text}
</div>`;

  return (
    <div className="container mx-auto p-4">
      <Card>
        <CardHeader>
          <CardTitle>Custom Badge Generator</CardTitle>
          <CardDescription>Design your own badge with ease</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Design and Template Tabs */}
            <div>
              <Tabs defaultValue="design">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="design">Design</TabsTrigger>
                  <TabsTrigger value="templates">Templates</TabsTrigger>
                </TabsList>
                <TabsContent value="design">
                  <div className="space-y-4">
                    <div>
                      <Label>Shape</Label>
                      <Select value={badge.shape} onValueChange={(value) => updateBadge("shape", value)}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {shapes.map((shape) => (
                            <SelectItem key={shape} value={shape}>
                              {shape.charAt(0).toUpperCase() + shape.slice(1)}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label>Text</Label>
                      <Input
                        value={badge.text}
                        onChange={(e) => updateBadge("text", e.target.value)}
                      />
                    </div>
                    <div>
                      <Label>Font Size: {badge.fontSize}px</Label>
                      <Slider
                        min={8}
                        max={32}
                        step={1}
                        value={[badge.fontSize]}
                        onValueChange={([value]) => updateBadge("fontSize", value)}
                      />
                    </div>
                    <div>
                      <Label>Font Style</Label>
                      <Select value={badge.fontStyle} onValueChange={(value) => updateBadge("fontStyle", value)}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {fontStyles.map((style) => (
                            <SelectItem key={style} value={style}>
                              {style.charAt(0).toUpperCase() + style.slice(1)}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label>Alignment</Label>
                      <Select value={badge.alignment} onValueChange={(value) => updateBadge("alignment", value)}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {alignments.map((align) => (
                            <SelectItem key={align} value={align}>
                              {align.charAt(0).toUpperCase() + align.slice(1)}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label>Background Color</Label>
                      <Input
                        type="color"
                        value={badge.bgColor}
                        onChange={(e) => updateBadge("bgColor", e.target.value)}
                      />
                    </div>
                    <div>
                      <Label>Text Color</Label>
                      <Input
                        type="color"
                        value={badge.textColor}
                        onChange={(e) => updateBadge("textColor", e.target.value)}
                      />
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch
                        checked={badge.showBorder}
                        onCheckedChange={(checked) => updateBadge("showBorder", checked)}
                      />
                      <Label>Show Border</Label>
                    </div>
                    {badge.showBorder && (
                      <>
                        <div>
                          <Label>Border Color</Label>
                          <Input
                            type="color"
                            value={badge.borderColor}
                            onChange={(e) => updateBadge("borderColor", e.target.value)}
                          />
                        </div>
                        <div>
                          <Label>Border Width: {badge.borderWidth}px</Label>
                          <Slider
                            min={1}
                            max={10}
                            step={1}
                            value={[badge.borderWidth]}
                            onValueChange={([value]) => updateBadge("borderWidth", value)}
                          />
                        </div>
                      </>
                    )}
                  </div>
                </TabsContent>
                <TabsContent value="templates">
                  <div className="space-y-4">
                    {templates.map((template) => (
                      <Button
                        key={template.name}
                        onClick={() =>
                          setBadge((prev) => ({
                            ...prev,
                            bgColor: template.bg,
                            textColor: template.text,
                            borderColor: template.border,
                          }))
                        }
                        className="w-full"
                        style={{
                          backgroundColor: template.bg,
                          color: template.text,
                          border: `2px solid ${template.border}`,
                        }}
                      >
                        {template.name}
                      </Button>
                    ))}
                  </div>
                </TabsContent>
              </Tabs>
            </div>
            {/* Badge Preview and Code */}
            <div>
              <div className="flex flex-col items-center space-y-4">
                <div style={getBadgeStyle()}>{badge.text}</div>
                <Button onClick={() => setShowCode(!showCode)}>
                  {showCode ? "Hide Code" : "Show Code"}
                </Button>
                {showCode && (
                  <div>
                    <pre className="bg-gray-100 p-2 rounded w-full text-">{getBadgeCode()}</pre>
                    <Button
                      onClick={() => navigator.clipboard.writeText(getBadgeCode())}
                      className="mt-2"
                    >
                      Copy Code
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button onClick={resetBadge} variant="outline">
            Reset
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}