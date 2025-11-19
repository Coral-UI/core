import type { Component } from '@/types'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useDeleteComponent } from '@/hooks/queries/useComponents'
import { Link } from '@tanstack/react-router'
import { EditIcon, Trash2Icon } from 'lucide-react'

interface ComponentCardProps {
  component: Component
  organizationId: string
  libraryId: string
}

export function ComponentCard({ component, organizationId, libraryId }: ComponentCardProps) {
  const deleteComponent = useDeleteComponent()

  const handleDelete = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (confirm(`Are you sure you want to delete "${component.name}"?`)) {
      deleteComponent.mutate({ id: component.id, libraryId })
    }
  }

  return (
    <Link
      to="/orgs/$orgId/libraries/$libraryId/components/$componentId/edit"
      params={{ orgId: organizationId, libraryId, componentId: component.id }}
    >
      <Card className="hover:shadow-md transition-shadow cursor-pointer h-full">
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <CardTitle className="flex items-center gap-2">
                {component.name}
                <EditIcon className="size-4 text-muted-foreground" />
              </CardTitle>
              {component.description && <CardDescription className="mt-1">{component.description}</CardDescription>}
              <CardDescription className="mt-1">
                Created {new Date(component.createdAt).toLocaleDateString()}
              </CardDescription>
            </div>
            <Button variant="ghost" size="icon-sm" onClick={handleDelete} className="shrink-0">
              <Trash2Icon className="size-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">Click to edit component</p>
        </CardContent>
      </Card>
    </Link>
  )
}
