import { Badge } from '@/components/primitives/Badge/badge'
import { Button } from '@/components/primitives/Button/button'
import { Collapsible, CollapsiblePanel, CollapsibleTrigger } from '@/components/primitives/Collapsible/collapsible'
import { Dialog } from '@/components/primitives/Dialog/dialog'
import { Input } from '@/components/primitives/Input/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/primitives/Select/select'
import { Field, FieldGroup, FieldLabel } from '@/components/ui/field'
import { Label } from '@/components/ui/label'
import { IconDevices } from '@tabler/icons-react'
import { ChevronRight, Monitor, Plus, Smartphone, Tablet, Trash2 } from 'lucide-react'
import { useState } from 'react'

import { BREAKPOINT_PRESETS } from './BreakpointsPresents'

export type BreakpointType = 'min-width' | 'max-width' | 'min-height' | 'max-height'

export interface Breakpoint {
  id: string
  type: BreakpointType
  value: string
  label?: string | undefined
}

interface BreakpointManagerProps {
  breakpoints: Breakpoint[]
  onAddBreakpoint: (breakpoint: Omit<Breakpoint, 'id'>) => void
  onRemoveBreakpoint: (breakpointId: string) => void
  activeBreakpointId?: string | null | undefined
  onSelectBreakpoint: (breakpointId: string | null) => void
}

export const BreakpointManager = ({
  breakpoints,
  onAddBreakpoint,
  onRemoveBreakpoint,
  activeBreakpointId,
  onSelectBreakpoint,
}: BreakpointManagerProps) => {
  const [dialogOpen, setDialogOpen] = useState(false)
  const [newBreakpointType, setNewBreakpointType] = useState<BreakpointType>('min-width')
  const [newBreakpointValue, setNewBreakpointValue] = useState('')
  const [newBreakpointLabel, setNewBreakpointLabel] = useState('')

  const handleAddBreakpoint = () => {
    if (!newBreakpointValue.trim()) return

    onAddBreakpoint({
      type: newBreakpointType,
      value: newBreakpointValue,
      label: newBreakpointLabel || undefined,
    })

    // Reset form
    setNewBreakpointValue('')
    setNewBreakpointLabel('')
    setDialogOpen(false)
  }

  const handleAddPreset = (preset: (typeof BREAKPOINT_PRESETS)[0]) => {
    onAddBreakpoint({
      type: preset.type,
      value: preset.value,
      label: preset.label,
    })
    setDialogOpen(false)
  }

  const getBreakpointIcon = (value: string) => {
    const numValue = parseInt(value)
    if (numValue < 768) return Smartphone
    if (numValue < 1024) return Tablet
    return Monitor
  }

  return (
    <div className="border-b border-border pb-6">
      <Collapsible defaultOpen>
        <CollapsibleTrigger className="group flex items-center gap-2 w-full [&>svg:last-child]:hidden">
          <p className="text-xs font-normal">Responsive Styles</p>
          <ChevronRight className="size-4 group-data-[panel-open]:rotate-90" />
        </CollapsibleTrigger>

        <CollapsiblePanel className="mt-4 space-y-3">
          {/* Base styles indicator */}
          <div
            className={`flex items-center gap-2 p-2 rounded-md border cursor-pointer transition-colors ${
              !activeBreakpointId ? 'bg-secondary border-border' : 'bg-muted hover:bg-muted/80 border-border'
            }`}
            onClick={() => onSelectBreakpoint(null)}
          >
            <div className="flex items-center gap-2">
              <IconDevices stroke={1.5} className="size-4 text-muted-foreground" />
              <span className="text-xs font-medium">Base Styles</span>
            </div>
            <Badge variant={!activeBreakpointId ? 'default' : 'outline'}>Default</Badge>
          </div>

          {/* Breakpoint list */}
          {breakpoints.map((breakpoint) => {
            const Icon = getBreakpointIcon(breakpoint.value)
            const isActive = activeBreakpointId === breakpoint.id

            return (
              <div
                key={breakpoint.id}
                className={`flex items-center justify-between p-2 rounded-md border cursor-pointer transition-colors ${
                  isActive ? 'bg-accent border-primary' : 'bg-muted hover:bg-muted/80 border-border'
                }`}
                onClick={() => onSelectBreakpoint(breakpoint.id)}
              >
                <div className="flex items-center gap-2">
                  <Icon className="size-4 text-muted-foreground" />
                  <div className="flex flex-col">
                    <span className="text-xs font-medium">{breakpoint.label || `${breakpoint.type}`}</span>
                    <span className="text-tiny text-muted-foreground font-mono tabular-nums">
                      {breakpoint.type}: {breakpoint.value}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <Badge variant={isActive ? 'default' : 'outline'}>@media</Badge>
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-6 w-6 p-0 text-destructive hover:text-destructive"
                    onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
                      e.stopPropagation()
                      onRemoveBreakpoint(breakpoint.id)
                    }}
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            )
          })}

          {/* Add breakpoint button */}
          <Dialog
            open={dialogOpen}
            onOpenChange={setDialogOpen}
            buttonText="Add Breakpoint"
            title="Add Responsive Breakpoint"
            description="Add a new responsive breakpoint to the element"
          >
            <div className="space-y-4">
              {/* Presets */}
              <div>
                <Label className="text-xs font-medium mb-2 block">Quick Presets</Label>
                <div className="grid grid-cols-2 gap-2">
                  {BREAKPOINT_PRESETS.map((preset) => {
                    const Icon = preset.icon
                    return (
                      <Button
                        key={preset.label}
                        variant="outline"
                        // size="sm"
                        className="justify-start"
                        onClick={() => handleAddPreset(preset)}
                      >
                        <Icon className="h-3 w-3 mr-2" />
                        <div>
                          <span className="text-xs font-medium">{preset.label}</span>
                          <span className="text-xs text-muted-foreground font-mono ml-2 tabular-nums">
                            {preset.value}
                          </span>
                        </div>
                      </Button>
                    )
                  })}
                </div>
              </div>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-background px-2 text-muted-foreground">Or Custom</span>
                </div>
              </div>

              {/* Custom breakpoint */}
              <FieldGroup>
                <Field>
                  <FieldLabel htmlFor="breakpoint-label" className="text-xs">
                    Label (Optional)
                  </FieldLabel>
                  <Input
                    id="breakpoint-label"
                    value={newBreakpointLabel}
                    onChange={(e) => setNewBreakpointLabel(e.target.value)}
                    placeholder="e.g., Mobile, Tablet"
                    className="text-xs h-8"
                  />
                </Field>

                <Field>
                  <FieldLabel htmlFor="breakpoint-type" className="text-xs">
                    Type
                  </FieldLabel>
                  <Select
                    value={newBreakpointType}
                    onValueChange={(value) => setNewBreakpointType(value as BreakpointType)}
                  >
                    <SelectTrigger id="breakpoint-type" className="text-xs h-8">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="min-width">min-width</SelectItem>
                      <SelectItem value="max-width">max-width</SelectItem>
                      <SelectItem value="min-height">min-height</SelectItem>
                      <SelectItem value="max-height">max-height</SelectItem>
                    </SelectContent>
                  </Select>
                </Field>

                <Field>
                  <FieldLabel htmlFor="breakpoint-value" className="text-xs">
                    Value
                  </FieldLabel>
                  <Input
                    id="breakpoint-value"
                    value={newBreakpointValue}
                    onChange={(e) => setNewBreakpointValue(e.target.value)}
                    placeholder="e.g., 768px, 50rem"
                    className="text-xs h-8"
                  />
                </Field>
              </FieldGroup>

              <Button onClick={handleAddBreakpoint} disabled={!newBreakpointValue.trim()} className="w-full" size="sm">
                Add Custom Breakpoint
              </Button>
            </div>
          </Dialog>
        </CollapsiblePanel>
      </Collapsible>
    </div>
  )
}
