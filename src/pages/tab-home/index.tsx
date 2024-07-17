import React, { useState } from "react";
import { View, Image } from "remax/one";
import { usePageEvent } from "@remax/macro";
import { getGroupchat } from "@/api/school";
import s from "./index.scss";
import createPage from "@/components/CreatePage";
import NavBar from "@/components/NavBar";
import HeadBlock from "./components/HeadBlock";
import { ScrollView } from "@remax/wechat";
import WindowLayout from "@/components/WindowLayout";

export default createPage((pageCtx) => {
  // 搜索条件
  const [showLayout, setShowLayout] = useState(false);
  const [adSrc, setAdSrc] = useState("");
  const [name_status, setname_status] = useState(1);
  function getImg() {
    getGroupchat()
      .then((res) => {
        if (res.advertise_show === 1 && res.advertise_pic) {
          setAdSrc(res.advertise_pic);
          setShowLayout(true);
        }
        setname_status(res.name_status);
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

  return (
    <View className={s.Page}>
      <NavBar
        hideNavIcon={true}
        fillHeight={false}
        title="广州小学信息查一查"
        background="linear-gradient(90deg, #1469E1 0%, #1996E6 100%)"
      />
      <HeadBlock name_status={name_status} />
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
  );
});
