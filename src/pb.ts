import PocketBase from 'pocketbase';
import localEnv from './env';

const pb = new PocketBase(localEnv.PUBLIC_SERVER);
pb.autoCancellation(false);

export default pb;
