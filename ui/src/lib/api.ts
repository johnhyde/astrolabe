import UrbitApi from '@urbit/http-api';
console.log(`Initializing Urbit API at ${Date()}`);
const api: UrbitApi = new UrbitApi('');

function scry<T = any>(path: string): Promise<T> {
  return api.scry<T>({ app: 'astrolabe', path });
}

function getPoint(patp: string): Promise<any> {
  return scry<any>(`/point/${patp}`);
}

function getSpawnedPoints(patp: string): Promise<any> {
  return scry<any>(`/point/${patp}/spawned`);
}

function searchPoints(search: string): Promise<any> {
  return scry<any>(`/search/${search}`);
}

function getDoc(path: string): Promise<string> {
  return scry<string>(`/doc/${path}`);
}

export {
  api,
  scry,
  getPoint,
  getSpawnedPoints,
  searchPoints,
  getDoc,
};
