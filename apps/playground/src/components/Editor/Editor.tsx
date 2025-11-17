import type { CoralRootNode, CoralStyleType } from "@reallygoodwork/coral-core";
import { transformHTMLToSpec } from "@reallygoodwork/coral-core";
import { useCallback, useMemo, useState } from "react";
import { toast } from "sonner";
import { BreakpointManager } from "@/components/Editor/BreakpointManager/BreakpointManager";
import { useBreakpointManager } from "@/components/Editor/Configuration/hooks/useBreakpointManager";
import { parseBreakpointIndex } from "@/components/Editor/Configuration/utils/breakpointHelpers";
import { EditorSidebar } from "@/components/Editor/ElementTree/EditorSidebar";
import { ImportCodeDialog } from "@/components/Editor/ImportCodeDialog";
import { EditorPreviewPane } from "@/components/Editor/Preview/EditorPreviewPane";
import type { ElementTreeNode } from "@/hooks/useElementTree";
import { useElementTreeQuery } from "@/hooks/useElementTreeQuery";
import { useKeyboardShortcuts } from "@/hooks/useKeyboardShortcuts";
import { useElementSelectionStore } from "@/stores/useElementSelectionStore";
import {
	convertCoralStylesToFormValues,
	convertFormValuesToCoralStyles,
} from "@/utils/convertFormToCoralStyles";
import { getDefaultDisplayValue } from "@/utils/elementDisplay";
import { ScrollArea } from "../base/ScrollArea";
import { ComponentForm } from "./component-manager/componentForm";
import type { FormValues as ComponentFormValues } from "./component-manager/formSchema";
import type { StyleFormValues } from "./style-manager/formSchema";
import { StyleForm } from "./style-manager/styleForm";

export const Editor = () => {
	const selectedElementId = useElementSelectionStore(
		(state) => state.selectedElementId,
	);
	const setSelectedElementId = useElementSelectionStore(
		(state) => state.setSelectedElementId,
	);
	const [importDialogOpen, setImportDialogOpen] = useState(false);
	const [viewportSyncEnabled, setViewportSyncEnabled] = useState(true);
	const elementTreeHook = useElementTreeQuery();
	const {
		elements,
		getElementTree,
		replaceAllElements,
		updateElement,
		removeElement,
	} = elementTreeHook;

	// Get the selected element
	const selectedElement = useMemo(() => {
		return selectedElementId
			? elements.find((el) => el.id === selectedElementId)
			: null;
	}, [elements, selectedElementId]);

	// Helper function to parse breakpoint value to viewport width
	const parseBreakpointWidth = useCallback((breakpointValue: string): number => {
		// Extract numeric value from string (e.g., "768px" -> 768)
		const match = breakpointValue.match(/^(\d+(?:\.\d+)?)(px|rem|em)?$/);
		if (!match) return 1440; // Default to desktop width

		const value = parseFloat(match[1]!);
		const unit = match[2] || "px";

		// Convert to px (assuming 16px base for rem/em)
		switch (unit) {
			case "rem":
			case "em":
				return value * 16;
			default:
				return value;
		}
	}, []);

	// Create an update property function compatible with useBreakpointManager
	const updateProperty = useCallback(
		(property: keyof ElementTreeNode, value: unknown) => {
			if (!selectedElementId) return;
			updateElement(selectedElementId, { [property]: value });
		},
		[selectedElementId, updateElement],
	);

	// Breakpoint management
	const breakpointManager = useBreakpointManager(
		selectedElement,
		updateProperty,
	);
	const {
		activeBreakpointId,
		breakpoints,
		handleAddBreakpoint,
		handleRemoveBreakpoint,
		handleSelectBreakpoint,
	} = breakpointManager;

	// Convert element styles to form values for initial values
	const formInitialValues = useMemo(() => {
		if (!selectedElement) {
			return undefined;
		}

		// If a breakpoint is active, load styles from that breakpoint
		// Otherwise, load from base styles
		let stylesToLoad: Record<string, unknown> | undefined;

		if (activeBreakpointId && selectedElement.responsiveStyles) {
			const breakpointIndex = parseBreakpointIndex(activeBreakpointId);
			const breakpointStyles =
				selectedElement.responsiveStyles[breakpointIndex]?.styles;
			stylesToLoad = breakpointStyles as Record<string, unknown> | undefined;
		} else {
			stylesToLoad = selectedElement.styles as
				| Record<string, unknown>
				| undefined;
		}

		const baseFormValues = stylesToLoad
			? (convertCoralStylesToFormValues(stylesToLoad) as Partial<StyleFormValues>)
			: {};

		// Set default display value for inline elements if not already set in styles
		// This only affects the UI - showing 'inline' for elements like span, a, strong, etc.
		// The value won't be persisted to the element's styles until the user explicitly changes it
		// because handleStyleChange only persists fields that are in changedFields
		// Only apply this default for base styles, not breakpoint-specific styles
		if (
			!activeBreakpointId &&
			!baseFormValues.display &&
			selectedElement.elementType
		) {
			const defaultDisplay = getDefaultDisplayValue(
				selectedElement.elementType,
			);
			if (defaultDisplay === "inline") {
				baseFormValues.display = "inline";
			}
		}

		return baseFormValues;
	}, [selectedElement, activeBreakpointId]);

	// Convert element properties to component form initial values
	const componentFormInitialValues = useMemo(() => {
		if (!selectedElement) {
			return undefined;
		}
		return {
			name: selectedElement.name || "",
			description: selectedElement.description || undefined,
			type: selectedElement.elementType || "div",
			textContent: selectedElement.textContent || undefined,
		} as Partial<ComponentFormValues>;
	}, [selectedElement]);

	// Create a stable key for the form based on element ID and active breakpoint
	// This ensures the form remounts when switching elements or breakpoints
	const formKey = `${selectedElementId}-${activeBreakpointId || "base"}`;

	// Handle style form changes - only merge the changed style
	const handleStyleChange = useCallback(
		(formValues: StyleFormValues, changedFields?: Record<string, unknown>) => {
			if (!selectedElementId || !selectedElement) return;

			// Only convert the fields that were actually changed
			// Include related unit fields for dimension properties
			const fieldsToConvert: Record<string, unknown> = {};

			if (changedFields && Object.keys(changedFields).length > 0) {
				// Add changed fields
				Object.keys(changedFields).forEach((key) => {
					fieldsToConvert[key] = changedFields[key];

					// If this is a dimension value field, also include its unit field
					// Check if this key has a corresponding unit field
					const unitKey = `${key}Unit`;
					if (unitKey in formValues) {
						fieldsToConvert[unitKey] =
							formValues[unitKey as keyof StyleFormValues];
					}

					// If this is a unit field, also include its value field
					// Check if this is a unit field (ends with Unit)
					if (key.endsWith("Unit")) {
						const valueKey = key.replace("Unit", "");
						if (valueKey in formValues) {
							fieldsToConvert[valueKey] =
								formValues[valueKey as keyof StyleFormValues];
						}
					}
				});
			} else {
				// Fallback: if no changedFields provided, use all form values
				// But this shouldn't happen in normal operation
				Object.assign(fieldsToConvert, formValues);
			}

			// Convert only the changed fields to Coral styles
			const coralStyles = convertFormValuesToCoralStyles(
				fieldsToConvert as Record<string, unknown>,
			);

			// Check if we're editing a breakpoint or base styles
			if (activeBreakpointId && selectedElement.responsiveStyles) {
				// Editing breakpoint-specific styles
				const breakpointIndex = parseBreakpointIndex(activeBreakpointId);
				const updatedResponsiveStyles = [
					...(selectedElement.responsiveStyles || []),
				];

				if (updatedResponsiveStyles[breakpointIndex]) {
					// Merge with existing breakpoint styles
					updatedResponsiveStyles[breakpointIndex] = {
						...updatedResponsiveStyles[breakpointIndex]!,
						styles: {
							...(updatedResponsiveStyles[breakpointIndex]!.styles || {}),
							...coralStyles,
						},
					};

					updateElement(selectedElementId, {
						responsiveStyles: updatedResponsiveStyles,
					});
				}
			} else {
				// Editing base styles (no breakpoint active)
				const mergedStyles = {
					...(selectedElement.styles || {}),
					...coralStyles,
				};

				updateElement(selectedElementId, {
					styles: mergedStyles as CoralStyleType,
				});
			}
		},
		[selectedElementId, selectedElement, updateElement, activeBreakpointId],
	);

	// Handle component form changes
	const handleComponentChange = useCallback(
		(
			formValues: ComponentFormValues,
			changedFields?: Record<string, unknown>,
		) => {
			if (!selectedElementId || !selectedElement) return;

			const updates: Record<string, unknown> = {};

			// Update name if changed
			if (changedFields && "name" in changedFields) {
				updates["name"] = formValues["name"];
			}

			// Update description - remove if empty/undefined, otherwise set it
			if (changedFields && "description" in changedFields) {
				const descriptionValue = formValues["description"];
				if (descriptionValue && descriptionValue.trim() !== "") {
					updates["description"] = descriptionValue.trim();
				} else {
					// Remove description by setting it to undefined
					// This will be filtered out in convertToCoralSpec
					updates["description"] = undefined;
				}
			}

			// Update elementType if changed
			if (changedFields && "type" in changedFields) {
				updates["elementType"] = formValues["type"];
			}

			// Update textContent if changed
			if (changedFields && "textContent" in changedFields) {
				const textContentValue = formValues["textContent"];
				if (textContentValue && textContentValue.trim() !== "") {
					updates["textContent"] = textContentValue.trim();
				} else {
					// Remove textContent by setting it to undefined
					updates["textContent"] = undefined;
				}
			}

			// Only update if there are actual changes
			if (Object.keys(updates).length > 0) {
				updateElement(selectedElementId, updates as Partial<ElementTreeNode>);
			}
		},
		[selectedElementId, selectedElement, updateElement],
	);

	const convertToCoralSpec = (): CoralRootNode => {
		// Get fresh element tree on each render
		const elementTree = getElementTree();

		if (elementTree.length === 0) {
			return {
				name: "root",
				elementType: "div",
				type: "NODE",
				children: [],
			} as CoralRootNode;
		}

		const buildCoralNode = (element: ElementTreeNode): CoralRootNode => {
			const node = {
				id: element.id, // Preserve ID for click handlers
				name: element.name,
				elementType: element.elementType,
				type: element.type || "NODE",
				textContent: element.textContent,
				description: element.description,
				elementAttributes: element.elementAttributes,
				styles: element.styles, // Include styles in the coral spec
				responsiveStyles: element.responsiveStyles, // Include responsive styles
				children:
					element.children && element.children.length > 0
						? element.children.map((child) =>
								buildCoralNode(child as ElementTreeNode),
							)
						: undefined,
			};

			return Object.fromEntries(
				Object.entries(node).filter(([_, value]) => value !== undefined),
			) as unknown as CoralRootNode;
		};

		if (elementTree.length === 1) {
			return buildCoralNode(elementTree[0]!) as CoralRootNode;
		}

		return {
			name: "root",
			elementType: "div",
			type: "NODE",
			children: elementTree.map(buildCoralNode),
		} as CoralRootNode;
	};

	// Force re-render when elements change
	const spec = convertToCoralSpec();

	const handleImportCode = (code: string) => {
		try {
			const spec = transformHTMLToSpec(code);

			// Convert the coral spec to ElementTreeNode format
			const convertCoralToElements = (
				node: CoralRootNode,
				parentId?: string,
			): ElementTreeNode[] => {
				const id = `element_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
				const element: ElementTreeNode = {
					id,
					parentId,
					name: node.name || node.elementType,
					elementType: node.elementType,
					type: node.type || "NODE",
					isExpanded: true,
				};

				if (node.textContent) {
					element.textContent = node.textContent;
				}
				if (node.elementAttributes) {
					element.elementAttributes = node.elementAttributes;
				}
				if (node.styles) {
					element.styles = node.styles;
				}
				if (node.responsiveStyles) {
					element.responsiveStyles = node.responsiveStyles;
				}

				let allElements = [element];

				if (node.children && node.children.length > 0) {
					node.children.forEach((child: CoralRootNode) => {
						const childElements = convertCoralToElements(child, id);
						allElements = [...allElements, ...childElements];
					});
				}

				return allElements;
			};

			const importedElements = convertCoralToElements(spec, "root");

			// Create root element and ensure imported elements are children of root
			const rootElement: ElementTreeNode = {
				id: "root",
				name: "Root",
				elementType: "div",
				type: "NODE",
				isExpanded: true,
				children: [],
			};

			// Ensure all top-level imported elements have root as parent
			const elementsWithRootParent = importedElements.map((el) => {
				// If element has no parentId or parentId is undefined, set it to 'root'
				if (!el.parentId) {
					return { ...el, parentId: "root" as string };
				}
				return el;
			});

			// Combine root element with imported elements
			const newElements = [rootElement, ...elementsWithRootParent];

			// Replace all elements with the imported ones (including root)
			replaceAllElements(newElements);

			toast.success("Component imported successfully");
		} catch (error) {
			toast.error(`Failed to import: ${(error as Error).message}`);
		}
	};

	// Handle delete element
	const handleDelete = useCallback(() => {
		if (!selectedElementId) return;

		// Can't delete root element
		if (selectedElementId === "root") {
			toast.error("Cannot delete root element");
			return;
		}

		removeElement(selectedElementId);
		setSelectedElementId(null);
		toast.success("Element deleted");
	}, [selectedElementId, removeElement, setSelectedElementId]);

	// TODO: Implement undo/redo with TanStack Query
	const handleUndo = useCallback(() => {
		// Placeholder for undo functionality
		toast.info("Undo functionality coming soon");
	}, []);

	const handleRedo = useCallback(() => {
		// Placeholder for redo functionality
		toast.info("Redo functionality coming soon");
	}, []);

	// Set up keyboard shortcuts
	const shortcuts = useMemo(
		() => [
			{
				key: "Delete",
				handler: handleDelete,
			},
			{
				key: "Backspace",
				handler: handleDelete,
			},
			{
				key: "z",
				ctrlKey: true,
				metaKey: true,
				handler: handleUndo,
			},
			{
				key: "y",
				ctrlKey: true,
				metaKey: true,
				handler: handleRedo,
			},
			{
				key: "z",
				ctrlKey: true,
				metaKey: true,
				shiftKey: true,
				handler: handleRedo,
			},
		],
		[handleDelete, handleUndo, handleRedo],
	);

	useKeyboardShortcuts(shortcuts);

	return (
		<div className="flex flex-col w-full h-[calc(100dvh-2.5rem)] mt-10 bg-background">
			{/* <div className="flex items-center justify-between gap-2 px-4 py-2 shrink-0 h-10">
        <div className="flex items-center gap-2 place-self-center">
          <p className="text-xs font-medium">Name</p>
          <Badge variant="destructive">Unsaved</Badge>
        </div>
        <div className="flex items-center gap-2 justify-self-end">
          <Button
            variant="secondary"
            size="icon-sm"
            onClick={() => setImportDialogOpen(true)}
            title="Import from Code"
            aria-label="Import from Code"
          >
            <IconFileImport className="size-3.5" />
          </Button>

          <Button variant="secondary" size="icon-sm" onClick={handleUndo} title="Undo (⌘Z / Ctrl+Z)">
            <Undo className="size-3.5" />
          </Button>
          <Button variant="ghost" size="icon-sm" onClick={handleRedo} title="Redo (⌘⇧Z / Ctrl+Y)">
            <Redo className="size-3.5" />
          </Button>
        </div>
      </div> */}
			<div className="flex flex-1 h-[calc(100dvh-2.5rem)] max-h-[calc(100dvh-2.5rem)] overflow-hidden">
				<aside className="w-64 flex flex-col h-full overflow-hidden p-2.5">
					<EditorSidebar />
				</aside>
				<main className="bg-background flex-1 overflow-hidden pt-2.5">
					<EditorPreviewPane
						spec={spec}
						importDialogOpen={importDialogOpen}
						setImportDialogOpen={setImportDialogOpen}
						handleImportCode={handleImportCode}
						handleUndo={handleUndo}
						handleRedo={handleRedo}
						activeBreakpoint={
							activeBreakpointId
								? breakpoints.find((bp) => bp.id === activeBreakpointId)
								: null
						}
						viewportSyncEnabled={viewportSyncEnabled}
						onViewportSyncToggle={() =>
							setViewportSyncEnabled(!viewportSyncEnabled)
						}
						parseBreakpointWidth={parseBreakpointWidth}
					/>
				</main>
				<aside className="w-72 h-full overflow-hidden">
					{selectedElement ? (
						<ScrollArea
							innerClassName="flex flex-col gap-2.5 py-2.5"
							className="px-2.5"
						>
							<ComponentForm
								key={`component-form-${formKey || "none"}`}
								onChange={handleComponentChange}
								{...(componentFormInitialValues
									? { initialValues: componentFormInitialValues }
									: {})}
							/>
							<BreakpointManager
								breakpoints={breakpoints}
								onAddBreakpoint={handleAddBreakpoint}
								onRemoveBreakpoint={handleRemoveBreakpoint}
								activeBreakpointId={activeBreakpointId}
								onSelectBreakpoint={handleSelectBreakpoint}
							/>
							<StyleForm
								key={`style-form-${formKey || "none"}`}
								onChange={handleStyleChange}
								{...(formInitialValues
									? { initialValues: formInitialValues }
									: {})}
							/>
						</ScrollArea>
					) : (
						<div className="flex flex-col items-center justify-center h-full p-8 text-center">
							<div className="text-muted-foreground">
								<p className="text-sm font-medium mb-2">No element selected</p>
								<p className="text-xs">
									Select an element from the tree to edit its styles
								</p>
							</div>
						</div>
					)}
				</aside>
			</div>
			<ImportCodeDialog
				open={importDialogOpen}
				onOpenChange={setImportDialogOpen}
				onImport={handleImportCode}
			/>
		</div>
	);
};
