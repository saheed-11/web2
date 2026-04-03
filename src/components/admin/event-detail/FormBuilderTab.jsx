import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  GripVertical,
  Plus,
  Trash2,
  Copy,
  Eye,
  Save,
  Type,
  AlignLeft,
  ListOrdered,
  CheckSquare,
  ChevronDown,
  Calendar,
  Upload,
  Mail,
  Phone,
  Hash,
  FileText,
  Star,
} from 'lucide-react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';

const FIELD_TYPES = [
  { id: 'text', label: 'Short Text', icon: Type },
  { id: 'paragraph', label: 'Paragraph', icon: AlignLeft },
  { id: 'email', label: 'Email', icon: Mail },
  { id: 'phone', label: 'Phone', icon: Phone },
  { id: 'number', label: 'Number', icon: Hash },
  { id: 'radio', label: 'Multiple Choice', icon: ListOrdered },
  { id: 'checkbox', label: 'Checkboxes', icon: CheckSquare },
  { id: 'dropdown', label: 'Dropdown', icon: ChevronDown },
  { id: 'date', label: 'Date', icon: Calendar },
  { id: 'file', label: 'File Upload', icon: Upload },
  { id: 'ieeeId', label: 'IEEE Member ID', icon: FileText },
  { id: 'rating', label: 'Star Rating', icon: Star },
];

const FormBuilderTab = ({ event, onSave, saving }) => {
  const [fields, setFields] = useState([]);
  const [previewMode, setPreviewMode] = useState(false);
  const [editingField, setEditingField] = useState(null);

  useEffect(() => {
    if (event?.customFields) {
      setFields(
        event.customFields
          .sort((a, b) => a.order - b.order)
          .map((field, index) => ({
            ...field,
            id: field.fieldId || `field-${index}`,
          }))
      );
    }
  }, [event]);

  const addField = (type) => {
    const newField = {
      id: `field-${Date.now()}`,
      fieldId: `field-${Date.now()}`,
      type,
      label: `${FIELD_TYPES.find((t) => t.id === type)?.label || 'Field'}`,
      placeholder: '',
      helperText: '',
      required: false,
      options: type === 'radio' || type === 'checkbox' || type === 'dropdown' ? ['Option 1', 'Option 2'] : [],
      order: fields.length,
      conditionalLogic: {
        enabled: false,
        dependsOnFieldId: '',
        dependsOnValue: '',
      },
      fileConfig: type === 'file' ? { maxSizeMB: 5, allowedTypes: ['pdf', 'jpg', 'png'] } : undefined,
      validateIEEE: type === 'ieeeId',
    };
    setFields([...fields, newField]);
    setEditingField(newField.id);
  };

  const updateField = (fieldId, updates) => {
    setFields(fields.map((f) => (f.id === fieldId ? { ...f, ...updates } : f)));
  };

  const deleteField = (fieldId) => {
    setFields(fields.filter((f) => f.id !== fieldId));
    if (editingField === fieldId) {
      setEditingField(null);
    }
  };

  const duplicateField = (fieldId) => {
    const field = fields.find((f) => f.id === fieldId);
    if (field) {
      const newField = {
        ...field,
        id: `field-${Date.now()}`,
        fieldId: `field-${Date.now()}`,
        label: `${field.label} (Copy)`,
        order: fields.length,
      };
      setFields([...fields, newField]);
    }
  };

  const handleDragEnd = (result) => {
    if (!result.destination) return;

    const reorderedFields = Array.from(fields);
    const [removed] = reorderedFields.splice(result.source.index, 1);
    reorderedFields.splice(result.destination.index, 0, removed);

    // Update order property
    const updatedFields = reorderedFields.map((field, index) => ({
      ...field,
      order: index,
    }));

    setFields(updatedFields);
  };

  const handleSave = () => {
    const customFields = fields.map((field) => ({
      fieldId: field.fieldId,
      type: field.type,
      label: field.label,
      placeholder: field.placeholder,
      helperText: field.helperText,
      required: field.required,
      options: field.options,
      order: field.order,
      conditionalLogic: field.conditionalLogic,
      fileConfig: field.fileConfig,
      validateIEEE: field.validateIEEE,
    }));
    onSave({ customFields });
  };

  const getRegistrationLink = () => {
    return `${window.location.origin}/events/${event?._id}`;
  };

  const copyLink = () => {
    navigator.clipboard.writeText(getRegistrationLink());
  };

  return (
    <div className="space-y-6">
      {/* Header Actions */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Form Builder</h2>
          <p className="text-slate-600 dark:text-slate-400 mt-1">
            Create a custom registration form for your event
          </p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => setPreviewMode(!previewMode)}
            className="px-4 py-2 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-xl hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors flex items-center gap-2"
          >
            <Eye className="w-4 h-4" />
            {previewMode ? 'Edit Mode' : 'Preview'}
          </button>
          <button
            onClick={copyLink}
            className="px-4 py-2 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-xl hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors"
          >
            Copy Link
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="px-6 py-2 bg-ieee-blue text-white rounded-xl hover:bg-ieee-blue-dark transition-colors flex items-center gap-2 disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            {saving ? 'Saving...' : 'Save Form'}
          </button>
        </div>
      </div>

      {previewMode ? (
        <PreviewForm fields={fields} />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Field Types Palette */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200 dark:border-slate-700 sticky top-6">
              <h3 className="font-semibold text-slate-900 dark:text-white mb-4">Add Fields</h3>
              <div className="space-y-2">
                {FIELD_TYPES.map((type) => {
                  const Icon = type.icon;
                  return (
                    <button
                      key={type.id}
                      onClick={() => addField(type.id)}
                      className="w-full flex items-center gap-3 px-4 py-3 bg-slate-50 dark:bg-slate-700/50 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-xl transition-colors text-left"
                    >
                      <Icon className="w-5 h-5" />
                      <span className="font-medium">{type.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Form Builder Canvas */}
          <div className="lg:col-span-2 space-y-6">
            {fields.length === 0 ? (
              <div className="bg-white dark:bg-slate-800 rounded-2xl p-12 border border-slate-200 dark:border-slate-700 text-center">
                <Plus className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
                  No fields yet
                </h3>
                <p className="text-slate-600 dark:text-slate-400">
                  Add fields from the left panel to build your registration form
                </p>
              </div>
            ) : (
              <DragDropContext onDragEnd={handleDragEnd}>
                <Droppable droppableId="form-fields">
                  {(provided) => (
                    <div {...provided.droppableProps} ref={provided.innerRef} className="space-y-4">
                      {fields.map((field, index) => (
                        <Draggable key={field.id} draggableId={field.id} index={index}>
                          {(provided) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 overflow-hidden"
                            >
                              <FieldEditor
                                field={field}
                                isExpanded={editingField === field.id}
                                onToggle={() =>
                                  setEditingField(editingField === field.id ? null : field.id)
                                }
                                onUpdate={updateField}
                                onDelete={deleteField}
                                onDuplicate={duplicateField}
                                dragHandleProps={provided.dragHandleProps}
                                allFields={fields}
                              />
                            </div>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </DragDropContext>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

const FieldEditor = ({
  field,
  isExpanded,
  onToggle,
  onUpdate,
  onDelete,
  onDuplicate,
  dragHandleProps,
  allFields,
}) => {
  const Icon = FIELD_TYPES.find((t) => t.id === field.type)?.icon || Type;

  return (
    <div>
      {/* Field Header */}
      <div className="flex items-center gap-3 p-4 bg-slate-50 dark:bg-slate-700/50">
        <div {...dragHandleProps} className="cursor-grab active:cursor-grabbing">
          <GripVertical className="w-5 h-5 text-slate-400" />
        </div>
        <Icon className="w-5 h-5 text-slate-600 dark:text-slate-400" />
        <div className="flex-1 cursor-pointer" onClick={onToggle}>
          <div className="font-medium text-slate-900 dark:text-white">{field.label}</div>
          <div className="text-sm text-slate-500 dark:text-slate-400">
            {FIELD_TYPES.find((t) => t.id === field.type)?.label}
            {field.required && ' • Required'}
          </div>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => onDuplicate(field.id)}
            className="p-2 hover:bg-slate-200 dark:hover:bg-slate-600 rounded-lg transition-colors"
          >
            <Copy className="w-4 h-4 text-slate-600 dark:text-slate-400" />
          </button>
          <button
            onClick={() => onDelete(field.id)}
            className="p-2 hover:bg-red-100 dark:hover:bg-red-900/20 rounded-lg transition-colors"
          >
            <Trash2 className="w-4 h-4 text-red-600" />
          </button>
        </div>
      </div>

      {/* Field Settings */}
      {isExpanded && (
        <div className="p-6 space-y-4 border-t border-slate-200 dark:border-slate-700">
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              Label
            </label>
            <input
              type="text"
              value={field.label}
              onChange={(e) => onUpdate(field.id, { label: e.target.value })}
              className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-ieee-blue dark:bg-slate-700 dark:text-white"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              Placeholder
            </label>
            <input
              type="text"
              value={field.placeholder}
              onChange={(e) => onUpdate(field.id, { placeholder: e.target.value })}
              className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-ieee-blue dark:bg-slate-700 dark:text-white"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              Helper Text
            </label>
            <input
              type="text"
              value={field.helperText}
              onChange={(e) => onUpdate(field.id, { helperText: e.target.value })}
              className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-ieee-blue dark:bg-slate-700 dark:text-white"
            />
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id={`required-${field.id}`}
              checked={field.required}
              onChange={(e) => onUpdate(field.id, { required: e.target.checked })}
              className="w-4 h-4 text-ieee-blue border-slate-300 rounded focus:ring-ieee-blue"
            />
            <label
              htmlFor={`required-${field.id}`}
              className="text-sm font-medium text-slate-700 dark:text-slate-300"
            >
              Required field
            </label>
          </div>

          {/* Options for select-type fields */}
          {(field.type === 'radio' || field.type === 'checkbox' || field.type === 'dropdown') && (
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Options
              </label>
              <div className="space-y-2">
                {field.options?.map((option, index) => (
                  <div key={index} className="flex gap-2">
                    <input
                      type="text"
                      value={option}
                      onChange={(e) => {
                        const newOptions = [...field.options];
                        newOptions[index] = e.target.value;
                        onUpdate(field.id, { options: newOptions });
                      }}
                      className="flex-1 px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-ieee-blue dark:bg-slate-700 dark:text-white"
                    />
                    <button
                      onClick={() => {
                        const newOptions = field.options.filter((_, i) => i !== index);
                        onUpdate(field.id, { options: newOptions });
                      }}
                      className="px-3 py-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
                <button
                  onClick={() => {
                    const newOptions = [...field.options, `Option ${field.options.length + 1}`];
                    onUpdate(field.id, { options: newOptions });
                  }}
                  className="px-4 py-2 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-xl hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors text-sm"
                >
                  + Add Option
                </button>
              </div>
            </div>
          )}

          {/* Conditional Logic */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <input
                type="checkbox"
                id={`conditional-${field.id}`}
                checked={field.conditionalLogic?.enabled}
                onChange={(e) =>
                  onUpdate(field.id, {
                    conditionalLogic: {
                      ...field.conditionalLogic,
                      enabled: e.target.checked,
                    },
                  })
                }
                className="w-4 h-4 text-ieee-blue border-slate-300 rounded focus:ring-ieee-blue"
              />
              <label
                htmlFor={`conditional-${field.id}`}
                className="text-sm font-medium text-slate-700 dark:text-slate-300"
              >
                Enable conditional logic
              </label>
            </div>

            {field.conditionalLogic?.enabled && (
              <div className="space-y-3 pl-6 border-l-2 border-slate-200 dark:border-slate-700">
                <div>
                  <label className="block text-xs text-slate-600 dark:text-slate-400 mb-1">
                    Show this field if:
                  </label>
                  <select
                    value={field.conditionalLogic?.dependsOnFieldId || ''}
                    onChange={(e) =>
                      onUpdate(field.id, {
                        conditionalLogic: {
                          ...field.conditionalLogic,
                          dependsOnFieldId: e.target.value,
                        },
                      })
                    }
                    className="w-full px-3 py-2 text-sm border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-ieee-blue dark:bg-slate-700 dark:text-white"
                  >
                    <option value="">Select field...</option>
                    {allFields
                      .filter((f) => f.id !== field.id)
                      .map((f) => (
                        <option key={f.id} value={f.fieldId}>
                          {f.label}
                        </option>
                      ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs text-slate-600 dark:text-slate-400 mb-1">
                    Equals:
                  </label>
                  <input
                    type="text"
                    value={field.conditionalLogic?.dependsOnValue || ''}
                    onChange={(e) =>
                      onUpdate(field.id, {
                        conditionalLogic: {
                          ...field.conditionalLogic,
                          dependsOnValue: e.target.value,
                        },
                      })
                    }
                    className="w-full px-3 py-2 text-sm border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-ieee-blue dark:bg-slate-700 dark:text-white"
                    placeholder="Enter value..."
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

const PreviewForm = ({ fields }) => {
  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl p-8 border border-slate-200 dark:border-slate-700 max-w-3xl mx-auto">
      <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">
        Registration Form Preview
      </h3>
      <form className="space-y-6">
        {fields.map((field) => (
          <div key={field.id}>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              {field.label}
              {field.required && <span className="text-red-500 ml-1">*</span>}
            </label>
            {field.helperText && (
              <p className="text-sm text-slate-500 dark:text-slate-400 mb-2">{field.helperText}</p>
            )}
            <PreviewField field={field} />
          </div>
        ))}
        <button
          type="button"
          className="w-full px-6 py-3 bg-ieee-blue text-white rounded-xl font-medium hover:bg-ieee-blue-dark transition-colors"
        >
          Submit Registration
        </button>
      </form>
    </div>
  );
};

const PreviewField = ({ field }) => {
  const baseClasses =
    'w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-ieee-blue dark:bg-slate-700 dark:text-white';

  switch (field.type) {
    case 'text':
    case 'email':
    case 'phone':
    case 'number':
    case 'ieeeId':
      return <input type={field.type} placeholder={field.placeholder} className={baseClasses} />;
    case 'paragraph':
      return <textarea rows={4} placeholder={field.placeholder} className={baseClasses} />;
    case 'date':
      return <input type="date" className={baseClasses} />;
    case 'dropdown':
      return (
        <select className={baseClasses}>
          <option value="">Select...</option>
          {field.options?.map((option, i) => (
            <option key={i} value={option}>
              {option}
            </option>
          ))}
        </select>
      );
    case 'radio':
      return (
        <div className="space-y-2">
          {field.options?.map((option, i) => (
            <label key={i} className="flex items-center gap-2">
              <input type="radio" name={field.id} className="text-ieee-blue" />
              <span className="text-slate-700 dark:text-slate-300">{option}</span>
            </label>
          ))}
        </div>
      );
    case 'checkbox':
      return (
        <div className="space-y-2">
          {field.options?.map((option, i) => (
            <label key={i} className="flex items-center gap-2">
              <input type="checkbox" className="text-ieee-blue rounded" />
              <span className="text-slate-700 dark:text-slate-300">{option}</span>
            </label>
          ))}
        </div>
      );
    case 'file':
      return (
        <input
          type="file"
          className="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-xl file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-ieee-blue file:text-white hover:file:bg-ieee-blue-dark"
        />
      );
    case 'rating':
      return (
        <div className="flex gap-2">
          {[1, 2, 3, 4, 5].map((star) => (
            <Star key={star} className="w-8 h-8 text-slate-300 hover:text-yellow-500 cursor-pointer" />
          ))}
        </div>
      );
    default:
      return <input type="text" placeholder={field.placeholder} className={baseClasses} />;
  }
};

export default FormBuilderTab;
