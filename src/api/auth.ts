import request from "./";

/**
 * 提交小程序授权登录的 code
 * @param code 小程序的 code
 * @param source_id （可选）来源 id
 *
 * 提交成功会返回 token，记得更新它
 */
export function submitWeappLoginCode({
  code, // source_id,
}: {
  code: string;
  // source_id?: string
}) {
  return request<{ token: string }>(
    {
      method: "POST",
      url: "/user/auth/weapp/login",
      data: { code },
    },
    "授权登录"
  );
}

/**
 * 提交用户位置信息和年级
 */
export function submitBasicInfo({
  lng,
  lat,
  grade,
  location,
  living_area,
  is_intent,
  phone,
  grade_content,
}: {
  lng: string | undefined;
  lat: string | undefined;
  grade: number;
  location: string | undefined;
  living_area: string;
  is_intent: number;
  phone: string;
  grade_content: string;
}) {
  return request<null>(
    {
      method: "POST",
      url: "/user/auth/weapp/profile",
      data: {
        lng,
        lat,
        grade,
        location,
        living_area,
        is_intent,
        phone,
        grade_content,
      },
    },
    "提交用户位置信息和年级"
  );
}

/**
 * 提交小程序的用户资料(小程序新接口)
 *
 * 提交成功会返回一个 token，记得更新它
 */
export function refreshUserProfile({
  encryptedData,
  iv,
  userInfo,
}: {
  encryptedData: string;
  iv: string;
  userInfo: {
    avatarUrl: string;
    country: string;
    province: string;
    city: string;
    gender: 0 | 1 | 2; // 0未知  1男性  2女性
    language: "en" | "zh_CN" | "zh_TW";
    nickName: string;
  };
}) {
  return request<{
    token: string;
  }>(
    {
      method: "POST",
      url: "/user/auth/weapp/user/getUserProfile",
      data: { encryptedData, iv, userInfo },
    },
    "更新用户资料"
  );
}

/**
 * 提交小程序的用户资料
 *
 * 提交成功会返回一个 token，记得更新它
 */
export function refreshWeappUserInfo({
  encryptedData,
  iv,
}: {
  encryptedData: string;
  iv: string;
}) {
  return request<{
    token: string;
  }>(
    {
      method: "POST",
      url: "/user/auth/weapp/userInfo",
      data: { encryptedData, iv },
    },
    "提交用户资料"
  );
}

/**
 * 提交手机信息
 *
 * 提交成功会返回一个 token，记得更新它
 */
export function submitPhone({
  encryptedData,
  iv,
}: {
  encryptedData: string;
  iv: string;
}) {
  return request<{
    token: string;
  }>(
    {
      method: "POST",
      url: "/user/auth/weapp/phone",
      data: { encryptedData, iv },
    },
    "提交手机信息"
  );
}

/**
 * 获取用户基本信息
 *
 * 提交成功会返回一个 token，记得更新它
 */
export function getBasicInfo() {
  return request<{
    location: string;
    lng: string;
    lat: string;
    grade: string;
  }>(
    {
      method: "GET",
      url: "/user/auth/weapp/user/center/info",
      data: {},
    },
    "获取用户基本信息"
  );
}

// 提交意向表单
export function submitIntentProfile(data: any) {
  return request<{
    location: string;
    lng: string;
    lat: string;
    grade: string;
  }>(
    {
      method: "POST",
      url: "/user/auth/weapp/user/submitIntentProfile",
      data,
    },
    "提交意向信息"
  );
}
export function submitIntentSurvey(data: any) {
  return request(
    {
      method: "POST",
      url: "/user/auth/weapp/user/submitIntentSurvey",
      data,
    },
    "提交意向调查"
  );
}
