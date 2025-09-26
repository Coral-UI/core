import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';
import starlightThemeBlack from 'starlight-theme-black'

// https://astro.build/config
export default defineConfig({
  integrations: [
    starlight({
      title: 'Coral UI',
      customCss:['./src/styles/custom.css'],
      social: [
        { icon: 'github', label: 'GitHub', href: 'https://github.com/Coral-UI/core' },
      ],
      plugins: [starlightThemeBlack({
        navLinks: [
          {
            label: 'Home',
            link: '/',
          },
          {
            label: 'Getting Started',
            link: '/overview',
          },
          {
            label: 'Documentation',
            link: '/core',
          },
        ],
        footerText: 'Coral UI - Design to Code Toolkit',
      })],
      sidebar: [
        {
          label: 'Getting Started',
          items: [
            { slug: 'overview' },
            { slug: 'installation' },
            { slug: 'quick-start' },
          ],
        },
        {
          label: 'Core Concepts',
          items: [
            { slug: 'concepts/overview' },
            { slug: 'concepts/coral-spec' },
            { slug: 'concepts/transformations' },
            { slug: 'concepts/schemas' },
          ],
        },
        {
          label: 'Packages',
          items: [
            { slug: 'packages/core' },
            // { slug: 'packages/react-to-coral' },
            // { slug: 'packages/coral-to-html' },
            // { slug: 'packages/tw2css' },
            // { slug: 'packages/style-to-tailwind' },
          ],
        },
        {
          label: 'API Reference',
          items: [
            { slug: 'api/core-functions' },
            // { slug: 'api/types' },
            // { slug: 'api/schemas' },
          ],
        },
        {
          label: 'Examples',
          items: [
            { slug: 'examples/basic-usage' },
            // { slug: 'examples/react-integration' },
            // { slug: 'examples/html-generation' },
            // { slug: 'examples/style-conversion' },
          ],
        },
        {
          label: 'Advanced',
          items: [
            // { slug: 'advanced/figma-plugin' },
            // { slug: 'advanced/custom-transformations' },
            // { slug: 'advanced/schema-validation' },
          ],
        },
      ],
    }),
  ],
});
