import * as React from 'react';
import Markdown from 'markdown-to-jsx';
import classNames from 'classnames';

import { mapStylesToClassNames as mapStyles } from '../../../utils/map-styles-to-class-names';
import { Social, Action, Link } from '../../atoms';
import ImageBlock from '../../blocks/ImageBlock';

export default function Footer(props) {
    const {
        colors = 'bg-light-fg-dark',
        logo,
        title,
        text,
        primaryLinks,
        secondaryLinks,
        socialLinks = [],
        legalLinks = [],
        copyrightText,
        styles = {},
        enableAnnotations
    } = props;

    // ----- NEW: local state + submit handler (AJAX, no refresh) -----
    const [email, setEmail] = React.useState('');
    const [loading, setLoading] = React.useState(false);
    const [status, setStatus] = React.useState('idle'); // 'idle' | 'success' | 'error'

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!email) return;
        setLoading(true);
        setStatus('idle');

        // Netlify Forms AJAX post: send x-www-form-urlencoded to "/"
        const data = {
            'form-name': 'newsletter',
            email,
            'bot-field': '' // honeypot stays empty
        };

        try {
            await fetch('/', {
                method: 'POST',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                body: new URLSearchParams(data).toString()
            });
            setStatus('success');
            setEmail('');
        } catch (err) {
            setStatus('error');
        } finally {
            setLoading(false);
        }
    };
    // ---------------------------------------------------------------

    return (
        <footer
            className={classNames(
                'sb-component sb-component-footer',
                colors,
                'px-4',
                styles?.self?.margin ? mapStyles({ padding: styles?.self?.margin }) : undefined,
                styles?.self?.padding ? mapStyles({ padding: styles?.self?.padding }) : 'pt-20 pb-20',
                'pb-[env(safe-area-inset-bottom)]'
            )}
            {...(enableAnnotations && { 'data-sb-object-id': props?.__metadata?.id })}
        >
            <div className="mx-auto max-w-7xl">
                {/* === TOP: vertically centered on desktop, natural stack on mobile === */}
                <div className="min-h-[220px] block lg:flex lg:items-center py-10">
                    <div className="grid gap-10 lg:grid-cols-12 items-center w-full">
                        {/* Brand + socials */}
                        {(logo?.url || title || text || socialLinks.length > 0) && (
                            <div className="lg:col-span-4">
                                {(logo?.url || title) && (
                                    <Link href="/" className="flex items-center gap-3">
                                        {logo && (
                                            <ImageBlock
                                                {...logo}
                                                className="inline-block w-auto h-8"
                                                {...(enableAnnotations && { 'data-sb-field-path': 'logo' })}
                                            />
                                        )}
                                        {title && (
                                            <div className="h4" {...(enableAnnotations && { 'data-sb-field-path': 'title' })}>
                                                {title}
                                            </div>
                                        )}
                                    </Link>
                                )}

                                {text && (
                                    <Markdown
                                        options={{ forceBlock: true, forceWrapper: true }}
                                        className={classNames('sb-markdown text-sm mt-4')}
                                        {...(enableAnnotations && { 'data-sb-field-path': 'text' })}
                                    >
                                        {text}
                                    </Markdown>
                                )}

                                {socialLinks.length > 0 && (
                                    <ul className="flex items-center gap-5 mt-6" {...(enableAnnotations && { 'data-sb-field-path': 'socialLinks' })}>
                                        {socialLinks.map((link, i) => (
                                            <li key={i} className="text-xl">
                                                <Social {...link} {...(enableAnnotations && { 'data-sb-field-path': `.${i}` })} />
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </div>
                        )}

                        {/* Links */}
                        <div className="lg:col-span-4 grid grid-cols-2 gap-8">
                            {primaryLinks && <FooterLinksGroup {...primaryLinks} {...(enableAnnotations && { 'data-sb-field-path': 'primaryLinks' })} />}
                            {secondaryLinks && <FooterLinksGroup {...secondaryLinks} {...(enableAnnotations && { 'data-sb-field-path': 'secondaryLinks' })} />}
                        </div>

                        {/* Subscribe */}
                        <div className="lg:col-span-4">
                            <h2 className="text-sm tracking-wider opacity-90 mb-3">Want to get our newsletter?</h2>

                            {/* If success, show confirmation box instead of form */}
                            {status === 'success' ? (
                                <div role="status" aria-live="polite" className="px-4 py-3 rounded border border-white/15 bg-white/5 text-sm">
                                    Email submitted! Check your inbox for confirmation.
                                </div>
                            ) : (
                                // Netlify Forms (kept for backend processing), but we intercept submit
                                <form
                                    name="newsletter"
                                    method="POST"
                                    data-netlify="true"
                                    netlify-honeypot="bot-field"
                                    className="w-full"
                                    onSubmit={handleSubmit}
                                >
                                    {/* Netlify hidden fields */}
                                    <input type="hidden" name="form-name" value="newsletter" />
                                    <p className="hidden">
                                        <label>
                                            Don’t fill this out: <input name="bot-field" />
                                        </label>
                                    </p>

                                    {/* Flat, clean input + button */}
                                    <div className="flex flex-col sm:flex-row sm:items-stretch gap-2 sm:gap-0">
                                        <label htmlFor="newsletter-email" className="sr-only">
                                            Email
                                        </label>
                                        <input
                                            id="newsletter-email"
                                            name="email"
                                            type="email"
                                            required
                                            placeholder="Your email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            className={classNames(
                                                'flex-1 px-3 py-2 text-sm',
                                                'rounded sm:rounded-l-md sm:rounded-r-none',
                                                'border border-white/15 bg-white/5 text-white placeholder-white/70',
                                                'focus:outline-none focus:ring-1 focus:ring-white/20 focus:border-white/30',
                                                loading && 'opacity-70 cursor-not-allowed'
                                            )}
                                            disabled={loading}
                                        />
                                        <button
                                            type="submit"
                                            disabled={loading}
                                            className={classNames(
                                                'px-5 py-2 text-sm font-medium transition-colors',
                                                'bg-[#2a2a2a] text-white hover:bg-[#1e1e1e]',
                                                'rounded sm:rounded-r-md sm:rounded-l-none',
                                                'border border-white/15 sm:border-l-0',
                                                'focus:outline-none focus:ring-1 focus:ring-white/20 focus:border-white/30',
                                                loading && 'opacity-70 cursor-not-allowed'
                                            )}
                                        >
                                            {loading ? 'Submitting…' : 'Subscribe'}
                                        </button>
                                    </div>

                                    {status === 'error' && (
                                        <p className="text-xs mt-2 text-red-300" role="alert">
                                            Something went wrong. Please try again.
                                        </p>
                                    )}

                                    <p className="text-xs opacity-70 mt-2">No spam. Unsubscribe anytime.</p>
                                </form>
                            )}
                        </div>
                    </div>
                </div>
                {/* === /TOP === */}

                {/* Bottom: legal + copyright */}
                {(copyrightText || legalLinks.length > 0) && (
                    <div className="border-t border-white/10 pt-6 mt-12 mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                        {legalLinks.length > 0 && (
                            <ul className="flex flex-wrap gap-x-6 gap-y-2" {...(enableAnnotations && { 'data-sb-field-path': 'legalLinks' })}>
                                {legalLinks.map((link, index) => (
                                    <li key={index}>
                                        <Action
                                            {...link}
                                            className="text-sm opacity-90 hover:opacity-100"
                                            {...(enableAnnotations && { 'data-sb-field-path': `.${index}` })}
                                        />
                                    </li>
                                ))}
                            </ul>
                        )}
                        {copyrightText && (
                            <Markdown
                                options={{ forceInline: true, forceWrapper: true, wrapper: 'p' }}
                                className="sb-markdown text-sm opacity-80"
                                {...(enableAnnotations && { 'data-sb-field-path': 'copyrightText' })}
                            >
                                {copyrightText}
                            </Markdown>
                        )}
                    </div>
                )}
            </div>
        </footer>
    );
}

function FooterLinksGroup(props) {
    const { title, links = [] } = props;
    const fieldPath = props['data-sb-field-path'];
    if (links.length === 0) return null;

    return (
        <div data-sb-field-path={fieldPath}>
            {title && (
                <h3 className="uppercase text-sm tracking-wider opacity-90" {...(fieldPath && { 'data-sb-field-path': '.title' })}>
                    {title}
                </h3>
            )}
            <ul className={classNames('space-y-2.5 mt-3', { 'mt-4': title })} {...(fieldPath && { 'data-sb-field-path': '.links' })}>
                {links.map((link, index) => (
                    <li key={index}>
                        <Action {...link} className="text-sm opacity-90 hover:opacity-100" {...(fieldPath && { 'data-sb-field-path': `.${index}` })} />
                    </li>
                ))}
            </ul>
        </div>
    );
}
