import * as React from 'react';
import classNames from 'classnames';

import { getComponent } from '../../components-registry';
import { mapStylesToClassNames as mapStyles } from '../../../utils/map-styles-to-class-names';
import SubmitButtonFormControl from './SubmitButtonFormControl';

// Let TS know gtag can exist on window
declare global {
    interface Window {
        gtag?: (...args: any[]) => void;
    }
}

export default function FormBlock(props) {
    const formRef = React.useRef<HTMLFormElement>(null);
    const [submitted, setSubmitted] = React.useState(false);
    const { fields = [], elementId, submitButton, className, styles = {}, 'data-sb-field-path': fieldPath } = props;

    if (fields.length === 0) {
        return null;
    }

    // Same behavior as the snippet, but safe in React/TS
    const gtagReportConversion = React.useCallback((url?: string) => {
        const callback = () => {
            if (typeof url !== 'undefined') {
                window.location.href = url;
            }
        };

        if (typeof window !== 'undefined' && typeof window.gtag === 'function') {
            window.gtag('event', 'conversion', {
                send_to: 'AW-17462240755/nDiDCOKhp4UbEPPL0oZB',
                event_callback: callback
            });
        } else {
            // If gtag didn't load for some reason, still run callback to avoid blocking UX
            callback();
        }

        return false;
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formRef.current) return;

        const formData = new FormData(formRef.current);
        formData.append('form-name', elementId);

        try {
            await fetch('/', {
                method: 'POST',
                headers: { Accept: 'application/x-www-form-urlencoded' },
                body: new URLSearchParams(Array.from(formData.entries()).map(([k, v]) => [k, String(v)]))
            });

            // Fire the conversion after a successful submit
            gtagReportConversion(); // pass a URL if you want to redirect after the event

            setSubmitted(true);
            formRef.current.reset();
        } catch (error) {
            alert('There was a problem submitting the form. Please try again.');
        }
    };

    if (submitted) {
        return (
            <div className="p-4 rounded bg-green-100 text-green-800">
                <strong>Thank you!</strong> Your form has been submitted.
            </div>
        );
    }

    return (
        <form
            className={classNames(
                'sb-component',
                'sb-component-block',
                'sb-component-form-block',
                className,
                styles?.self?.margin ? mapStyles({ margin: styles?.self?.margin }) : undefined,
                styles?.self?.padding ? mapStyles({ padding: styles?.self?.padding }) : undefined,
                styles?.self?.borderWidth && styles?.self?.borderWidth !== 0 && styles?.self?.borderStyle !== 'none'
                    ? mapStyles({
                          borderWidth: styles?.self?.borderWidth,
                          borderStyle: styles?.self?.borderStyle,
                          borderColor: styles?.self?.borderColor ?? 'border-primary'
                      })
                    : undefined,
                styles?.self?.borderRadius ? mapStyles({ borderRadius: styles?.self?.borderRadius }) : undefined
            )}
            name={elementId}
            id={elementId}
            method="POST"
            data-netlify="true"
            ref={formRef}
            data-sb-field-path={fieldPath}
            onSubmit={handleSubmit}
            data-netlify-honeypot="bot-field"
        >
            {/* Netlify-required fields */}
            <input type="hidden" name="form-name" value={elementId} />
            <div style={{ display: 'none' }}>
                <label>
                    Don’t fill this out: <input name="bot-field" />
                </label>
            </div>

            <div
                className={classNames('w-full', 'flex', 'flex-wrap', 'gap-8', mapStyles({ justifyContent: styles?.self?.justifyContent ?? 'flex-start' }))}
                {...(fieldPath && { 'data-sb-field-path': '.fields' })}
            >
                {fields.map((field, index) => {
                    const modelName = field.__metadata.modelName;
                    if (!modelName) {
                        throw new Error(`form field does not have the 'modelName' property`);
                    }
                    const FormControl = getComponent(modelName);
                    if (!FormControl) {
                        throw new Error(`no component matching the form field model name: ${modelName}`);
                    }
                    return <FormControl key={index} {...field} {...(fieldPath && { 'data-sb-field-path': `.${index}` })} />;
                })}
            </div>

            {submitButton && (
                <div className={classNames('mt-8', 'flex', mapStyles({ justifyContent: styles?.self?.justifyContent ?? 'flex-start' }))}>
                    <SubmitButtonFormControl {...submitButton} {...(fieldPath && { 'data-sb-field-path': '.submitButton' })} />
                </div>
            )}
        </form>
    );
}
