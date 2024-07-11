import Axios from "axios";
import mpAdapter from "axios-miniprogram-adapter";

import baseEnv from "@/baseEnv";

if (baseEnv.platform === "weapp") {
  Axios.defaults.adapter = mpAdapter;
}
const axiosInstance = Axios.create({
  timeout: baseEnv.requestTimeout,
});

axiosInstance.interceptors.request.use(
  async (config) => {
    config.headers["content-type"] = "application/json";
    return config;
  },
  (err) => Promise.reject(err)
);

type Result = {
  location: {
    lat: number;
    lng: number;
  } | null;

  address: string;
  address_component: {
    city: string;
    district: string;
    nation: string;
    province: string;
    street: string;
    street_number: string;
  };
  ad_info: {
    adcode: string;
  };
  address_components: {
    city: string;
    district: string;
    province: string;
    street: string;
    street_number: string;
  };
};

type Response<R extends Result, S extends number, M extends string = string> = {
  status: S;
  message: M;
  request_id: string;
  result: R;
};

type ServerResponse<R extends Result> =
  | Response<R, 0, "query ok"> // 正常
  | Response<R, number, string>; // status 非0为异常的情况

type Opts =
  | { type: "address"; address: string; city: "广州市" }
  | { type: "location"; latitude: number; longitude: number };

class GeocoderError extends Error {
  constructor(public message: string, public status: number) {
    super();
  }
}

/**
 * 逆地址解析
 */
export default async function request<BackData extends Result>(opts: Opts) {
  // wxLog.info('geocoder opts', opts)
  const params = { key: baseEnv.TENCENT_MAP_KEY };
  if (opts.type === "address") {
    Object.assign(params, { address: `${opts.city}${opts.address}` });
  } else {
    Object.assign(params, { location: `${opts.latitude},${opts.longitude}` });
  }
  console.log(params);
  const response = await axiosInstance.request<BackData>({
    ...opts,
    url: "https://apis.map.qq.com/ws/geocoder/v1/",
    params,
    async transformResponse(res: ServerResponse<BackData>): Promise<BackData> {
      switch (res.status) {
        case 0:
          return res.result;

        default:
          throw new GeocoderError(`逆地址解析失败: ${res.message}`, res.status);
      }
    },
  });

  const { data } = response;
  return data;
}
