export * from '../backend.d';

// Re-export the actor creation function
import { idlFactory } from './backend.did.js';
import { Actor, HttpAgent } from '@dfinity/agent';
import type { ActorSubclass, HttpAgentOptions } from '@dfinity/agent';
import type { backendInterface } from '../backend.d';

export interface CreateActorOptions {
  agentOptions?: HttpAgentOptions;
  agent?: HttpAgent;
}

export function createActor(canisterId: string, options?: CreateActorOptions): backendInterface {
  const agent = options?.agent || new HttpAgent({ 
    host: options?.agentOptions?.host || (import.meta.env.DEV ? 'http://localhost:4943' : undefined),
    ...options?.agentOptions
  });

  if (import.meta.env.DEV) {
    agent.fetchRootKey().catch(err => {
      console.warn('Unable to fetch root key. Check to ensure that your local replica is running');
      console.error(err);
    });
  }

  return Actor.createActor<backendInterface>(idlFactory, {
    agent,
    canisterId,
  });
}
