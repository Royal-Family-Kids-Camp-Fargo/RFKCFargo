import { authStore } from '~/stores/authStore.client';
import type { Route } from './+types/dashboard';
import { Outlet, redirect } from 'react-router';
import { Separator } from '~/components/ui/separator';
import { TopNav } from '~/components/TopNav';
import DashNav from '~/components/DashNav';
import pipelineApi, { type Pipeline } from '~/api/objects/pipeline';
import formApi, { type Form } from '~/api/objects/form';
import { useState, useEffect } from 'react';
import type { User } from '~/api/objects/user';
import userApi from '~/api/objects/user';
import { botContextStore } from '~/stores/botContextStore';
import { Toaster } from '~/components/ui/sonner';
import { useMediaQuery } from '~/hooks/use-media-query.tsx';
import ChatBubble from '~/components/chat/ChatBubble';
import { LoadingBar } from '~/components/LoadingBar';

type LoaderData = {
  user: User;
  pipelines: Pipeline[];
  forms: Form[];
};

export async function clientLoader({ params }: Route.ClientLoaderArgs) {
  let auth =
    authStore.getAuth() || JSON.parse(localStorage.getItem('auth') || '{}');
  authStore.setAuth(auth);
  let user = authStore.getUser();
  console.log('auth', auth);
  if (!auth.access_token) {
    console.log('No auth');
    authStore.logout();
    return redirect('/sign-in');
  }
  if (!user) {
    console.log('Getting user');
    const result = await userApi.get(auth.roleid);
    if ('message' in result) {
      console.error('Error getting user', result);
      authStore.logout();
      return redirect('/sign-in');
    }
    user = result;
    console.log('user', user);
    authStore.setUser(user);
  }
  // Add the pipelines and forms fetch
  const [pipelines, forms] = await Promise.all([
    pipelineApi.getAll({ limit: 100, offset: 0, ordering: '', filter: '' }),
    formApi.getAll({ limit: 100, offset: 0, ordering: '', filter: '' }),
  ]);
  return { user, pipelines: pipelines.data, forms: forms.data };
}

export default function Dashboard({ loaderData }: Route.ComponentProps) {
  const { user, pipelines, forms } = loaderData;
  const [sideBarOpen, setSideBarOpen] = useState(true);
  const isMobile = useMediaQuery('(max-width: 768px)');
  const addBotContext = botContextStore.addContext;
  const removeBotContext = botContextStore.removeContext;

  useEffect(() => {
    if (isMobile) {
      setSideBarOpen(false);
    }
  }, []);

  // Watch for changes in isMobile state
  useEffect(() => {
    if (isMobile) {
      setSideBarOpen(false);
    }
    console.log('isMobile', isMobile);
    console.log('sideBarOpen', sideBarOpen);
  }, [isMobile]);

  useEffect(() => {
    if (loaderData && 'user' in loaderData) {
      const context = `User is logged in with id: ${user.id}`;
      const locationContext = `User's location id is: ${user.location_id}; Any users added by this user will be in this location`;
      addBotContext(context);
      addBotContext(locationContext);

      return () => {
        removeBotContext(context);
        removeBotContext(locationContext);
      };
    }
  }, [loaderData]);

  if ('user' in loaderData) {
    const { user, pipelines, forms } = loaderData as LoaderData;
  }

  return (
    <>
      <div className="flex h-screen flex-1">
        <DashNav
          user={user}
          pipelines={pipelines}
          forms={forms}
          sideBarOpen={sideBarOpen}
          setSideBarOpen={setSideBarOpen}
          isMobile={isMobile}
        />
        <div className="flex h-screen flex-col flex-1">
          <TopNav setSideBarOpen={setSideBarOpen} />
          <LoadingBar />
          <Separator />
          <main className="flex-1 overflow-auto p-4">
            <Outlet />
          </main>
        </div>
      </div>
      <ChatBubble />
      <Toaster />
    </>
  );
}
