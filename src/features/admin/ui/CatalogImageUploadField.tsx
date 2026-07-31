"use client";

import {
  useEffect,
  useId,
  useRef,
  useState,
  type ChangeEvent,
  type DragEvent,
} from "react";
import { ImagePlus, Upload, X } from "lucide-react";
import {
  CATALOG_IMAGE_ACCEPT,
  validateCatalogImage,
} from "@/features/catalog/public";
import { Button } from "@/shared/ui/button";
import { useAdminFormFeedback } from "./AdminActionForm";

type CatalogImageUploadFieldProps = {
  existingImageUrl?: string | null;
  name?: string;
  label?: string;
  hint?: string;
  onPreviewChange?: (url: string | null) => void;
};

export function CatalogImageUploadField({
  existingImageUrl = null,
  name = "image",
  label = "Imagen",
  hint = "PNG, JPG, WebP o AVIF de hasta 5 MB.",
  onPreviewChange,
}: CatalogImageUploadFieldProps) {
  const { getFieldErrors } = useAdminFormFeedback();
  const serverErrors = getFieldErrors(name);
  const inputRef = useRef<HTMLInputElement>(null);
  const objectUrlRef = useRef<string | null>(null);
  const selectedFileRef = useRef<File | null>(null);
  const [fileName, setFileName] = useState("");
  const [isDragging, setIsDragging] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);
  const uniqueId = useId();
  const inputId = `${name}-${uniqueId}-upload`;
  const hintId = `${inputId}-hint`;
  const errors = localError ? [localError, ...serverErrors] : serverErrors;
  const errorId = errors.length > 0 ? `${inputId}-error` : undefined;
  const describedBy = [hintId, errorId].filter(Boolean).join(" ");

  useEffect(
    () => () => {
      if (objectUrlRef.current) URL.revokeObjectURL(objectUrlRef.current);
    },
    [],
  );

  function restoreSelectedFile() {
    if (!inputRef.current) return;

    inputRef.current.value = "";
    if (!selectedFileRef.current) return;

    const transfer = new DataTransfer();
    transfer.items.add(selectedFileRef.current);
    inputRef.current.files = transfer.files;
  }

  function selectFile(file: File) {
    const validationError = validateCatalogImage(file);

    if (validationError) {
      setLocalError(validationError);
      restoreSelectedFile();
      return false;
    }

    if (objectUrlRef.current) URL.revokeObjectURL(objectUrlRef.current);

    const nextUrl = URL.createObjectURL(file);
    objectUrlRef.current = nextUrl;
    selectedFileRef.current = file;
    setFileName(file.name);
    setLocalError(null);
    onPreviewChange?.(nextUrl);
    return true;
  }

  function handleChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];

    if (!file) return;
    selectFile(file);
  }

  function handleDrop(event: DragEvent<HTMLDivElement>) {
    event.preventDefault();
    setIsDragging(false);

    const file = event.dataTransfer.files[0];
    if (!file || !inputRef.current || !selectFile(file)) return;

    const transfer = new DataTransfer();
    transfer.items.add(file);
    inputRef.current.files = transfer.files;
  }

  function clearSelection() {
    if (inputRef.current) inputRef.current.value = "";
    if (objectUrlRef.current) URL.revokeObjectURL(objectUrlRef.current);

    objectUrlRef.current = null;
    selectedFileRef.current = null;
    setFileName("");
    setLocalError(null);
    onPreviewChange?.(existingImageUrl);
  }

  return (
    <div
      className="field admin-image-upload"
      data-invalid={errors.length > 0 || undefined}
    >
      <label className="admin-image-upload__label" htmlFor={inputId}>
        <span>{label}</span>
        <span className="admin-field__requirement">Opcional</span>
      </label>
      <div className="admin-field__hint" id={hintId}>
        {hint}
      </div>
      <div
        className="admin-image-upload__dropzone"
        data-dragging={isDragging || undefined}
        onDragEnter={() => setIsDragging(true)}
        onDragLeave={() => setIsDragging(false)}
        onDragOver={(event) => event.preventDefault()}
        onDrop={handleDrop}
      >
        <input
          accept={CATALOG_IMAGE_ACCEPT}
          aria-describedby={describedBy}
          aria-invalid={errors.length > 0}
          className="sr-only"
          id={inputId}
          name={name}
          onChange={handleChange}
          ref={inputRef}
          type="file"
        />
        <label className="admin-image-upload__action" htmlFor={inputId}>
          <span className="admin-image-upload__icon">
            {fileName ? <ImagePlus size={22} /> : <Upload size={22} />}
          </span>
          <span>
            <strong>{fileName || "Elegí una imagen"}</strong>
            <small>
              {fileName
                ? "Hacé clic para reemplazarla"
                : "Hacé clic o arrastrala hasta acá"}
            </small>
          </span>
        </label>
        {fileName ? (
          <Button
            aria-label="Quitar imagen seleccionada"
            className="admin-image-upload__clear"
            onClick={clearSelection}
            size="icon"
            type="button"
            variant="outline"
          >
            <X size={18} />
          </Button>
        ) : null}
      </div>
      {errors.length > 0 ? (
        <div className="admin-field__error" id={errorId}>
          {errors.map((error) => (
            <span key={error}>{error}</span>
          ))}
        </div>
      ) : null}
    </div>
  );
}
