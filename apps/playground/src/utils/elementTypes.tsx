import {
  IconArticle,
  IconClick,
  IconH1,
  IconH2,
  IconH3,
  IconH4,
  IconH5,
  IconH6,
  IconLayoutBottombar,
  IconLayoutNavbar,
  IconLayoutSidebarLeftExpand,
  IconListDetails,
  IconPilcrow,
  IconTheater,
} from '@tabler/icons-react'
import {
  AlignLeft,
  Bold,
  Calendar,
  Circle,
  Code,
  DropletIcon,
  FileText,
  FormInput,
  Hash,
  ImageIcon,
  Italic,
  Link2,
  LinkIcon,
  ListIcon,
  ListOrderedIcon,
  Minus,
  Music,
  Pencil,
  Quote,
  RectangleHorizontal,
  Shapes,
  Square,
  SquareMousePointerIcon,
  Table,
  Text,
  TextCursorInputIcon,
  Type,
  Video,
} from 'lucide-react'

import { CoralElementType } from '@reallygoodwork/coral-core'

export interface ElementTypeDefinition {
  type: CoralElementType
  label: string
  icon: JSX.Element
  group: string
}

export interface ElementTypeGroup {
  name: string
  items: ElementTypeDefinition[]
}

export const ELEMENT_TYPE_DEFINITIONS: ElementTypeDefinition[] = [
  // Layout & Structure
  { type: 'div', label: 'Div', icon: <SquareMousePointerIcon className="w-3 h-3" />, group: 'Layout & Structure' },
  { type: 'main', label: 'Main', icon: <Square className="w-3 h-3" />, group: 'Layout & Structure' },
  { type: 'section', label: 'Section', icon: <Square className="w-3 h-3" />, group: 'Layout & Structure' },
  { type: 'article', label: 'Article', icon: <IconArticle className="w-3 h-3" />, group: 'Layout & Structure' },
  {
    type: 'aside',
    label: 'Aside',
    icon: <IconLayoutSidebarLeftExpand className="w-3 h-3" />,
    group: 'Layout & Structure',
  },
  { type: 'nav', label: 'Navigation', icon: <IconLayoutNavbar className="w-3 h-3" />, group: 'Layout & Structure' },
  { type: 'header', label: 'Header', icon: <IconTheater className="w-3 h-3" />, group: 'Layout & Structure' },
  { type: 'footer', label: 'Footer', icon: <IconLayoutBottombar className="w-3 h-3" />, group: 'Layout & Structure' },

  // Headings
  { type: 'h1', label: 'Heading 1', icon: <IconH1 className="w-3 h-3" />, group: 'Headings' },
  { type: 'h2', label: 'Heading 2', icon: <IconH2 className="w-3 h-3" />, group: 'Headings' },
  { type: 'h3', label: 'Heading 3', icon: <IconH3 className="w-3 h-3" />, group: 'Headings' },
  { type: 'h4', label: 'Heading 4', icon: <IconH4 className="w-3 h-3" />, group: 'Headings' },
  { type: 'h5', label: 'Heading 5', icon: <IconH5 className="w-3 h-3" />, group: 'Headings' },
  { type: 'h6', label: 'Heading 6', icon: <IconH6 className="w-3 h-3" />, group: 'Headings' },

  // Text Content
  { type: 'p', label: 'Paragraph', icon: <IconPilcrow className="w-3 h-3" />, group: 'Text Content' },
  { type: 'span', label: 'Span', icon: <Type className="w-3 h-3" />, group: 'Text Content' },
  { type: 'text', label: 'Text', icon: <Text className="w-3 h-3" />, group: 'Text Content' },
  { type: 'strong', label: 'Strong', icon: <Bold className="w-3 h-3" />, group: 'Text Content' },
  { type: 'em', label: 'Emphasis', icon: <Italic className="w-3 h-3" />, group: 'Text Content' },
  { type: 'code', label: 'Code', icon: <Code className="w-3 h-3" />, group: 'Text Content' },
  { type: 'pre', label: 'Preformatted', icon: <FileText className="w-3 h-3" />, group: 'Text Content' },
  { type: 'blockquote', label: 'Blockquote', icon: <Quote className="w-3 h-3" />, group: 'Text Content' },

  // Interactive Elements
  { type: 'button', label: 'Button', icon: <IconClick className="w-3 h-3" />, group: 'Interactive' },
  { type: 'a', label: 'Link', icon: <LinkIcon className="w-3 h-3" />, group: 'Interactive' },

  // Form Elements
  { type: 'form', label: 'Form', icon: <FormInput className="w-3 h-3" />, group: 'Forms' },
  { type: 'input', label: 'Input', icon: <TextCursorInputIcon className="w-3 h-3" />, group: 'Forms' },
  { type: 'textarea', label: 'Textarea', icon: <AlignLeft className="w-3 h-3" />, group: 'Forms' },
  { type: 'select', label: 'Select', icon: <DropletIcon className="w-3 h-3" />, group: 'Forms' },
  { type: 'option', label: 'Option', icon: <Minus className="w-3 h-3" />, group: 'Forms' },
  { type: 'label', label: 'Label', icon: <Hash className="w-3 h-3" />, group: 'Forms' },
  { type: 'fieldset', label: 'Fieldset', icon: <Square className="w-3 h-3" />, group: 'Forms' },
  { type: 'legend', label: 'Legend', icon: <Type className="w-3 h-3" />, group: 'Forms' },

  // Lists
  { type: 'ul', label: 'Unordered List', icon: <ListIcon className="w-3 h-3" />, group: 'Lists' },
  { type: 'ol', label: 'Ordered List', icon: <ListOrderedIcon className="w-3 h-3" />, group: 'Lists' },
  { type: 'li', label: 'List Item', icon: <IconListDetails className="w-3 h-3" />, group: 'Lists' },
  { type: 'dl', label: 'Definition List', icon: <ListIcon className="w-3 h-3" />, group: 'Lists' },
  { type: 'dt', label: 'Definition Term', icon: <Type className="w-3 h-3" />, group: 'Lists' },
  { type: 'dd', label: 'Definition Description', icon: <AlignLeft className="w-3 h-3" />, group: 'Lists' },

  // Media
  { type: 'img', label: 'Image', icon: <ImageIcon className="w-3 h-3" />, group: 'Media' },
  { type: 'audio', label: 'Audio', icon: <Music className="w-3 h-3" />, group: 'Media' },
  { type: 'video', label: 'Video', icon: <Video className="w-3 h-3" />, group: 'Media' },
  { type: 'source', label: 'Source', icon: <Link2 className="w-3 h-3" />, group: 'Media' },
  { type: 'canvas', label: 'Canvas', icon: <Pencil className="w-3 h-3" />, group: 'Media' },

  // Table
  { type: 'table', label: 'Table', icon: <Table className="w-3 h-3" />, group: 'Tables' },
  { type: 'thead', label: 'Table Head', icon: <RectangleHorizontal className="w-3 h-3" />, group: 'Tables' },
  { type: 'tbody', label: 'Table Body', icon: <RectangleHorizontal className="w-3 h-3" />, group: 'Tables' },
  { type: 'tfoot', label: 'Table Footer', icon: <RectangleHorizontal className="w-3 h-3" />, group: 'Tables' },
  { type: 'tr', label: 'Table Row', icon: <Minus className="w-3 h-3" />, group: 'Tables' },
  { type: 'th', label: 'Table Header', icon: <Square className="w-3 h-3" />, group: 'Tables' },
  { type: 'td', label: 'Table Data', icon: <Square className="w-3 h-3" />, group: 'Tables' },
  { type: 'caption', label: 'Caption', icon: <Type className="w-3 h-3" />, group: 'Tables' },

  // Other
  { type: 'time', label: 'Time', icon: <Calendar className="w-3 h-3" />, group: 'Other' },
  { type: 'figure', label: 'Figure', icon: <ImageIcon className="w-3 h-3" />, group: 'Other' },
  { type: 'figcaption', label: 'Figure Caption', icon: <Type className="w-3 h-3" />, group: 'Other' },
  { type: 'hr', label: 'Horizontal Rule', icon: <Minus className="w-3 h-3" />, group: 'Other' },
  { type: 'br', label: 'Line Break', icon: <Minus className="w-3 h-3" />, group: 'Other' },

  // SVG
  { type: 'svg', label: 'SVG', icon: <Shapes className="w-3 h-3" />, group: 'SVG' },
  { type: 'circle', label: 'Circle', icon: <Circle className="w-3 h-3" />, group: 'SVG' },
  { type: 'rect', label: 'Rectangle', icon: <Square className="w-3 h-3" />, group: 'SVG' },
  { type: 'path', label: 'Path', icon: <Pencil className="w-3 h-3" />, group: 'SVG' },
  { type: 'ellipse', label: 'Ellipse', icon: <Circle className="w-3 h-3" />, group: 'SVG' },
  { type: 'polygon', label: 'Polygon', icon: <Shapes className="w-3 h-3" />, group: 'SVG' },
  { type: 'line', label: 'Line', icon: <Minus className="w-3 h-3" />, group: 'SVG' },
  { type: 'polyline', label: 'Polyline', icon: <Pencil className="w-3 h-3" />, group: 'SVG' },
  { type: 'g', label: 'Group', icon: <Shapes className="w-3 h-3" />, group: 'SVG' },
]

// Helper function to group element types
export const getElementTypeGroups = (
  filterFn?: (elementType: ElementTypeDefinition) => boolean,
): ElementTypeGroup[] => {
  const filtered = filterFn ? ELEMENT_TYPE_DEFINITIONS.filter(filterFn) : ELEMENT_TYPE_DEFINITIONS

  const grouped = filtered.reduce((acc, item) => {
    const existing = acc.find((g) => g.name === item.group)
    if (existing) {
      existing.items.push(item)
    } else {
      acc.push({ name: item.group, items: [item] })
    }
    return acc
  }, [] as ElementTypeGroup[])

  return grouped
}
