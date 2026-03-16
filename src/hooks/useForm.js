import { useState, useCallback } from 'react';

/**
 * useForm
 * A generic form state manager.
 *
 * @param {object}   initialValues  - Initial field values
 * @param {function} validateFn     - Optional validator: (values) => errors object
 * @param {function} onSubmit       - Async submit handler: (values) => void
 */

const useForm = (initialValues = {}, validateFn = null, onSubmit = null) => {
  const [values,    setValues]    = useState(initialValues);
  const [errors,    setErrors]    = useState({});
  const [touched,   setTouched]   = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError,  setSubmitError]  = useState(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  // ─── Set a single field value ────────────────────────────────────────────────
  const handleChange = useCallback((field, value) => {
    setValues((prev) => ({ ...prev, [field]: value }));

    // Clear error on change
    if (errors[field]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
  }, [errors]);

  // ─── Mark field as touched on blur ───────────────────────────────────────────
  const handleBlur = useCallback((field) => {
    setTouched((prev) => ({ ...prev, [field]: true }));

    // Validate on blur if validator provided
    if (validateFn) {
      const result = validateFn(values);
      if (result[field]) {
        setErrors((prev) => ({ ...prev, [field]: result[field] }));
      }
    }
  }, [values, validateFn]);

  // ─── Set multiple values at once ─────────────────────────────────────────────
  const setFieldValues = useCallback((updates) => {
    setValues((prev) => ({ ...prev, ...updates }));
  }, []);

  // ─── Set a specific field error ──────────────────────────────────────────────
  const setFieldError = useCallback((field, message) => {
    setErrors((prev) => ({ ...prev, [field]: message }));
  }, []);

  // ─── Validate all fields ─────────────────────────────────────────────────────
  const validate = useCallback(() => {
    if (!validateFn) return true;
    const result = validateFn(values);
    setErrors(result);
    // Touch all fields
    const allTouched = Object.keys(values).reduce((acc, key) => {
      acc[key] = true;
      return acc;
    }, {});
    setTouched(allTouched);
    return Object.keys(result).length === 0;
  }, [values, validateFn]);

  // ─── Submit ──────────────────────────────────────────────────────────────────
  const handleSubmit = useCallback(async () => {
    setSubmitError(null);
    setSubmitSuccess(false);

    const isValid = validate();
    if (!isValid) return;

    if (!onSubmit) return;

    setIsSubmitting(true);
    try {
      await onSubmit(values);
      setSubmitSuccess(true);
    } catch (error) {
      const msg = error?.message || 'Something went wrong. Please try again.';
      setSubmitError(msg);
    } finally {
      setIsSubmitting(false);
    }
  }, [values, validate, onSubmit]);

  // ─── Reset ───────────────────────────────────────────────────────────────────
  const resetForm = useCallback((newValues = null) => {
    setValues(newValues || initialValues);
    setErrors({});
    setTouched({});
    setIsSubmitting(false);
    setSubmitError(null);
    setSubmitSuccess(false);
  }, [initialValues]);

  // ─── Helpers ─────────────────────────────────────────────────────────────────
  const getFieldProps = useCallback((field) => ({
    value:         values[field] ?? '',
    onChangeText:  (val) => handleChange(field, val),
    onBlur:        ()    => handleBlur(field),
    error:         touched[field] ? errors[field] || null : null,
  }), [values, errors, touched, handleChange, handleBlur]);

  const isDirty = JSON.stringify(values) !== JSON.stringify(initialValues);
  const isValid = Object.keys(errors).length === 0;

  return {
    values,
    errors,
    touched,
    isSubmitting,
    submitError,
    submitSuccess,
    isDirty,
    isValid,

    handleChange,
    handleBlur,
    handleSubmit,
    setFieldValues,
    setFieldError,
    validate,
    resetForm,
    getFieldProps,
  };
};

export default useForm;