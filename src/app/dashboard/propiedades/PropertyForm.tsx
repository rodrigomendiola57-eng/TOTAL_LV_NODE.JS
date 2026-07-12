"use client";

import {
  FormField,
  FormSection,
  formInputClass,
} from "@/components/dashboard/form/FormField";
import { AmenitiesSelector } from "@/components/dashboard/form/AmenitiesSelector";
import { FeaturedToggle } from "@/components/dashboard/form/FeaturedToggle";
import { FormStepIndicator } from "@/components/dashboard/form/FormStepIndicator";
import { NumberStepper } from "@/components/dashboard/form/NumberStepper";
import { OperationTypeSelector } from "@/components/dashboard/form/OperationTypeSelector";
import { PropertyTypeSelector } from "@/components/dashboard/form/PropertyTypeSelector";
import { ZoneSelector } from "@/components/dashboard/form/ZoneSelector";
import { PropertyPhotoManager } from "@/components/dashboard/PropertyPhotoManager";
import { PropertyTechnicalSheetUpload } from "@/components/dashboard/PropertyTechnicalSheetUpload";
import { createProperty, getAmenities, updateProperty } from "@/lib/api";
import { getPropertyPhotos, syncPropertyPhotos } from "@/lib/api/property-photos";
import { syncTechnicalSheet } from "@/lib/api/property-technical-sheet";
import { getCitiesByState, MEXICO_STATES } from "@/lib/data/mexico-locations";
import { DEFAULT_MAP_CENTER } from "@/lib/data/property-options";
import {
  formValuesToPayload,
  propertyToFormValues,
} from "@/lib/property-payload";
import {
  FORM_STEPS,
  formatPricePreview,
  getPropertyTypeGroup,
  shouldShowLandFields,
  shouldShowResidentialFields,
  type FormStepId,
} from "@/lib/data/property-form-ux";
import { cn } from "@/lib/utils";
import type { Amenity, Property, PropertyFormValues } from "@/types/property";
import {
  createPhotoDraftFromApi,
  revokePhotoDraftUrls,
  type PhotoDraft,
} from "@/types/property-photo";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  Building2,
  CheckCircle2,
  FileText,
  Image as ImageIcon,
  LayoutGrid,
  Loader2,
  MapPinned,
  Sparkles,
  X,
} from "lucide-react";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import { useForm, type FieldErrors } from "react-hook-form";

const DynamicLocationPicker = dynamic(
  () =>
    import("@/components/dashboard/LocationPicker").then(
      (module) => module.LocationPicker,
    ),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-80 animate-pulse items-center justify-center rounded-2xl border border-tl-gold/15 bg-[#0a0a0a] font-outfit font-light text-sm text-tl-beige/40">
        Cargando mapa interactivo...
      </div>
    ),
  },
);

const DEFAULT_VALUES: PropertyFormValues = {
  title: "",
  property_type: "Casa",
  operation_type: "Venta",
  price: "",
  description: "",
  address: "",
  state: "Querétaro",
  city: "Querétaro",
  postal_code: "",
  zone: "Zona Juriquilla / Jurica",
  maps_link: "",
  latitude: String(DEFAULT_MAP_CENTER.latitude),
  longitude: String(DEFAULT_MAP_CENTER.longitude),
  bedrooms: "3",
  full_bathrooms: "2",
  half_bathrooms: "1",
  parking_spaces: "2",
  build_area_m2: "180",
  land_area_m2: "0",
  levels: "2",
  front_measure_m: "",
  depth_measure_m: "",
  build_year: "",
  environments: "5",
  maintenance_fee: "",
  amenities: [],
  is_featured: false,
};

const STEP_FIELDS: Record<FormStepId, (keyof PropertyFormValues)[]> = {
  basic: ["title", "price", "property_type", "operation_type"],
  amenities: [],
  location: ["address", "state", "city", "postal_code", "zone", "latitude", "longitude"],
  features: [],
  media: [],
};

const FIELD_TO_STEP = Object.entries(STEP_FIELDS).reduce(
  (acc, [step, fields]) => {
    for (const field of fields) {
      acc[field] = step as FormStepId;
    }
    return acc;
  },
  {} as Partial<Record<keyof PropertyFormValues, FormStepId>>,
);

interface PropertyFormProps {
  property?: Property;
  onClose?: () => void;
  onSuccess?: () => void;
}

const PUBLISH_LOCK_MS = 500;

export function PropertyForm({ property, onClose, onSuccess }: PropertyFormProps) {
  const router = useRouter();
  const publishLockedUntilRef = useRef(0);
  const isEditing = Boolean(property);
  const initialValues = property ? propertyToFormValues(property) : DEFAULT_VALUES;
  const [currentStep, setCurrentStep] = useState<FormStepId>("basic");
  const [completedSteps, setCompletedSteps] = useState<FormStepId[]>([]);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [photos, setPhotos] = useState<PhotoDraft[]>([]);
  const [deletedPhotoIds, setDeletedPhotoIds] = useState<number[]>([]);
  const [photosError, setPhotosError] = useState<string | null>(null);
  const [isLoadingPhotos, setIsLoadingPhotos] = useState(false);
  const [technicalSheetFile, setTechnicalSheetFile] = useState<File | null>(null);
  const [technicalSheetRemoved, setTechnicalSheetRemoved] = useState(false);
  const [technicalSheetError, setTechnicalSheetError] = useState<string | null>(null);
  const [amenities, setAmenities] = useState<Amenity[]>([]);
  const [isLoadingAmenities, setIsLoadingAmenities] = useState(true);
  const [amenitiesError, setAmenitiesError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    trigger,
    formState: { errors, isSubmitting },
  } = useForm<PropertyFormValues>({
    defaultValues: initialValues,
    mode: "onBlur",
  });

  const selectedState = watch("state");
  const propertyType = watch("property_type");
  const operationType = watch("operation_type");
  const zone = watch("zone");
  const price = watch("price");
  const isFeatured = watch("is_featured");
  const selectedAmenities = watch("amenities");
  const description = watch("description");
  const latitude = Number(watch("latitude"));
  const longitude = Number(watch("longitude"));

  const cities = useMemo(() => getCitiesByState(selectedState), [selectedState]);
  const typeGroup = getPropertyTypeGroup(propertyType);
  const showResidential = shouldShowResidentialFields(propertyType);
  const showLand = shouldShowLandFields(propertyType);
  const currentStepIndex = FORM_STEPS.findIndex((step) => step.id === currentStep);
  const isLastStep = currentStepIndex === FORM_STEPS.length - 1;

  function lockPublish(ms = PUBLISH_LOCK_MS) {
    publishLockedUntilRef.current = Date.now() + ms;
  }

  function isPublishLocked() {
    return Date.now() < publishLockedUntilRef.current;
  }

  function advanceToStep(step: FormStepId) {
    setCurrentStep(step);
    if (step === "media") {
      lockPublish();
    }
  }

  useEffect(() => {
    let cancelled = false;
    setIsLoadingAmenities(true);
    setAmenitiesError(null);

    getAmenities()
      .then((items) => {
        if (!cancelled) setAmenities(items);
      })
      .catch((error) => {
        if (cancelled) return;
        setAmenitiesError(
          error instanceof Error
            ? error.message
            : "No se pudieron cargar las amenidades.",
        );
      })
      .finally(() => {
        if (!cancelled) setIsLoadingAmenities(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!selectedState) {
      setValue("city", "");
      return;
    }
    const availableCities = getCitiesByState(selectedState);
    if (availableCities.length > 0) {
      setValue("city", availableCities[0]);
    }
  }, [selectedState, setValue]);

  useEffect(() => {
    if (!property?.id) {
      setPhotos([]);
      setDeletedPhotoIds([]);
      return;
    }

    let cancelled = false;
    setIsLoadingPhotos(true);
    setPhotosError(null);

    getPropertyPhotos(property.id)
      .then((items) => {
        if (cancelled) return;
        setPhotos(items.map(createPhotoDraftFromApi));
      })
      .catch((error) => {
        if (cancelled) return;
        setPhotosError(
          error instanceof Error ? error.message : "No se pudieron cargar las fotos.",
        );
      })
      .finally(() => {
        if (!cancelled) setIsLoadingPhotos(false);
      });

    return () => {
      cancelled = true;
    };
  }, [property?.id]);

  const photosRef = useRef(photos);
  photosRef.current = photos;

  useEffect(() => {
    return () => {
      revokePhotoDraftUrls(photosRef.current);
    };
  }, []);

  async function goToStep(step: FormStepId) {
    const targetIndex = FORM_STEPS.findIndex((item) => item.id === step);
    if (targetIndex <= currentStepIndex) {
      advanceToStep(step);
      return;
    }
    const valid = await trigger(STEP_FIELDS[currentStep]);
    if (valid) {
      setCompletedSteps((prev) =>
        prev.includes(currentStep) ? prev : [...prev, currentStep],
      );
      advanceToStep(step);
    }
  }

  async function handleNext() {
    const valid = await trigger(STEP_FIELDS[currentStep]);
    if (!valid) return;

    setCompletedSteps((prev) =>
      prev.includes(currentStep) ? prev : [...prev, currentStep],
    );

    if (!isLastStep) {
      advanceToStep(FORM_STEPS[currentStepIndex + 1].id);
    }
  }

  function handleBack() {
    if (currentStepIndex > 0) {
      setCurrentStep(FORM_STEPS[currentStepIndex - 1].id);
    }
  }

  async function onSubmit(values: PropertyFormValues) {
    setSubmitError(null);
    setSubmitSuccess(false);
    setPhotosError(null);
    setTechnicalSheetError(null);

    try {
      const payload = formValuesToPayload(values);
      let propertyId: number;

      if (isEditing && property) {
        await updateProperty(property.id, payload);
        propertyId = property.id;
      } else {
        propertyId = await createProperty(payload);
      }

      if (photos.length > 0 || deletedPhotoIds.length > 0) {
        await syncPropertyPhotos(propertyId, photos, deletedPhotoIds);
      }

      if (technicalSheetFile || technicalSheetRemoved) {
        await syncTechnicalSheet(
          propertyId,
          technicalSheetFile,
          technicalSheetRemoved && !technicalSheetFile,
        );
      }

      setSubmitSuccess(true);
      router.refresh();

      window.setTimeout(() => {
        revokePhotoDraftUrls(photos);
        reset(DEFAULT_VALUES);
        setPhotos([]);
        setDeletedPhotoIds([]);
        setTechnicalSheetFile(null);
        setTechnicalSheetRemoved(false);
        setCurrentStep("basic");
        setCompletedSteps([]);
        setSubmitSuccess(false);
        onSuccess?.();
      }, 1600);
    } catch (error) {
      setSubmitError(
        error instanceof Error ? error.message : "No se pudo guardar la propiedad.",
      );
    }
  }

  function onInvalid(formErrors: FieldErrors<PropertyFormValues>) {
    const firstField = Object.keys(formErrors)[0] as keyof PropertyFormValues | undefined;
    if (firstField && FIELD_TO_STEP[firstField]) {
      setCurrentStep(FIELD_TO_STEP[firstField] as FormStepId);
    }
    setSubmitError("Revisa los campos obligatorios antes de guardar.");
  }

  async function handlePublishClick() {
    if (currentStep !== "media") return;
    if (isPublishLocked()) {
      setSubmitError("Espera un momento e intenta guardar de nuevo.");
      return;
    }
    await handleSubmit(onSubmit, onInvalid)();
  }

  const mapLatitude = Number.isFinite(latitude) ? latitude : DEFAULT_MAP_CENTER.latitude;
  const mapLongitude = Number.isFinite(longitude) ? longitude : DEFAULT_MAP_CENTER.longitude;

  return (
    <form
      onSubmit={(event) => event.preventDefault()}
      onKeyDown={(event) => {
        if (event.key !== "Enter" || event.target instanceof HTMLTextAreaElement) {
          return;
        }

        // Nunca enviar con Enter: en pasos 1–3 avanza; en fotos no hace nada.
        event.preventDefault();
        if (currentStep !== "media") {
          void handleNext();
        }
      }}
      className="flex min-h-0 flex-1 flex-col overflow-hidden bg-gradient-to-b from-tl-black via-tl-black to-[#0a0a0a]"
    >
      {/* Header sticky */}
      <div className="sticky top-0 z-10 shrink-0 border-b border-tl-gold/15 bg-tl-black/95 px-4 py-4 backdrop-blur-md sm:px-6 sm:py-5">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="font-outfit font-light text-[10px] uppercase tracking-[0.24em] text-tl-gold">
              Total Living · Catálogo
            </p>
            <h2 className="mt-1 font-outfit text-3xl font-extralight text-tl-beige sm:text-4xl">
              {isEditing ? "Editar Propiedad" : "Nueva Propiedad"}
            </h2>
            {property?.easybroker_id ? (
              <p className="mt-2 font-mono text-xs tracking-[0.06em] text-tl-gold">
                ID EasyBroker: {property.easybroker_id}
              </p>
            ) : null}
          </div>
          {onClose ? (
            <button
              type="button"
              onClick={onClose}
              className="rounded-full border border-tl-gold/25 p-2.5 text-tl-beige/60 transition-colors hover:border-tl-gold hover:text-tl-gold"
              aria-label="Cerrar"
            >
              <X className="h-4 w-4" />
            </button>
          ) : null}
        </div>
        <div className="mt-6">
          <FormStepIndicator
            steps={FORM_STEPS}
            currentStep={currentStep}
            completedSteps={completedSteps}
            onStepClick={goToStep}
          />
        </div>
      </div>

      {/* Body scrollable */}
      <div className="flex-1 overflow-x-hidden overflow-y-auto px-4 py-5 sm:px-6 sm:py-6">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 16 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -16 }}
            transition={{ duration: 0.22, ease: "easeOut" }}
          >
            {currentStep === "basic" ? (
              <FormSection
                title="Información comercial"
                description="Define el tipo de inmueble, la operación y el valor de mercado."
                icon={<Building2 className="h-5 w-5" strokeWidth={1.5} />}
              >
                <FormField
                  label="Título de la propiedad *"
                  hint="Usa un nombre atractivo y específico para el catálogo."
                  className="sm:col-span-2 xl:col-span-3"
                  error={errors.title?.message}
                >
                  <input
                    {...register("title", { required: "El título es obligatorio" })}
                    placeholder="Ej. Residencia de autor en Juriquilla con vista panorámica"
                    className={formInputClass}
                  />
                </FormField>

                <PropertyTypeSelector
                  value={propertyType}
                  onChange={(value) => setValue("property_type", value)}
                />

                <OperationTypeSelector
                  value={operationType}
                  onChange={(value) => setValue("operation_type", value)}
                />

                <FormField
                  label="Precio (MXN) *"
                  hint="Valor de venta o renta mensual según el tipo de operación."
                  error={errors.price?.message}
                >
                  <div className="relative">
                    <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 font-outfit font-light text-sm text-tl-gold/70">
                      $
                    </span>
                    <input
                      type="number"
                      min="0"
                      step="1000"
                      {...register("price", {
                        required: "El precio es obligatorio",
                        min: { value: 1, message: "Ingresa un precio válido" },
                      })}
                      placeholder="8500000"
                      className={cn(formInputClass, "pl-8")}
                    />
                  </div>
                  <p className="mt-2 font-outfit font-light text-xs text-tl-gold/80">
                    Vista previa:{" "}
                    <span className="font-medium text-tl-gold">
                      {formatPricePreview(price)}
                    </span>
                  </p>
                </FormField>

                <div className="rounded-xl border border-tl-gold/15 bg-[#0a0a0a]/60 px-4 py-3 sm:col-span-2">
                  <p className="font-outfit font-light text-[10px] uppercase tracking-[0.14em] text-tl-beige/45">
                    Resumen rápido
                  </p>
                  <p className="mt-1 font-outfit font-light text-sm text-tl-beige/80">
                    {propertyType} en {operationType.toLowerCase()}
                    {price ? ` · ${formatPricePreview(price)}` : ""}
                  </p>
                </div>

                <FormField
                  label="Descripción"
                  hint={`${description.length}/600 caracteres — destaca amenidades y plusvalía.`}
                  className="sm:col-span-2 xl:col-span-3"
                >
                  <textarea
                    rows={5}
                    maxLength={600}
                    {...register("description")}
                    placeholder="Describe acabados, amenidades del desarrollo, seguridad, cercanía a zonas clave..."
                    className={cn(formInputClass, "resize-y leading-relaxed")}
                  />
                </FormField>
              </FormSection>
            ) : null}

            {currentStep === "amenities" ? (
              <FormSection
                title="Amenidades y características"
                description="Selecciona las amenidades del desarrollo y de la propiedad. Se mostrarán en la ficha pública."
                icon={<Sparkles className="h-5 w-5" strokeWidth={1.5} />}
              >
                <div className="sm:col-span-2 xl:col-span-3">
                  <AmenitiesSelector
                    amenities={amenities}
                    selected={selectedAmenities}
                    onChange={(ids) =>
                      setValue("amenities", ids, { shouldDirty: true })
                    }
                    isLoading={isLoadingAmenities}
                    error={amenitiesError}
                  />
                </div>
              </FormSection>
            ) : null}

            {currentStep === "location" ? (
              <FormSection
                title="Ubicación y zona"
                description="La dirección y el mapa determinan cómo se mostrará en búsquedas geográficas."
                icon={<MapPinned className="h-5 w-5" strokeWidth={1.5} />}
              >
                <FormField
                  label="Dirección completa *"
                  className="sm:col-span-2 xl:col-span-3"
                  error={errors.address?.message}
                >
                  <input
                    {...register("address", { required: "La dirección es obligatoria" })}
                    placeholder="Calle, número exterior, colonia"
                    className={formInputClass}
                  />
                </FormField>

                <FormField label="Estado *">
                  <select {...register("state")} className={formInputClass}>
                    {MEXICO_STATES.map((state) => (
                      <option key={state} value={state}>
                        {state}
                      </option>
                    ))}
                  </select>
                </FormField>

                <FormField label="Ciudad *" error={errors.city?.message}>
                  <select
                    {...register("city", { required: "Selecciona una ciudad" })}
                    disabled={cities.length === 0}
                    className={formInputClass}
                  >
                    {cities.map((city) => (
                      <option key={city} value={city}>
                        {city}
                      </option>
                    ))}
                  </select>
                </FormField>

                <FormField label="Código postal *" error={errors.postal_code?.message}>
                  <input
                    {...register("postal_code", {
                      required: "El código postal es obligatorio",
                      pattern: { value: /^\d{5}$/, message: "Debe tener 5 dígitos" },
                    })}
                    placeholder="76000"
                    maxLength={5}
                    className={formInputClass}
                  />
                </FormField>

                <ZoneSelector value={zone} onChange={(value) => setValue("zone", value)} />

                <FormField
                  label="Enlace Google Maps"
                  hint="Opcional — útil para visitas y material comercial."
                  className="sm:col-span-2"
                >
                  <input
                    type="url"
                    {...register("maps_link")}
                    placeholder="https://maps.google.com/..."
                    className={formInputClass}
                  />
                </FormField>

                <div className="sm:col-span-2 xl:col-span-3">
                  <DynamicLocationPicker
                    latitude={mapLatitude}
                    longitude={mapLongitude}
                    onLocationChange={({ latitude: lat, longitude: lng }) => {
                      setValue("latitude", lat.toFixed(6));
                      setValue("longitude", lng.toFixed(6));
                    }}
                  />
                </div>

                <FormField label="Latitud *" error={errors.latitude?.message}>
                  <input
                    type="number"
                    step="any"
                    {...register("latitude", { required: "Requerida" })}
                    className={formInputClass}
                  />
                </FormField>

                <FormField label="Longitud *" error={errors.longitude?.message}>
                  <input
                    type="number"
                    step="any"
                    {...register("longitude", { required: "Requerida" })}
                    className={formInputClass}
                  />
                </FormField>
              </FormSection>
            ) : null}

            {currentStep === "features" ? (
              <FormSection
                title="Características físicas"
                description={
                  typeGroup === "terreno"
                    ? "Campos optimizados para terrenos y lotes."
                    : typeGroup === "comercial"
                      ? "Campos orientados a espacios comerciales e industriales."
                      : "Distribución habitacional y medidas del inmueble."
                }
                icon={<LayoutGrid className="h-5 w-5" strokeWidth={1.5} />}
              >
                {showResidential ? (
                  <>
                    <NumberStepper
                      label="Recámaras"
                      value={watch("bedrooms")}
                      onChange={(v) => setValue("bedrooms", v)}
                      className="sm:col-span-1"
                    />
                    <NumberStepper
                      label="Baños completos"
                      value={watch("full_bathrooms")}
                      onChange={(v) => setValue("full_bathrooms", v)}
                    />
                    <NumberStepper
                      label="Medios baños"
                      value={watch("half_bathrooms")}
                      onChange={(v) => setValue("half_bathrooms", v)}
                    />
                    <NumberStepper
                      label="Ambientes"
                      hint="Espacios principales"
                      value={watch("environments")}
                      onChange={(v) => setValue("environments", v)}
                    />
                  </>
                ) : null}

                <NumberStepper
                  label="Estacionamientos"
                  value={watch("parking_spaces")}
                  onChange={(v) => setValue("parking_spaces", v)}
                />

                <NumberStepper
                  label="Niveles"
                  value={watch("levels")}
                  onChange={(v) => setValue("levels", v)}
                  min={1}
                />

                <FormField label="Superficie construida (m²)">
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    {...register("build_area_m2")}
                    className={formInputClass}
                  />
                </FormField>

                {showLand || showResidential ? (
                  <FormField
                    label="Superficie terreno (m²)"
                    hint={showLand ? "Campo principal para terrenos" : undefined}
                  >
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      {...register("land_area_m2")}
                      className={formInputClass}
                    />
                  </FormField>
                ) : null}

                {showLand ? (
                  <>
                    <FormField label="Frente (m)">
                      <input
                        type="number"
                        min="0"
                        step="0.01"
                        {...register("front_measure_m")}
                        className={formInputClass}
                      />
                    </FormField>
                    <FormField label="Fondo (m)">
                      <input
                        type="number"
                        min="0"
                        step="0.01"
                        {...register("depth_measure_m")}
                        className={formInputClass}
                      />
                    </FormField>
                  </>
                ) : null}

                <FormField label="Año de construcción">
                  <input
                    type="number"
                    min="1900"
                    max={new Date().getFullYear() + 2}
                    {...register("build_year")}
                    placeholder="2020"
                    className={formInputClass}
                  />
                </FormField>

                <FormField label="Cuota de mantenimiento (MXN)">
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    {...register("maintenance_fee")}
                    placeholder="Opcional"
                    className={formInputClass}
                  />
                </FormField>

                <FeaturedToggle
                  checked={isFeatured}
                  onChange={(checked) =>
                    setValue("is_featured", checked, { shouldDirty: true })
                  }
                />
              </FormSection>
            ) : null}

            {currentStep === "media" ? (
              <FormSection
                title="Galería fotográfica"
                description="Sube, ordena y elige la imagen de portada que verán los clientes en el catálogo."
                icon={<ImageIcon className="h-5 w-5" strokeWidth={1.5} />}
              >
                {isLoadingPhotos ? (
                  <div className="flex h-40 items-center justify-center rounded-2xl border border-tl-gold/15 bg-[#0a0a0a] font-outfit font-light text-sm text-tl-beige/45 sm:col-span-2 xl:col-span-3">
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Cargando fotografías...
                  </div>
                ) : (
                  <div className="sm:col-span-2 xl:col-span-3">
                    <PropertyPhotoManager
                      photos={photos}
                      onChange={setPhotos}
                      onDeleteExisting={(photoId) =>
                        setDeletedPhotoIds((prev) =>
                          prev.includes(photoId) ? prev : [...prev, photoId],
                        )
                      }
                      error={photosError}
                    />
                  </div>
                )}
              </FormSection>
            ) : null}

            {currentStep === "media" ? (
              <FormSection
                title="Ficha técnica"
                description="Sube el PDF con especificaciones detalladas. Los visitantes podrán descargarlo desde la página de la propiedad."
                icon={<FileText className="h-5 w-5" strokeWidth={1.5} />}
              >
                <div className="sm:col-span-2 xl:col-span-3">
                  <PropertyTechnicalSheetUpload
                    existingUrl={property?.technical_sheet_url}
                    existingFilename={
                      property?.technical_sheet_url
                        ? `ficha-tecnica-${property.id}.pdf`
                        : null
                    }
                    pendingFile={technicalSheetFile}
                    markedForRemoval={technicalSheetRemoved}
                    onFileSelect={(file) => {
                      setTechnicalSheetFile(file);
                      if (file) setTechnicalSheetRemoved(false);
                    }}
                    onMarkForRemoval={() => setTechnicalSheetRemoved(true)}
                    onUndoRemoval={() => setTechnicalSheetRemoved(false)}
                    error={technicalSheetError}
                  />
                </div>
              </FormSection>
            ) : null}
          </motion.div>
        </AnimatePresence>

        {submitError ? (
          <p className="mt-6 rounded-xl border border-red-500/30 bg-red-950/25 px-4 py-3 font-outfit font-light text-sm text-red-300">
            {submitError}
          </p>
        ) : null}

        {submitSuccess ? (
          <p className="mt-6 flex items-center gap-2 rounded-xl border border-tl-gold/30 bg-tl-gold/10 px-4 py-3 font-outfit font-light text-sm text-tl-gold">
            <CheckCircle2 className="h-4 w-4" />
            {isEditing
              ? "Propiedad actualizada correctamente. Cerrando formulario..."
              : "Propiedad registrada correctamente. Cerrando formulario..."}
          </p>
        ) : null}
      </div>

      {/* Footer sticky */}
      <div className="sticky bottom-0 shrink-0 border-t border-tl-gold/15 bg-tl-black/95 px-4 py-3 backdrop-blur-md sm:px-6 sm:py-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <button
            type="button"
            onClick={handleBack}
            disabled={currentStepIndex === 0}
            className="inline-flex items-center gap-2 rounded-full border border-tl-gold/30 px-5 py-2.5 font-outfit font-light text-xs uppercase tracking-[0.14em] text-tl-beige/70 transition-colors hover:border-tl-gold hover:text-tl-gold disabled:invisible"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Atrás
          </button>

          <div className="flex flex-wrap gap-3">
            {onClose ? (
              <button
                type="button"
                onClick={onClose}
                className="rounded-full px-5 py-2.5 font-outfit font-light text-xs uppercase tracking-[0.14em] text-tl-beige/50 transition-colors hover:text-tl-beige"
              >
                Cancelar
              </button>
            ) : null}

            {!isLastStep ? (
              <button
                type="button"
                onClick={() => void handleNext()}
                className="inline-flex items-center gap-2 rounded-full bg-tl-gold px-6 py-2.5 font-outfit font-light text-xs uppercase tracking-[0.14em] text-tl-black transition-opacity hover:opacity-90"
              >
                Continuar
                <ArrowRight className="h-3.5 w-3.5" />
              </button>
            ) : (
              <button
                type="button"
                onClick={() => void handlePublishClick()}
                disabled={isSubmitting}
                className="inline-flex items-center gap-2 rounded-full bg-tl-gold px-6 py-2.5 font-outfit font-light text-xs uppercase tracking-[0.14em] text-tl-black transition-opacity hover:opacity-90 disabled:opacity-60"
              >
                {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
                {isEditing ? "Guardar cambios" : "Publicar propiedad"}
              </button>
            )}
          </div>
        </div>
      </div>
    </form>
  );
}
