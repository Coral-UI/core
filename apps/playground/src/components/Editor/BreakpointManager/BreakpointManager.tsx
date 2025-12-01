import { useBreakpointManager } from '@/components/Editor/Configuration/hooks/useBreakpointManager'
import { UpdatePropertyFn } from '@/components/Editor/Configuration/types/elementProperties'
import { Badge } from '@/components/primitives/Badge/badge'
import { Button } from '@/components/primitives/Button/button'
import { Dialog } from '@/components/primitives/Dialog/dialog'
import { Field } from '@/components/primitives/Field/Field'
import { Input } from '@/components/primitives/Input/input'
import { SelectInput } from '@/components/primitives/Select/select'
import { Label } from '@/components/ui/label'
import { ElementTreeNode } from '@/hooks/useElementTree'
import { cn } from '@/lib/utils'
import { IconDevices, IconTrash } from '@tabler/icons-react'
import { Monitor, Smartphone, Tablet } from 'lucide-react'
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
  element: ElementTreeNode | null
  updateProperty: UpdatePropertyFn
}

export const BreakpointManager = ({ element, updateProperty }: BreakpointManagerProps) => {
  // Use the breakpoint manager hook which handles state and viewport syncing
  const { breakpoints, activeBreakpointId, handleAddBreakpoint, handleRemoveBreakpoint, handleSelectBreakpoint } =
    useBreakpointManager(element, updateProperty)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [newBreakpointType, setNewBreakpointType] = useState<BreakpointType>('min-width')
  const [newBreakpointValue, setNewBreakpointValue] = useState('')
  const [newBreakpointLabel, setNewBreakpointLabel] = useState('')

  const handleAddBreakpointClick = () => {
    if (!newBreakpointValue.trim()) return

    handleAddBreakpoint({
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
    handleAddBreakpoint({
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
    <div className="gap-2.5 pb-4 pt-1 border-b border-border px-2.5 flex flex-col">
      <div className="mt-4 space-y-3">
        {/* Base styles indicator */}
        <div
          className={`flex items-center gap-2 p-2 rounded-md border cursor-pointer transition-colors ${
            !activeBreakpointId ? 'bg-secondary border-border' : 'bg-muted hover:bg-muted/80 border-border'
          }`}
          onClick={() => handleSelectBreakpoint(null)}
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
              className={`flex items-center justify-between p-2 rounded-md cursor-pointer transition-colors ${
                isActive ? 'bg-primary' : 'bg-secondary hover:bg-secondary-hover border-border'
              }`}
              onClick={() => handleSelectBreakpoint(breakpoint.id)}
            >
              <div className="flex items-center gap-2">
                <Icon className="size-4 text-muted-foreground" />
                <div className="flex flex-col">
                  <span className={cn('text-xs font-medium text-foreground', isActive && 'text-primary-foreground')}>
                    {breakpoint.label || `${breakpoint.type}`}
                  </span>
                  <span className="text-xs text-muted-foreground font-mono tabular-nums">
                    {breakpoint.type}: {breakpoint.value}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <Badge variant={isActive ? 'success' : 'outline'}>@media</Badge>
                <Button
                  variant="destructive"
                  size="icon-sm"
                  onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
                    e.stopPropagation()
                    handleRemoveBreakpoint(breakpoint.id)
                  }}
                >
                  <IconTrash className="size-3" />
                </Button>
              </div>
            </div>
          )
        })}

        {/* Add breakpoint button */}
        <Dialog
          open={dialogOpen}
          onOpenChange={setDialogOpen}
          buttonVariant="secondary"
          buttonSize="sm"
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
                      size="sm"
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
            <fieldset>
              <Field label="Label (Optional)">
                <Input
                  id="breakpoint-label"
                  value={newBreakpointLabel}
                  onChange={(e) => setNewBreakpointLabel(e.target.value)}
                  placeholder="e.g., Mobile, Tablet"
                  className="text-xs h-8"
                />
              </Field>

              <Field label="Type">
                <SelectInput
                  items={[
                    { value: 'min-width', label: 'min-width' },
                    { value: 'max-width', label: 'max-width' },
                    { value: 'min-height', label: 'min-height' },
                    { value: 'max-height', label: 'max-height' },
                  ]}
                  value={newBreakpointType}
                  onValueChange={(value) => setNewBreakpointType(value as BreakpointType)}
                />
              </Field>

              <Field label="Value">
                <Input
                  id="breakpoint-value"
                  value={newBreakpointValue}
                  onChange={(e) => setNewBreakpointValue(e.target.value)}
                  placeholder="e.g., 768px, 50rem"
                  className="text-xs h-8"
                />
              </Field>
            </fieldset>

            <Button onClick={handleAddBreakpointClick} disabled={!newBreakpointValue.trim()} size="sm">
              Add Custom Breakpoint
            </Button>
          </div>
        </Dialog>
      </div>
    </div>
  )
}
