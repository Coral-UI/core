import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';

// https://astro.build/config
export default defineConfig({
  integrations: [
    starlight({
      title: 'Coral UI',
      customCss:['./src/styles/custom.css'],
      sidebar: [
        {
          label: 'Getting Started',
          autogenerate: { directory: 'getting-started' },
        },
        {
          label: 'Coral UI',
          autogenerate: { directory: 'core' },
        }
      ]
    }),
  ],
});
