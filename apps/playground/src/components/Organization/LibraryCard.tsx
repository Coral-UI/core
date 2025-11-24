'use client'

import type { Library } from '@/types'
import { Button } from '@/components/primitives/Button/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/primitives/Card/card'
import { useDeleteLibrary } from '@/hooks/queries/useLibraries'
import { formatDateReadable } from '@/lib/utils/date-format'
import Link from 'next/link'
import { Trash2Icon } from 'lucide-react'

interface LibraryCardProps {
  library: Library
  organizationId: string
}

export function LibraryCard({ library, organizationId }: LibraryCardProps) {
  const deleteLibrary = useDeleteLibrary()

  const handleDelete = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (confirm(`Are you sure you want to delete "${library.name}"? This will delete all components.`)) {
      deleteLibrary.mutate({ id: library.id, organizationId })
    }
  }

  return (
    <Link href={`/orgs/${organizationId}/libraries/${library.id}`}>
      <Card className="hover:shadow-md transition-shadow cursor-pointer h-full">
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <CardTitle>{library.name}</CardTitle>
              {library.description && <CardDescription className="mt-1">{library.description}</CardDescription>}
              <CardDescription className="mt-1">
                Created {formatDateReadable(library.createdAt)}
              </CardDescription>
            </div>
            <Button variant="ghost" size="icon-sm" onClick={handleDelete} className="shrink-0">
              <Trash2Icon className="size-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">Click to view components</p>
        </CardContent>
      </Card>
    </Link>
  )
}
