'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Info, Lock } from 'lucide-react';
import { cn } from '@/lib/utils';

interface PairwiseComparisonProps {
  criteria: string[];
  matrix: number[][];
  onChange: (i: number, j: number, value: number) => void;
}

const SAATY_SCALE = [
  { value: '1', label: 'Également important', color: 'bg-slate-200' },
  { value: '3', label: 'Modérément plus important', color: 'bg-blue-100' },
  { value: '5', label: 'Fortement plus important', color: 'bg-blue-200' },
  { value: '7', label: 'Très fortement plus important', color: 'bg-blue-300' },
  { value: '9', label: 'Extrêmement plus important', color: 'bg-blue-400' },
  { value: '0.333', label: 'Modérément moins important (1/3)', color: 'bg-orange-100' },
  { value: '0.2', label: 'Fortement moins important (1/5)', color: 'bg-orange-200' },
  { value: '0.143', label: 'Très fortement moins important (1/7)', color: 'bg-orange-300' },
  { value: '0.111', label: 'Extrêmement moins important (1/9)', color: 'bg-orange-400' },
];

export default function PairwiseComparison({ criteria, matrix, onChange }: PairwiseComparisonProps) {
  
  const formatValue = (value: number): string => {
    if (value === 1) return '1';
    if (value < 1) {
      const reciprocal = Math.round(1 / value);
      return `1/${reciprocal}`;
    }
    return Math.round(value).toString();
  };

  const getCellColor = (value: number) => {
    if (value === 1) return 'bg-muted/50';
    if (value > 1) return 'bg-primary/5';
    return 'bg-orange-500/5';
  };

  return (
    <Card className="overflow-hidden border-border/40 bg-card/50 backdrop-blur-sm rounded-3xl shadow-xl">
      <CardHeader className="border-b border-border/40 bg-muted/20 pb-6">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-2xl font-bold">Matrice de Comparaison</CardTitle>
            <CardDescription className="mt-1">
              Comparez l'importance relative de chaque critère.
            </CardDescription>
          </div>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="h-10 w-10 flex items-center justify-center rounded-full bg-muted cursor-help hover:bg-muted/80 transition-colors">
                  <Info className="h-5 w-5 text-muted-foreground" />
                </div>
              </TooltipTrigger>
              <TooltipContent className="max-w-xs p-4 bg-popover/95 backdrop-blur-sm border-border/50">
                <p className="font-bold mb-2">Échelle de Saaty</p>
                <p className="text-xs leading-relaxed text-muted-foreground">
                  Utilisez l'échelle de 1 à 9 pour indiquer combien un critère est plus important qu'un autre. 
                  L'application calculera automatiquement l'inverse pour la comparaison opposée.
                </p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </CardHeader>
      
      <CardContent className="p-0 overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="border-border/40 hover:bg-transparent">
              <TableHead className="w-40 bg-muted/30 font-bold text-foreground">Critères</TableHead>
              {criteria.map((criterion, j) => (
                <TableHead key={j} className="text-center font-bold text-foreground min-w-[140px] py-6">
                  {criterion}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {criteria.map((criterion, i) => (
              <TableRow key={i} className="border-border/40">
                <TableCell className="font-bold bg-muted/30 text-foreground py-6">
                  {criterion}
                </TableCell>
                {criteria.map((_, j) => (
                  <TableCell 
                    key={j} 
                    className={cn(
                      "p-4 transition-colors duration-200 border-l border-border/20",
                      getCellColor(matrix[i][j])
                    )}
                  >
                    {i === j ? (
                      <div className="flex flex-col items-center justify-center gap-1 opacity-40">
                        <Lock className="h-3 w-3" />
                        <span className="font-bold">1</span>
                      </div>
                    ) : i < j ? (
                      <Select
                        value={matrix[i][j].toString()}
                        onValueChange={(val) => onChange(i, j, parseFloat(val))}
                      >
                        <SelectTrigger className="w-full bg-background/80 border-border/50 hover:border-primary/50 transition-all rounded-xl h-12 shadow-sm">
                          <SelectValue placeholder="Choisir..." />
                        </SelectTrigger>
                        <SelectContent className="rounded-2xl border-border/50 shadow-2xl backdrop-blur-xl">
                          {SAATY_SCALE.map((item) => (
                            <SelectItem 
                              key={item.value} 
                              value={item.value}
                              className="py-3 cursor-pointer"
                            >
                              <div className="flex items-center gap-3">
                                <span className="font-bold w-8">{formatValue(parseFloat(item.value))}</span>
                                <span className="text-xs text-muted-foreground">{item.label}</span>
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    ) : (
                      <div className="text-center font-medium text-muted-foreground/60">
                        {formatValue(matrix[i][j])}
                      </div>
                    )}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
      
      <div className="p-6 bg-muted/10 border-t border-border/40">
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
          {[1, 3, 5, 7, 9].map((val) => (
            <div key={val} className="flex flex-col gap-1">
              <span className="text-[10px] uppercase tracking-wider font-bold text-muted-foreground">Valeur {val}</span>
              <span className="text-xs font-medium">{SAATY_SCALE.find(s => parseFloat(s.value) === val)?.label}</span>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
}
