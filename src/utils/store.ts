import Conf from "conf";

interface savedRequest {
  url: string;
  method: string;
  data?: any;
  headers?: Record<string, string>;
  queryParams?: Record<string, string>;
  authToken?: string;
}

const store = new Conf<{ requests: Record<string, savedRequest> }>({
  projectName: "fluxapi",
  defaults: { requests: {} },
});

export const saveRequest = (name: string, request: savedRequest) => {
  const requests = store.get("requests");
  requests[name] = request;
  store.set("requests", requests);
};

export const getRequest = (name: string): savedRequest | undefined => {
  const requests = store.get("requests");
  return requests[name];
};

export const listRequests = (): string[] => {
  const requests = store.get("requests");
  return Object.keys(requests);
};

export const deleteRequest = (name: string): boolean => {
  const requests = store.get("requests");
  if (requests[name]) {
    delete requests[name];
    store.set("requests", requests);
    return true;
  }
  return false;
};
