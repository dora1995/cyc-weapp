import React, { useEffect, useMemo, useRef, useState } from "react";
import { navigateTo, View, Text, Image, Button } from "remax/one";
import { usePageEvent } from "@remax/macro";
import { getAreaList } from "@/api/area";
import geocoder from "@/api/geocoder";
import { getGroupchat, searchSchool } from "@/api/school";
import useMemoizedFn from "@/hooks/useMemoizedFn";
import s from "./index.scss";
import createPage from "@/components/CreatePage";
import NavBar from "@/components/NavBar";
import HeadBlock from "./components/HeadBlock";
import createLocation from "./components/Location";
import SchoolList from "./components/SchoolList";
import WxLoading from "@/components/Loading";
import { useQuery } from "remax";
import { useUpdateEffect } from "ahooks";
import { ScrollView } from "@remax/wechat";
import WindowLayout from "@/components/WindowLayout";

import Icon1 from "@/imgs/icon1.png";
import Icon2 from "@/imgs/icon2.png";
import Icon3 from "@/imgs/icon3.png";
import Icon4 from "@/imgs/icon4.png";
import Icon5 from "@/imgs/icon5.png";

const pageDerive = (page: number, isRefresh: boolean) =>
  isRefresh ? 1 : page + 1;

const newTabs = [
  { name: "定位查", id: 1, icon: Icon1, component: null },
  { name: "对口查", id: 2, icon: Icon2, component: null },
  { name: "定位查", id: 3, icon: Icon3, component: null },
  { name: "定位查", id: 4, icon: Icon4, component: null },
  { name: "定位查", id: 5, icon: Icon5, component: null },
];

interface ISchool {
  id: number;
  school_name: string;
}

export default createPage((pageCtx) => {
  const query = useQuery();
  const { tabIndex = 0 } = query;

  // tab
  const [currentTabIndex, setTabIndex] = useState(() => {
    return tabIndex ? +tabIndex : 0;
  });

  const onTabChange = (index: number) => {
    setTabIndex(index);
  };

  // 学校数据相关
  const [fetching, setFetching] = useState(false);
  const [schoolCount, setSchoolCount] = useState(0);
  const [page, setPage] = useState(1);
  const hasLoadAll = useRef(false);
  const [schoolList, setSchoolList] = useState<ISchool[]>([]);

  // 搜索条件
  const [currentLocation, setCurrentLocation] = useState("");
  const [showLayout, setShowLayout] = useState(false);
  const [adSrc, setAdSrc] = useState("");
  const [locateNode, { locationCtx }] = createLocation();
  const getLocationRef = useRef({
    latitude: locationCtx?.latitude,
    longitude: locationCtx?.longitude,
    address: `${locationCtx?.city}${locationCtx?.district}${locationCtx?.street}`,
  });

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
      page: pageParam,
      pagesize: 20,
      is_check: false,
      search_type: 1,
      location: `${getLocationRef.current?.latitude},${getLocationRef.current?.longitude}`,
      area_code: adcode,
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
        pageCtx.setError(err);
      });
  });

  const wxLoadingNode = useMemo(() => <WxLoading loading={true} />, []);
  const listingElement = useMemo(() => {
    return (
      <>
        <SchoolList
          count={schoolCount}
          list={schoolList}
          currentTabIndex={currentTabIndex}
          onTapIndex={(idx) => {
            const { id } = schoolList[idx];
            navigateTo({
              url: `/pages/school-detail/index?id=${id}`,
            });
          }}
        />
        {fetching && wxLoadingNode}
      </>
    );
  }, [fetching, schoolCount, schoolList, wxLoadingNode, currentTabIndex]);

  // 页面下拉到底部时触发
  usePageEvent("onReachBottom", () => {
    if (fetching) {
      return;
    }
    getList(false);
  });

  function getImg() {
    getGroupchat()
      .then((res) => {
        if (res.advertise_show === 1 && res.advertise_pic) {
          setAdSrc(res.advertise_pic);
          setShowLayout(true);
        }
      })
      .catch(pageCtx.setError);
  }
  usePageEvent("onLoad", () => {
    getImg();
  });

  // 意向收集
  function imgClick() {
    wx.navigateTo({ url: "/pages/intentProfile/index" });
  }
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
  }, [currentTabIndex]);

  //定位变化的情况
  useUpdateEffect(() => {
    if (locationCtx) {
      if (tabIndex == 0) {
        if (locationCtx) {
          getLocationRef.current = {
            latitude: locationCtx.latitude,
            longitude: locationCtx.longitude,
            address: `${locationCtx.city}${locationCtx.district}${locationCtx.street}`,
          };
          getList(true);
        }
      }
    }
  }, [locationCtx]);

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
  return (
    <View className={s.Page}>
      <NavBar
        hideNavIcon={true}
        fillHeight={false}
        title="广州小学信息查一查"
        background="linear-gradient(90deg, #1469E1 0%, #1996E6 100%)"
      />
      <HeadBlock
        tabs={newTabs}
        currentIndex={currentTabIndex}
        onTapTabIndex={onTabChange}
      />
      <View className={s.SearchArea}>
        <Button onTap={getLocationClick}>选择定位</Button>
        <div className={s.newLocation}>当前定位：{currentLocation}</div>
        {listingElement}
        {/* 用户需知 */}
        <WindowLayout zIndex={9999} show={showLayout}>
          <View className={s.ad}>
            <ScrollView scrollY className={s.SelectList}>
              <Image
                onTap={imgClick}
                mode="widthFix"
                className={s.intoQrImg}
                src={adSrc}
              />
            </ScrollView>
            <View className={s.closeBtn}>
              <View onTap={() => setShowLayout(false)} className={s.btn}>
                我已了解
              </View>
            </View>
          </View>
        </WindowLayout>
      </View>
    </View>
  );
});
