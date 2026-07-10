"use client";

import { createLead } from "@/lib/api/crm";
import { useCallback, useEffect, useState, type FormEvent } from "react";

export interface ContactLeadFormOptions {
  interestedIn?: number | null;
  defaultMessage?: string;
  onSuccess?: () => void;
}

export function useContactLeadForm({
  interestedIn = null,
  defaultMessage = "",
  onSuccess,
}: ContactLeadFormOptions = {}) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState(defaultMessage);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [autofillEnabled, setAutofillEnabled] = useState(false);

  useEffect(() => {
    setMessage(defaultMessage);
  }, [defaultMessage]);

  useEffect(() => {
    const timer = window.setTimeout(() => setAutofillEnabled(true), 120);
    return () => window.clearTimeout(timer);
  }, []);

  const resetForm = useCallback(() => {
    setName("");
    setPhone("");
    setEmail("");
    setMessage(defaultMessage);
    setError(null);
    setSuccess(false);
  }, [defaultMessage]);

  const handleSubmit = useCallback(
    async (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      setLoading(true);
      setError(null);
      setSuccess(false);

      const trimmedName = name.trim();
      const trimmedPhone = phone.trim();
      const trimmedEmail = email.trim();
      const trimmedMessage = message.trim();

      if (trimmedName.length < 2) {
        setError("Escribe tu nombre para continuar.");
        setLoading(false);
        return;
      }

      if (!trimmedPhone && !trimmedEmail) {
        setError("Agrega tu teléfono o correo para que podamos responderte.");
        setLoading(false);
        return;
      }

      if (!trimmedMessage) {
        setError("Cuéntanos brevemente qué buscas.");
        setLoading(false);
        return;
      }

      try {
        await createLead({
          name: trimmedName,
          phone: trimmedPhone,
          email: trimmedEmail,
          channel: "Web",
          interested_in: interestedIn,
          initial_message: trimmedMessage,
        });
        setSuccess(true);
        setName("");
        setPhone("");
        setEmail("");
        setMessage(defaultMessage);
        onSuccess?.();
      } catch (submitError) {
        setError(
          submitError instanceof Error
            ? submitError.message
            : "No se pudo enviar tu mensaje. Intenta de nuevo.",
        );
      } finally {
        setLoading(false);
      }
    },
    [email, interestedIn, message, name, onSuccess, phone, defaultMessage],
  );

  const enableAutofill = useCallback(() => {
    setAutofillEnabled(true);
  }, []);

  const completionSteps = [
    name.trim().length >= 2,
    phone.trim().length > 0 || email.trim().includes("@"),
    message.trim().length > 0,
  ];
  const completionPercent = Math.round(
    (completionSteps.filter(Boolean).length / completionSteps.length) * 100,
  );

  return {
    name,
    setName,
    phone,
    setPhone,
    email,
    setEmail,
    message,
    setMessage,
    loading,
    success,
    error,
    autofillEnabled,
    enableAutofill,
    handleSubmit,
    resetForm,
    completionPercent,
    canSubmit:
      name.trim().length >= 2 &&
      (phone.trim().length > 0 || email.trim().includes("@")) &&
      message.trim().length > 0 &&
      !loading,
  };
}
