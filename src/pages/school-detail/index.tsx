import React, { useMemo, useRef, useState } from "react";
import { usePageEvent } from "@remax/macro";
import { getGroupchat } from "@/api/school";
import { Image, View } from "@remax/one";
import { Map } from "@remax/wechat";
import createPage from "@/components/CreatePage";
import NavBar from "@/components/NavBar";
import { useLoading } from "@/components/Loading";
import { getSchoolDetail, SchoolDetail } from "@/api/school";
import useQueryWithScene from "@/hooks/useQueryWithScene";
import s from "./index.scss";
import Icon1 from "@/imgs/icon_school_address@2x.png";
import Icon2 from "@/imgs/icon_school_attribute@2x.png";
import Icon3 from "@/imgs/icon_school_type@2x.png";
import Icon4 from "@/imgs/icon_school_tuition@2x.png";
import Icon5 from "@/imgs/icon_school_stay@2x.png";
import Icon6 from "@/imgs/icon_school_phone@2x.png";
import Icon7 from "@/imgs/icon_school_plan@2x.png";
import Icon8 from "@/imgs/icon_school_area@2x.png";
import Icon9 from "@/imgs/icon_school_middle@2x.png";
import Icon10 from "@/imgs/icon_school_official@2x.png";
import Icon11 from "@/imgs/icon_school_rules@2x.png";
import MapIcon from "@/imgs/icon_map_location@2x.png";
import ToMapIcon from "@/imgs/icon_map_navigate@2x.png";
import zhuanIcon from "./zhuan.png";
import MpHtml from "mp-html/dist/mp-weixin/index";
import { tranferStr } from "@/utils/tranferStr";
import { Button } from "remax/one";

export default createPage((pageCtx) => {
  const [detail, setDetail] = useState<null | SchoolDetail>(null);
  const makers = [
    {
      id: 1,
      latitude: detail?.latitude,
      longitude: detail?.longitude,
      iconPath: MapIcon,
      width: 40,
      height: 40,
      anchor: { x: 0.5, y: 0.5 },
    },
  ];
  const [loadingNode, setLoading] = useLoading();
  const [bannerUrl, setBannerUrl] = useState("");
  const [showBanner, setShowBanner] = useState(false);
  const { id } = useQueryWithScene();
  usePageEvent("onLoad", () => {
    setLoading(true);
    getSchoolDetail({ school_id: Number(id) })
      .then((res) => {
        setLoading(false);
        setDetail(res);
      })
      .catch((err) => {
        setLoading(false);
        pageCtx.setError(err);
      });
    getGroupchat()
      .then((res) => {
        setShowBanner(res.advertise_show == 1);
        setBannerUrl(res.banner);
      })
      .catch(pageCtx.setError);
  });

  usePageEvent("onShareAppMessage", () => {
    return {
      title: `${detail?.school_name}`,
    };
  });
  usePageEvent("onShareTimeline", () => {
    return {
      title: `${detail?.school_name}`,
    };
  });

  const [move, setMove] = useState(false);
  const [top, setTop] = useState(400);
  const [right, setRight] = useState(10);

  const Education = { 1: "公办小学", 2: "民办小学", 3: "" };
  const dataList = [
    // { icon: Icon1, value: detail?.geo_position, label: "地址" },
    {
      icon: Icon2,
      value: Education[detail?.education_nature || 3],
      label: "办学性质",
    },
    { icon: Icon3, value: detail?.spec_type, label: "特殊类型" },
    {
      icon: Icon4,
      value: tranferStr(detail?.tuition),
      label: "学费标准",
      isRich: true,
    },
    { icon: Icon5, value: detail?.stay, label: "住宿条件" },
    {
      icon: Icon6,
      value: tranferStr(detail?.enr_telphone),
      label: "招生电话",
      isRich: true,
    },
    {
      icon: Icon7,
      value: detail?.enrollment_plan,
      label: "招生计划",
      isRich: true,
    },
    {
      icon: Icon8,
      value: tranferStr(detail?.school_enr_location),
      label: "招生地段",
      isRich: true,
    },
    {
      icon: Icon9,
      value: tranferStr(detail?.middle_shcool_dk),
      label: "对口中学",
      isRich: true,
    },
    {
      icon: Icon10,
      value: detail?.mp_name,
      label: "官方公众号",
      canCopy: true,
      hasExemple: "mp",
    },
    {
      icon: Icon11,
      value: detail?.enrollment_rules,
      label: "招生简章",
      canCopy: true,
      hasExemple: "en",
    },
  ];
  function handleCopy(item: any) {
    if (item.value === "/" || item.value === "") return;
    if (item?.canCopy) {
      wx.setClipboardData({
        data: item.value,
        success: () => {
          // setCopySuccessShow(true);
        },
      });
    }
  }
  // 意向收集
  function imgClick() {
    wx.navigateTo({ url: "/pages/intentProfile/index" });
  }

  // function handleTouchstart(e) {
  //   console.log(e);
  //   e.stopPropagation();
  //   setMove(true);
  //   return false;
  // }
  // function handleTouchMove(e) {
  //   console.log(e);
  //   e.stopPropagation();
  //   // 在滚动时，禁止页面滚动

  //   if (move) {
  //     const changedTouches = e.changedTouches[0];
  //     const { clientY } = changedTouches;
  //     setTop(clientY);
  //   }
  //   return false;
  // }
  // function handleTouchend(e) {
  //   setMove(false);
  //   e.stopPropagation();
  //   return false;
  // }
  function handleShow(e) {
    e.stopPropagation();
    if (right === -26) {
      setRight(10);
      setTimeout(() => {
        setRight(-26);
      }, 3000);
    }
    return false;
  }

  if (!detail) {
    return <></>;
  }

  return (
    <View style={{ height: "100vh", overflow: move ? "hidden" : "auto" }}>
      <NavBar
        background="linear-gradient(90deg, #1469E1 0%, #1996E6 100%)"
        title="学校详情"
      />
      {loadingNode}
      {detail ? (
        <>
          <View className={s.MapArea}>
            <Map
              className={s.Map}
              enableScroll={false}
              enableZoom={false}
              enableRotate={false}
              markers={makers}
              enableBuilding={true}
              enablePoi={true}
              latitude={Number(detail?.latitude)}
              longitude={Number(detail?.longitude)}
            ></Map>
            <View
              className={s.CentreView}
              onTap={(e) => {
                wx.openLocation({
                  name: detail.school_name,
                  longitude: Number(detail?.longitude),
                  latitude: Number(detail?.latitude),
                });
              }}
            >
              <View className={s.Label}>{detail?.school_name}</View>
              <Image className={s.MessageBackgroundImage} src={ToMapIcon} />
            </View>
          </View>
          <View className={s.InfoAbove}>
            <View className={s.SchoolName}>{detail?.school_name}</View>
            <View className={s.areaName}>{detail.area_name}</View>
            {dataList.map((item, idx) => {
              if (item.value) {
                return (
                  <View className={s.module} key={idx}>
                    <View className={s.title}>
                      <Image className={s.titleIcon} src={item.icon} />
                      <View className={s.titleLabel}>{item.label}</View>
                    </View>
                    {item?.isRich ? (
                      <MpHtml
                        container-style={{
                          background: "#FBFBFB",
                          padding: "27rpx 20rpx",
                          "font-size": "36rpx",
                          color: "#4B5B6D",
                          "max-height": "450rpx",
                          overflow: "auto",
                          "text-align": "justify",
                        }}
                        content={item.value}
                      />
                    ) : (
                      <View
                        className={`${s.value} ${
                          item.hasExemple ? s.hasExemple : ""
                        } ${item.label === "招生简章" ? s.more : ""}`}
                        onTap={() => handleCopy(item)}
                      >
                        {item.value}
                        {item.hasExemple &&
                        item.value != "" &&
                        item.value != "/" ? (
                          <View className={s.exp}>复制</View>
                        ) : null}
                      </View>
                    )}
                  </View>
                );
              }
              return null;
            })}
            {showBanner ? (
              <View className={s.module}>
                <Image
                  onTap={imgClick}
                  mode="widthFix"
                  className={s.bannerImg}
                  src={bannerUrl}
                  wechat-show-menu-by-longpress={true}
                />
              </View>
            ) : null}
          </View>
        </>
      ) : null}
      <View
        // onTouchStart={handleTouchstart}
        // onTouchMove={handleTouchMove}
        // onTouchEnd={handleTouchend}
        style={{
          position: "fixed",
          right: right + "px",
          top: top + "px",
          borderRadius: "50%",
          width: "52px",
          height: "52px",
          overflow: "hidden",
        }}
      >
        <Button
          openType="share"
          style={{
            background: "none",
            width: "52px",
            height: "52px",
            padding: 0,
            borderRadius: "50%",
            overflow: "hidden",
            boxSizing: "content-box",
          }}
        >
          <Image
            src={zhuanIcon}
            style={{ width: "52px", height: "52px" }}
          ></Image>
        </Button>
      </View>
    </View>
  );
});
