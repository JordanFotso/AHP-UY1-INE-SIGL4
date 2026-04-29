'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Slider } from '@/components/ui/slider';

interface AlternativeScoringProps {
  alternatives: string[];
  criteria: string[];
  matrix: number[][];
  onChange: (i: number, j: number, value: number) => void;
}

export default function AlternativeScoring({
  alternatives,
  criteria,
  matrix,
  onChange,
}: AlternativeScoringProps) {
  return (
    <Card className="overflow-hidden border-border/40 bg-card/50 backdrop-blur-sm rounded-3xl shadow-xl mt-8">
      <CardHeader className="border-b border-border/40 bg-muted/20 pb-6">
        <CardTitle className="text-2xl font-bold">Évaluation des Options</CardTitle>
        <CardDescription className="mt-1">
          Attribuez un score de 0 à 100 pour chaque option par rapport aux critères.
        </CardDescription>
      </CardHeader>
      <CardContent className="p-0 overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="border-border/40 hover:bg-transparent">
              <TableHead className="w-40 bg-muted/30 font-bold text-foreground">Options</TableHead>
              {criteria.map((criterion, j) => (
                <TableHead key={j} className="text-center font-bold text-foreground min-w-[120px] py-6">
                  {criterion}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {alternatives.map((alternative, i) => (
              <TableRow key={i} className="border-border/40">
                <TableCell className="font-bold bg-muted/30 text-foreground py-6">
                  {alternative}
                </TableCell>
                {criteria.map((_, j) => (
                  <TableCell key={j} className="p-4 border-l border-border/20">
                    <div className="flex flex-col gap-3 items-center">
                      <Input
                        type="number"
                        min="0"
                        max="100"
                        value={matrix[i] && matrix[i][j] !== undefined ? matrix[i][j] : ''}
                        onChange={(e) => onChange(i, j, parseFloat(e.target.value) || 0)}
                        className="w-20 text-center font-bold h-10 rounded-xl bg-background border-border/50 focus:border-primary/50"
                      />
                      <Slider
                        value={[matrix[i] && matrix[i][j] !== undefined ? matrix[i][j] : 0]}
                        onValueChange={(val) => onChange(i, j, val[0])}
                        max={100}
                        step={1}
                        className="w-24"
                      />
                    </div>
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
