import request from './'

type SearchSchoolOptsTypes =
  | {
    search_type: 1
    location: string
  }
  | {
    search_type: 2
    keyword: string
  }
  | {
    search_type: 3
    area_id: string
    education_nature: number
  }

export type SearchSchoolOpts = SearchSchoolOptsTypes & {
  page: number
  pagesize: number
}

/**
 * 搜索学校
 * @param search_type 搜索类型：1位置 2校名 3地区
 * @param keyword 搜索关键词语，如果搜索类型为位置，则传位置中文位置信息；如果为地区则传地区ID，如果为校名则传校名
 * @param location 纬度和经度逗号分隔，如：‘111,22222’当搜索类型为位置时候必传
 */
export function searchSchool(opts: SearchSchoolOpts) {
  return request<{
    count: number
    rows: Array<{ id: number; school_name: string; distance: string }>
  }>(
    {
      method: 'POST',
      url: '/user/school_search',
      data: { ...opts },
    },
    '搜索学校'
  )
  // return Promise.resolve({
  //   count: 10,
  //   rows: [
  //     { id: 1, school_name: '广州市第一中学' },
  //     { id: 2, school_name: '广州市第二中学' },
  //     { id: 3, school_name: '广州市第三中学' },
  //     { id: 4, school_name: '广州市第四中学' },
  //     { id: 5, school_name: '广州市第五中学' },
  //     { id: 6, school_name: '广州市第六中学' },
  //   ]
  // })
}

export type SchoolDetail = {
  latitude: string // 纬度
  longitude: string // 经度
  geo_position: string // 地理位置描述
  area_id: number // 所在地区ID
  area_name: string // 地区名称
  enr_telphone: string // 招生电话
  school_enr_location: string // 招生地段，用逗号分隔
  school_name: string // 校名
  id: null
  mp_name: null // 公众号名称
  education_nature: null // 办学性质
  spec_type: null //特殊类型
  tuition: null // 学费
  stay: null // 住宿费
  enrollment_plan: null // 招生计划
  enrollment_rules: null // 招生简章
  middle_shcool_dk: null // 对口中学
}
/**
 * 获取学校详情
 * @param school_id 学校id
 */
export function getSchoolDetail({ school_id }: { school_id: number }) {
  return request<SchoolDetail>(
    {
      method: 'GET',
      url: `/user/school_search/${school_id}`,
    },
    '获取学校详情'
  )
}
interface GroupchatDetail {
  group_chat: string
  mp_pic: string
  advertise_show: number
  advertise_pic: string
  enrollment_pic: string
  banner: string
}
export function getGroupchat() {
  return request<GroupchatDetail>(
    {
      method: 'GET',
      url: `/user/groupchat`,
    },
    '获取学校详情'
  )
}
