import React, { useMemo, useState } from "react";
import { Image, View, Text } from "@remax/one";

import LeftIcon from "./LeftIcon.svg";
import icon1 from "@/imgs/icon_donw.png";
import icon2 from "@/imgs/icon_up.png";

import s from "./index.scss";

type Props = {
  item: any;
  showDetail: boolean;
  hightLightText: string;
  showLook?: boolean;
};

const map = {
  1: "公办",
  2: "民办",
};
export default ({
  item,
  showDetail = false,
  hightLightText = "",
  showLook = true,
}: Props) => {
  const type = map[item.education_nature];
  const look_count = item.look_count;

  const school_enr_location = item.school_enr_location;

  function onTapIndex() {
    wx.navigateTo({
      url: `/pages/school-detail/index?id=${item.id}`,
    });
  }
  const fuckShowDetail = showDetail && school_enr_location;
  const [open, setOpen] = useState(false);
  function handleOpenShow() {
    setOpen(true);
  }
  function handleCloseShow() {
    setOpen(false);
  }

  function makeText(str: string, find: string) {
    const _text = str.split(find);
    return _text.map((item, index) => {
      return (
        <>
          <Text>{item}</Text>
          {index !== _text.length - 1 ? (
            <Text style={{ color: "#ED8957" }}>{find}</Text>
          ) : null}
        </>
      );
    });
  }

  return (
    <View className={s.schooleBig}>
      <View
        className={s.SchoolItem}
        style={{
          borderBottom: fuckShowDetail ? "1px dashed #e6e9ed" : "none",
          paddingBottom: fuckShowDetail ? "8px" : "0px",
          marginBottom: fuckShowDetail ? "8px" : "0px",
        }}
        onTap={onTapIndex}
      >
        <Image className={s.LeftIcon} src={LeftIcon} />
        <View className={s.SchoolName}>
          <View>{item.school_name}</View>
          <View className={s.distance}>
            <Text style={{ marginRight: "8px" }}>{type}</Text>
            {item.distance ? (
              <Text
                style={{ marginRight: "8px" }}
              >{`距离约${item.distance}公里`}</Text>
            ) : null}
            {showLook ? <Text>{look_count}人浏览</Text> : null}
          </View>
        </View>
      </View>
      {fuckShowDetail ? (
        <View
          style={{
            color: "#9BA4B5",
            fontSize: "12px",
            display: open ? "block" : "flex",
          }}
        >
          {open ? (
            <>
              <View>{makeText(school_enr_location, hightLightText)}</View>
              <View
                onTap={handleCloseShow}
                style={{
                  textAlign: "right",
                  color: "#5780EA",
                  fontSize: "12px",
                }}
              >
                收起
                <Image
                  style={{ marginLeft: "4px", width: "8px", height: "5px" }}
                  src={icon2}
                ></Image>
              </View>
            </>
          ) : (
            <>
              <View
                style={{
                  flex: 1,
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                  marginRight: "14px",
                  height: "17px",
                }}
              >
                {makeText(school_enr_location, hightLightText)}
              </View>
              <View
                onTap={handleOpenShow}
                style={{ color: "#5780EA", fontSize: "12px" }}
              >
                展开
                <Image
                  style={{ marginLeft: "4px", width: "8px", height: "5px" }}
                  src={icon1}
                ></Image>
              </View>
            </>
          )}
        </View>
      ) : null}
    </View>
  );
};
