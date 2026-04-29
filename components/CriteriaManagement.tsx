'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, Trash2, Settings2, GripVertical } from 'lucide-react';
import { cn } from '@/lib/utils';

interface CriteriaManagementProps {
  criteria: string[];
  onAdd: (name: string) => void;
  onRemove: (index: number) => void;
  onRename: (index: number, newName: string) => void;
}

export default function CriteriaManagement({ criteria, onAdd, onRemove, onRename }: CriteriaManagementProps) {
  const [inputValue, setInputValue] = useState('');

  const handleAdd = () => {
    if (inputValue.trim()) {
      onAdd(inputValue.trim());
      setInputValue('');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <h3 className="text-2xl font-bold tracking-tight">Critères de décision</h3>
        <p className="text-muted-foreground text-sm">
          Définissez les facteurs qui influenceront votre choix final.
        </p>
      </div>

      <div className="flex gap-3 bg-muted/30 p-2 rounded-2xl border border-border/40 focus-within:border-primary/40 transition-all duration-300">
        <Input
          placeholder="Ex: Coût, Performance, Durabilité..."
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleAdd()}
          className="bg-transparent border-none shadow-none focus-visible:ring-0 text-lg py-6"
        />
        <Button 
          onClick={handleAdd} 
          className="rounded-xl px-6 h-auto bg-primary hover:bg-primary/90 shadow-lg shadow-primary/10 transition-all active:scale-95"
        >
          <Plus className="h-5 w-5 mr-1" />
          Ajouter
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {criteria.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 px-4 rounded-3xl border-2 border-dashed border-border/60 bg-muted/10">
            <Settings2 className="h-10 w-10 text-muted-foreground/40 mb-3" />
            <p className="text-muted-foreground font-medium">Aucun critère défini pour le moment.</p>
          </div>
        ) : (
          criteria.map((criterion, index) => (
            <Card 
              key={index} 
              className="group relative overflow-hidden border-border/40 hover:border-primary/30 hover:shadow-xl hover:shadow-primary/5 transition-all duration-300 rounded-2xl bg-card/50 backdrop-blur-sm"
            >
              <CardContent className="p-4 flex items-center gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary font-bold">
                  {index + 1}
                </div>
                
                <div className="flex-1">
                  <Input
                    value={criterion}
                    onChange={(e) => onRename(index, e.target.value)}
                    className="bg-transparent border-none shadow-none focus-visible:ring-0 text-lg font-semibold p-0 h-auto"
                  />
                  <p className="text-xs text-muted-foreground font-medium">Cliquez pour renommer</p>
                </div>

                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onRemove(index)}
                  className="opacity-0 group-hover:opacity-100 transition-opacity text-destructive hover:text-destructive hover:bg-destructive/10 rounded-xl"
                >
                  <Trash2 className="h-5 w-5" />
                </Button>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {criteria.length > 0 && (
        <p className="text-xs text-center text-muted-foreground font-medium">
          Astuce : Vous pouvez modifier le nom des critères directement dans les cartes.
        </p>
      )}
    </div>
  );
}
