import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CountingSort } from "@/components/CountingSort";
import { BucketSort } from "@/components/BucketSort";
import { RadixSort } from "@/components/RadixSort";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Binary, Container, Hash } from "lucide-react";

const Index = () => {
  const [activeTab, setActiveTab] = useState("counting");

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-background/80 py-8 px-4">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-4 animate-fade-in relative">
          <div className="absolute top-0 right-0">
            <ThemeToggle />
          </div>
          <h1 className="text-5xl font-bold bg-gradient-to-r from-primary to-primary-glow bg-clip-text text-transparent">
            Sorting Algorithm Visualizer
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Explore and understand counting sort, bucket sort, and radix sort through interactive visualizations
          </p>
        </div>

        {/* Algorithm Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full max-w-3xl mx-auto grid-cols-3 h-14 bg-card border border-border">
            <TabsTrigger 
              value="counting" 
              className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground text-base gap-2"
            >
              <Binary className="h-5 w-5" />
              Counting Sort
            </TabsTrigger>
            <TabsTrigger 
              value="bucket"
              className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground text-base gap-2"
            >
              <Container className="h-5 w-5" />
              Bucket Sort
            </TabsTrigger>
            <TabsTrigger 
              value="radix"
              className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground text-base gap-2"
            >
              <Hash className="h-5 w-5" />
              Radix Sort
            </TabsTrigger>
          </TabsList>

          <div className="mt-8">
            <TabsContent value="counting" className="animate-fade-in">
              <CountingSort />
            </TabsContent>

            <TabsContent value="bucket" className="animate-fade-in">
              <BucketSort />
            </TabsContent>

            <TabsContent value="radix" className="animate-fade-in">
              <RadixSort />
            </TabsContent>
          </div>
        </Tabs>

        {/* Legend */}
        <div className="bg-card rounded-xl p-6 border border-border max-w-3xl mx-auto">
          <h3 className="text-sm font-semibold text-foreground mb-4">Color Legend</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded bg-primary" />
              <span className="text-sm text-muted-foreground">Default</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded bg-comparing" />
              <span className="text-sm text-muted-foreground">Comparing</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded bg-accent" />
              <span className="text-sm text-muted-foreground">Active</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded bg-sorted" />
              <span className="text-sm text-muted-foreground">Sorted</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
