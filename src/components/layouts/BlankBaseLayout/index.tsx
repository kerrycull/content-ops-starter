import * as React from 'react';
import Head from 'next/head';
import classNames from 'classnames';

export default function BlankBaseLayout(props) {
    const { page, site } = props;
    const { enableAnnotations = true } = site;
    const pageMeta = page?.__metadata || {};
    return (
        <div className={classNames('sb-page', pageMeta.pageCssClasses)} {...(enableAnnotations && { 'data-sb-object-id': pageMeta.id })}>
            <Head>
                <title>{page.title}</title>
                <meta name="description" content="Components Library" />
                {site.favicon && <link rel="icon" href={site.favicon} />}
            </Head>
            <script async src="https://www.googletagmanager.com/gtag/js?id=AW-17462240755"></script>
            <script>
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());

            gtag('config', 'AW-17462240755');
            </script>
            {props.children}
        </div>
    );
}
