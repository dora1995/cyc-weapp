import { View, Image, Text } from "remax/one";
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
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
import Select from "@/components/Select";
import { getAreaList } from "@/api/area";
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
  const fuckList = useRef<any[]>([]);
  const [yixiangAreaId, setYixiangAreaId] = useState();

  const [locateNode, { locationCtx }] = createLocation();
  const getLocationRef = useRef({
    latitude: locationCtx?.latitude,
    longitude: locationCtx?.longitude,
    address: `${locationCtx?.city}${locationCtx?.district}${locationCtx?.street}`,
  });

  const hasLoadAll = useRef(false);
  const [hightLightText, setHightLightText] = useState([]);
  const getList = useMemoizedFn(
    async (isRefresh: boolean = true, str = "", areaId) => {
      if (hasLoadAll.current) {
        return;
      }
      if (str == "") {
        return;
      }
      const pageParam = pageDerive(page, isRefresh);
      let params = {
        search_type: 2,
        page: pageParam,
        school_enr_location: str,
        area_code: areaId == 0 ? undefined : areaId,
        location: getLocationRef.current.latitude
          ? `${getLocationRef.current?.latitude},${getLocationRef.current?.longitude}`
          : undefined,
      };
      console.log(params);
      setFetching(true);
      searchSchool(params)
        .then((list) => {
          onSeachFetchDone(list, pageParam);
        })
        .catch((err) => {
          setFetching(false);
        });
    }
  );

  const onSeachFetchDone = (i: any, page: number) => {
    const { schoolList = [], str } = i;
    setHightLightText(str);
    setSchoolCount(schoolList.length);
    setPage(page);

    const _fuck = schoolList.map((item) => {
      return {
        ...item,
        truncated_location: "",
      };
    });
    const _fuck2 = schoolList.map((item) => item.truncated_location);
    fuckList.current = _fuck2;
    setSchoolList(_fuck);
    hasLoadAll.current = true;
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

  function handleBlur() {
    if (searchText) {
      hasLoadAll.current = false;
      getList(true, searchText, yixiangAreaId);
    } else {
      setBeginSearch(false);
      setSchoolList([]);
      setSchoolCount(0);
    }
  }

  const [areaList, setAreaList] = useState<any>([]);
  function getAreaListFn() {
    getAreaList().then((list) => {
      // 这里需要确认拿的是广州数据，也就是广州市在第一个
      const guangzhouData = list[0];
      if (guangzhouData && guangzhouData?.children) {
        const areaList = guangzhouData?.children.map((item) => {
          return {
            id: item.id,
            name: item.name,
          };
        });
        setAreaList(areaList);
      }
    });
  }

  useEffect(() => {
    getAreaListFn();
  }, []);
  const _areaList = useMemo(() => {
    return [{ id: 0, name: "不限" }, ...areaList];
  }, [areaList]);

  const _areaSelect = useCallback(
    (id) => {
      if (id != 0) {
        setYixiangAreaId(Number(id));
      } else {
        setYixiangAreaId(undefined);
      }
      hasLoadAll.current = false;
      getList(true, searchText, id);
    },
    [areaList, searchText]
  );

  usePageEvent("onShareAppMessage", () => {
    return {
      title: "广州小学信息查一查",
      path: "pages/tab-home/index?tabIndex=1",
    };
  });
  usePageEvent("onShareTimeline", () => {
    return {
      title: "广州小学信息查一查",
      path: "pages/tab-home/index?tabIndex=1",
    };
  });

  return (
    <View className={s.SearchArea} key="duikou">
      <Select
        key="s3"
        className={s.select}
        idKey="id"
        titleKey="name"
        placeholder="所在区"
        currentId={yixiangAreaId}
        placeholderColor="#C6CBD1"
        list={_areaList}
        onSelect={_areaSelect}
      />
      <SearchInput
        placeholder="请输入社区/路/街/巷/村/小区/大院/楼/栋/梯"
        value={searchText}
        onInput={(text) => {
          setSearchText(text);
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
        <>
          <SchoolList
            showDetail={true}
            fuckList={fuckList.current}
            count={schoolCount}
            list={schoolList}
            currentTabIndex={1}
            hightLightText={hightLightText}
            name_status={name_status}
          />
          {schoolCount == 70 ? (
            <View
              style={{
                fontSize: "12px",
                color: "#96a5b9",
                textAlign: "center",
                fontFamily: "MyFont2",
                marginBottom: "10px",
              }}
            >
              (相关匹配结果过多，仅显示前70个结果)
            </View>
          ) : null}
        </>
      )}

      {fetching && <WxLoading loading={true} />}
    </View>
  );
}
export default duikou;
