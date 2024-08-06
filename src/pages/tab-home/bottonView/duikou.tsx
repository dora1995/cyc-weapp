import { View, Image } from "remax/one";
import React, { useEffect, useRef, useState } from "react";
import s from "../index.scss";
import WxLoading from "@/components/Loading";
import { useMemoizedFn, useUpdateEffect } from "ahooks";
import { searchSchool } from "@/api/school";
import SearchInput from "../components/SearchInput2";
import Icon1 from "@/imgs/duikou1.png";
import Icon2 from "@/imgs/duikou2.png";
import Icon3 from "@/imgs/duikou3.png";
import ns from "./styles.scss";
import createLocation from "../components/Location";
import SchoolList from "../components/SchoolList";
import { usePageEvent } from "remax/macro";
interface ISchool {
  id: number;
  school_name: string;
}

const pageDerive = (page: number, isRefresh: boolean) =>
  isRefresh ? 1 : page + 1;

function duikou(props) {
  const { name_status } = props;
  // 学校数据相关
  const [fetching, setFetching] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [schoolCount, setSchoolCount] = useState(0);
  const [page, setPage] = useState(1);
  const [schoolList, setSchoolList] = useState<ISchool[]>([]);
  const [beginSearch, setBeginSearch] = useState(false);

  const [locateNode, { locationCtx }] = createLocation();
  const getLocationRef = useRef({
    latitude: locationCtx?.latitude,
    longitude: locationCtx?.longitude,
    address: `${locationCtx?.city}${locationCtx?.district}${locationCtx?.street}`,
  });

  const hasLoadAll = useRef(false);
  const getList = useMemoizedFn(async (isRefresh: boolean = true, str = "") => {
    if (hasLoadAll.current) {
      return;
    }
    const pageParam = pageDerive(page, isRefresh);
    let params = {
      search_type: 2,
      page: pageParam,
      page_size: 20,
      school_enr_location: str,
      location: getLocationRef.current.latitude
        ? `${getLocationRef.current?.latitude},${getLocationRef.current?.longitude}`
        : undefined,
    };
    setFetching(true);
    searchSchool(params)
      .then((list) => {
        onSeachFetchDone(list, pageParam);
      })
      .catch((err) => {
        setFetching(false);
      });
  });

  const onSeachFetchDone = (
    {
      count = 0,
      rows: newList = [],
    }: { count: number; rows: typeof schoolList },
    page: number
  ) => {
    setSchoolCount(count);
    setPage(page);
    if (page === 1) {
      setSchoolList(newList);
    } else {
      setSchoolList([...schoolList, ...newList]);
    }
    if (count <= page * 20) {
      hasLoadAll.current = true;
    }
    setBeginSearch(true);
    setFetching(false);
  };

  useEffect(() => {
    hasLoadAll.current = false;
    if (locationCtx) {
      getLocationRef.current = {
        latitude: locationCtx.latitude,
        longitude: locationCtx.longitude,
        address: `${locationCtx.city}${locationCtx.district}${locationCtx.street}`,
      };
    }
  }, []);

  useUpdateEffect(() => {
    if (locationCtx) {
      if (locationCtx) {
        getLocationRef.current = {
          latitude: locationCtx.latitude,
          longitude: locationCtx.longitude,
          address: `${locationCtx.city}${locationCtx.district}${locationCtx.street}`,
        };
      }
    }
  }, [locationCtx]);

  // useDebounceEffect(
  //   () => {
  //     if (searchText) {
  //       hasLoadAll.current = false;
  //       getList(true, searchText);
  //     } else {
  //       setSchoolList([]);
  //       setSchoolCount(0);
  //       hasLoadAll.current = false;
  //     }
  //   },
  //   [searchText],
  //   {
  //     wait: 1500,
  //   }
  // );
  function handleBlur() {
    if (searchText) {
      hasLoadAll.current = false;
      getList(true, searchText);
    } else {
      setBeginSearch(false);
      setSchoolList([]);
      setSchoolCount(0);
    }
  }
  usePageEvent("onReachBottom", () => {
    if (fetching) {
      return;
    }
    getList(false, searchText);
  });

  return (
    <View className={s.SearchArea} key="duikou">
      <SearchInput
        placeholder="请输入社区/路/街/巷/村/小区/大院/楼/栋/梯"
        value={searchText}
        onInput={(text) => {
          setSearchText(text);
          // if (!text) {
          //   setBeginSearch(false);
          //   setSchoolList([]);
          //   setSchoolCount(0);
          // }
        }}
        onBlur={handleBlur}
        onConfirm={() => {}}
      />
      {!beginSearch ? (
        <>
          <View className={ns.module} style={{ marginTop: "20px" }}>
            <View className={ns.line}>
              <Image className={ns.icon} src={Icon1} />
              <View className={ns.title}>操作指引</View>
            </View>
            <View className={ns.content}>
              输入位置信息后，系统会将这一信息匹配数据库，显示出这一位置信息属于哪所学校的招生范围
            </View>
          </View>
          <View className={ns.module}>
            <View className={ns.line}>
              <Image className={ns.icon} src={Icon2} />
              <View className={ns.title}>操作示例</View>
            </View>
            <View className={ns.content}>
              输入“锦城花园”，匹配到东风东路小学招生范围内含有“锦城花园”
            </View>
          </View>
          <View className={ns.module}>
            <View className={ns.line}>
              <Image className={ns.icon} src={Icon3} />
              <View className={ns.title}>温馨提示</View>
            </View>
            <View className={ns.content}>
              如果没有查询到结果，请尝试更换名称地址表达方式，或输入上一级地址扩大搜索范围
            </View>
          </View>
        </>
      ) : (
        <SchoolList
          showDetail={true}
          count={schoolCount}
          list={schoolList}
          currentTabIndex={1}
          hightLightText={searchText}
          name_status={name_status}
        />
      )}

      {fetching && <WxLoading loading={true} />}
    </View>
  );
}
export default duikou;
