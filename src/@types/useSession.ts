import { Session } from 'next-auth';

export interface sessionProps extends Session {
  activeSubscription?: boolean;
}