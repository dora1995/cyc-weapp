import request from "./";

type SearchSchoolOptsTypes =
  | {
      search_type: 1;
      location: string;
    }
  | {
      search_type: 2;
      keyword: string;
    }
  | {
      search_type: 3;
      area_id: string;
      education_nature: number;
    };

export type SearchSchoolOpts = SearchSchoolOptsTypes & {
  page: number;
  pagesize: number;
};

/**
 * 搜索学校
 * @param search_type 搜索类型：1位置 2校名 3地区
 * @param keyword 搜索关键词语，如果搜索类型为位置，则传位置中文位置信息；如果为地区则传地区ID，如果为校名则传校名
 * @param location 纬度和经度逗号分隔，如：‘111,22222’当搜索类型为位置时候必传
 */
export function searchSchool(opts: SearchSchoolOpts) {
  return request<{
    count: number;
    rows: Array<{ id: number; school_name: string; distance: string }>;
  }>(
    {
      method: "POST",
      url: "/user/school_search",
      data: { ...opts },
    },
    "搜索学校"
  );
}

export type SchoolDetail = {
  latitude: string; // 纬度
  longitude: string; // 经度
  geo_position: string; // 地理位置描述
  area_id: number; // 所在地区ID
  area_name: string; // 地区名称
  enr_telphone: string; // 招生电话
  school_enr_location: string; // 招生地段，用逗号分隔
  school_name: string; // 校名
  id: null;
  mp_name: null; // 公众号名称
  education_nature: null; // 办学性质
  spec_type: null; //特殊类型
  tuition: null; // 学费
  stay: null; // 住宿费
  enrollment_plan: null; // 招生计划
  enrollment_rules: null; // 招生简章
  middle_shcool_dk: null; // 对口中学
};
/**
 * 获取学校详情
 * @param school_id 学校id
 */
export function getSchoolDetail({ school_id }: { school_id: number }) {
  return request<SchoolDetail>(
    {
      method: "GET",
      url: `/user/school_search/${school_id}`,
    },
    "获取学校详情"
  );
}
interface GroupchatDetail {
  advertise_show: number; // 0不展示 1展示
  group_chat: string; // 进群交流图片
  mp_pic: string; // 公众号图片
  enrollment_pic: string; // 招生图片
  banner: string; // 详情底部图片
  advertise_pic: string; // 首页广告图片
  advertise_day: number; // 首页广告间隔
  name_status: number; // 首页icon名 1.分类查询 2.热门排行
}
export function getGroupchat() {
  return request<GroupchatDetail>(
    {
      method: "GET",
      url: `/user/groupchat`,
    },
    "获取学校详情"
  );
}
