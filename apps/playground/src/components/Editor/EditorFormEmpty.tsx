import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty"
import { IconComponents } from "@tabler/icons-react"

export const EmptyEditorForm = () => {
  return (
    <Empty>
      <EmptyHeader>
      <EmptyMedia variant="icon">
          <IconComponents strokeWidth={1.5}  />
        </EmptyMedia>
        <EmptyTitle>No Element Selected</EmptyTitle>
      </EmptyHeader>
      <EmptyContent>
        <EmptyDescription>
          Select an element to edit its properties.
        </EmptyDescription>
      </EmptyContent>
    </Empty>
  )
}