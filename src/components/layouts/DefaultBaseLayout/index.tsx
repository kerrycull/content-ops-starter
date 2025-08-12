import * as React from 'react';
import classNames from 'classnames';
import Header from '../../sections/Header';
import Footer from '../../sections/Footer';
import Script from 'next/script';

export default function DefaultBaseLayout(props) {
    const { page, site } = props;
    const { enableAnnotations = true } = site;
    const pageMeta = page?.__metadata || {};

    return (
        <div className={classNames('sb-page', pageMeta.pageCssClasses)} {...(enableAnnotations && { 'data-sb-object-id': pageMeta.id })}>
            <div className="sb-base sb-default-base-layout">
                {site.header && <Header {...site.header} enableAnnotations={enableAnnotations} />}
                {props.children}
                {site.footer && <Footer {...site.footer} enableAnnotations={enableAnnotations} />}
            </div>

            {/* Google tag (gtag.js) */}
            <Script src="https://www.googletagmanager.com/gtag/js?id=AW-17468610539" strategy="afterInteractive" />
            <Script id="gtag-init" strategy="afterInteractive">
                {`
                          window.dataLayer = window.dataLayer || [];
                          function gtag(){window.dataLayer.push(arguments);}
                          gtag('js', new Date());
                          gtag('config', 'AW-17468610539');
                        `}
            </Script>
        </div>
    );
}
