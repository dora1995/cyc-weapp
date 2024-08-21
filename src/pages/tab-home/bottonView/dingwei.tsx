import { Button, View } from "remax/one";
import React, { useEffect, useRef, useState } from "react";
import s from "../index.scss";
import SchoolList from "../components/SchoolList";
import WxLoading from "@/components/Loading";
import createLocation from "../components/Location";
import { useMemoizedFn, useUpdateEffect } from "ahooks";
import geocoder from "@/api/geocoder";
import { searchSchool } from "@/api/school";
import { usePageEvent } from "remax/macro";

interface ISchool {
  id: number;
  school_name: string;
}

function duikou(props) {
  const { name_status } = props;
  // 学校数据相关
  const [fetching, setFetching] = useState(false);
  const [schoolCount, setSchoolCount] = useState(0);
  const [page, setPage] = useState(1);
  const hasLoadAll = useRef(false);
  const [schoolList, setSchoolList] = useState<ISchool[]>([]);
  const [currentLocation, setCurrentLocation] = useState("");
  const [locateNode, { locationCtx }] = createLocation();
  const getLocationRef = useRef({
    latitude: locationCtx?.latitude,
    longitude: locationCtx?.longitude,
    address: `${locationCtx?.city}${locationCtx?.district}${locationCtx?.street}`,
  });

  function getLocationClick() {
    wx.chooseLocation({
      fail: (err) => {
        console.log(err);
      },
      success: (res) => {
        console.log(res);
        hasLoadAll.current = false;
        getLocationRef.current = {
          latitude: res.latitude,
          longitude: res.longitude,
          address: res.name,
        };
        getList(true);
      },
    });
  }
  const pageDerive = (page: number, isRefresh: boolean) =>
    isRefresh ? 1 : page + 1;

  const onSeachFetchDone = (
    { count, rows: newList }: { count: number; rows: typeof schoolList },
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
    setFetching(false);
  };

  const getList = useMemoizedFn(async (isRefresh: boolean = true) => {
    if (hasLoadAll.current) {
      return;
    }
    const pageParam = pageDerive(page, isRefresh);

    const res = await geocoder({
      type: "location",
      latitude: getLocationRef.current?.latitude!,
      longitude: getLocationRef.current?.longitude!,
    });
    const { adcode } = res.ad_info;
    let params = {
      search_type: 1 as 1,
      location: `${getLocationRef.current?.latitude},${getLocationRef.current?.longitude}`,
      area_code: adcode,
      page: pageParam,
      page_size: 20,
    };
    const fillText = getLocationRef.current?.address!;
    setCurrentLocation(fillText);
    setFetching(true);
    searchSchool(params)
      .then((list) => {
        onSeachFetchDone(list, pageParam);
      })
      .catch((err) => {
        setFetching(false);
        // pageCtx.setError(err);
      });
  });

  // 页面下拉到底部时触发
  usePageEvent("onReachBottom", () => {
    if (fetching) {
      return;
    }
    getList(false);
  });

  usePageEvent("onShareAppMessage", () => {
    return {
      title: "广州小学信息查一查",
      path: "pages/tab-home/index?tabIndex=0",
    };
  });
  usePageEvent("onShareTimeline", () => {
    return {
      title: "广州小学信息查一查",
      path: "pages/tab-home/index?tabIndex=0",
    };
  });

  useEffect(() => {
    hasLoadAll.current = false;
    if (locationCtx) {
      getLocationRef.current = {
        latitude: locationCtx.latitude,
        longitude: locationCtx.longitude,
        address: `${locationCtx.city}${locationCtx.district}${locationCtx.street}`,
      };
      getList(true);
    } else {
      setCurrentLocation("正在定位");
    }
  }, []);

  //定位变化的情况
  useUpdateEffect(() => {
    if (locationCtx) {
      if (locationCtx) {
        getLocationRef.current = {
          latitude: locationCtx.latitude,
          longitude: locationCtx.longitude,
          address: `${locationCtx.city}${locationCtx.district}${locationCtx.street}`,
        };
        getList(true);
      }
    }
  }, [locationCtx]);

  return (
    <View className={s.SearchArea} key="dingwei">
      <Button onTap={getLocationClick}>选择定位</Button>
      <div className={s.newLocation}>当前定位：{currentLocation}</div>
      <SchoolList
        showDetail={false}
        count={schoolCount}
        list={schoolList}
        currentTabIndex={0}
        name_status={name_status}
      />
      {fetching && <WxLoading loading={true} />}
    </View>
  );
}
export default duikou;
