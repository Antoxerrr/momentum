import axios from "axios";
import {getAccessToken, purgeAccessToken} from "@/core/local-storage.js";
import { getUserTimeZone } from "./utils";


function getDefaultBaseUrl() {
  const currentOrigin = window.location.origin;
  return `${currentOrigin}/api/`;
}

function detailedPath(path, id) {
  return `${path}${id}/`
}

class APIClient {
  constructor(baseUrl) {
    this.client = axios.create({
      baseURL: baseUrl || getDefaultBaseUrl(),
    });
    this._setupInterceptors();
    this.setAuthToken();
    this.setTimezone();

    this.tasks = new TasksModule(this);
    this.users = new UsersModule(this);
  }

  _setupInterceptors() {
    this.client.interceptors.response.use(
      response => response,
      error => {
        if (error.response.status === 401) {
          purgeAccessToken();
          this.setAuthToken();
          // TODO: хрень?
          location.href = '/login';
        }
        return Promise.reject(error);
      }
    );
  }

  setTimezone() {
    this.client.defaults.headers.common['X-User-Timezone'] = getUserTimeZone();
  }

  setAuthToken() {
    const token = getAccessToken();
    if (token) {
      this.client.defaults.headers.common['Authorization'] = `Token ${token}`;
    } else {
      delete this.client.defaults.headers.common['Authorization'];
    }
  }

  async get(path, params) {
    return await this.client.get(path, { params });
  }

  async post(path, data) {
    return await this.client.post(path, data);
  }

  async patch(path, data) {
    return await this.client.patch(path, data);
  }

  async delete(path) {
    return await this.client.delete(path);
  }
}

class BaseAPIModule {
  constructor(api) {
    this.api = api;
  }
}

class CRUDModule extends BaseAPIModule{
  async list(params) {
    return await this.api.get(this.path, params);
  }

  async retrieve(id, params) {
    return await this.api.get(detailedPath(this.path, id), params);
  }

  async create(data) {
    return await this.api.post(this.path, data);
  }

  async update(id, data) {
    return await this.api.patch(detailedPath(this.path, id), data);
  }

  async delete(id) {
    return await this.api.delete(detailedPath(this.path, id));
  }
}

class TasksModule extends CRUDModule {
  path = 'tasks/';

  async archive(id) {
    const path = `tasks/${id}/archive/`;
    return this.api.patch(path);
  }
}

class UsersModule extends BaseAPIModule {
  async register(data) {
    return await this.api.post("users/register/", data);
  }

  async login(data) {
    return await this.api.post("users/login/", data);
  }

  async me() {
    return await this.api.get("users/me/");
  }

  async editMe(data) {
    return await this.api.patch("users/me/", data);
  }

  async availableTimezones() {
    return await this.api.get("users/available_timezones/");
  }
}

let apiInstance = null;

export function getAPI() {
  if (!apiInstance) {
    apiInstance = new APIClient(import.meta.env.VITE_BASE_API_URL);
  }
  apiInstance.setAuthToken();
  apiInstance.setTimezone();
  return apiInstance;
}
