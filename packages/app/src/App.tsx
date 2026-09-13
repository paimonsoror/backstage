import { createApp } from '@backstage/frontend-defaults';
import catalogPlugin from '@backstage/plugin-catalog/alpha';
import kubernetesPlugin from '@backstage/plugin-kubernetes/alpha';
import argoCDPlugin from '@roadiehq/backstage-plugin-argo-cd/alpha';
import { navModule } from './modules/nav';
import { homeModule } from './modules/home';

export default createApp({
  features: [catalogPlugin, kubernetesPlugin, argoCDPlugin, navModule, homeModule],
});
