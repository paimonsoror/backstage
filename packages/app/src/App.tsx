import { createApp } from '@backstage/frontend-defaults';
import catalogPlugin from '@backstage/plugin-catalog/alpha';
import kubernetesPlugin from '@backstage/plugin-kubernetes/alpha';
import argoCDPlugin from '@roadiehq/backstage-plugin-argo-cd/alpha';
import scaffolderPlugin from '@backstage/plugin-scaffolder/alpha';
import orgPlugin from '@backstage/plugin-org/alpha';
import { navModule } from './modules/nav';
import { homeModule } from './modules/home';

import {
  ApiBlueprint,
  configApiRef,
  createApiRef,
  createFrontendModule,
  discoveryApiRef,
  oauthRequestApiRef,
} from '@backstage/frontend-plugin-api';
import { SignInPageBlueprint } from '@backstage/plugin-app-react';
import { SignInPage, UserIcon } from '@backstage/core-components';
import { OAuth2 } from '@backstage/core-app-api';
import type {
  BackstageIdentityApi,
  OpenIdConnectApi,
  ProfileInfoApi,
  SessionApi,
} from '@backstage/core-plugin-api';

const oidcAuthApiRef = createApiRef<
  OpenIdConnectApi & ProfileInfoApi & BackstageIdentityApi & SessionApi
>().with({
  id: 'auth.oidc',
});

const oidcAuthApi = ApiBlueprint.make({
  name: 'oidc',
  params: define =>
    define({
      api: oidcAuthApiRef,
      deps: {
        discoveryApi: discoveryApiRef,
        oauthRequestApi: oauthRequestApiRef,
        configApi: configApiRef,
      },
      factory: ({ discoveryApi, oauthRequestApi, configApi }) =>
        OAuth2.create({
          configApi,
          discoveryApi,
          oauthRequestApi,
          provider: { id: 'oidc', title: 'Authentik', icon: UserIcon },
          defaultScopes: ['openid', 'profile', 'email', 'offline_access'],
        }),
    }),
});

const signInPage = SignInPageBlueprint.make({
  params: {
    loader: async () => props =>
      (
        <SignInPage
          {...props}
          provider={{
            id: 'oidc-auth-provider',
            title: 'Authentik',
            message: 'Sign in using Authentik',
            apiRef: oidcAuthApiRef,
          }}
        />
      ),
  },
});

const authModule = createFrontendModule({
  pluginId: 'app',
  extensions: [oidcAuthApi, signInPage],
});

export default createApp({
  features: [
    catalogPlugin,
    kubernetesPlugin,
    argoCDPlugin,
    scaffolderPlugin,
    orgPlugin,
    navModule,
    homeModule,
    authModule,
  ],
});
