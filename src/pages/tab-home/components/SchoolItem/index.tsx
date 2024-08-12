import React, { useMemo, useState } from "react";
import { Image, View, Text } from "@remax/one";

import LeftIcon from "./LeftIcon.svg";
import icon1 from "@/imgs/icon_donw.png";
import icon2 from "@/imgs/icon_up.png";
import MpHtml from "mp-html/dist/mp-weixin/index";
import s from "./index.scss";
import { getEnrLocation } from "@/api/school";

type Props = {
  item: any;
  showDetail: boolean;
  hightLightText: string[];
  showLook?: boolean;
  dd?: string;
};

const map = {
  1: "公办",
  2: "民办",
};
export default ({
  item,
  showDetail = false,
  hightLightText = [],
  showLook = true,
  dd = "",
}: Props) => {
  const type = map[item.education_nature];
  const look_count = item.look_count;
  function onTapIndex() {
    wx.navigateTo({
      url: `/pages/school-detail/index?id=${item.id}`,
    });
  }
  const fuckShowDetail = showDetail && dd;
  const [open, setOpen] = useState(false);
  const [fuck, setfuck] = useState("");
  async function getget() {
    if (!fuck) {
      const res = await getEnrLocation(item.id);
      setfuck(res.school_enr_location || "");
    }
    setOpen(true);
  }
  function handleOpenShow() {
    getget();
  }
  function handleCloseShow() {
    setOpen(false);
  }

  function highlightTerms(
    text,
    terms,
    highlightFormat = `<span style="color:red; font-weight: bold; font-family: MyFont">$&</span>`
  ) {
    // 按长度从长到短对terms数组进行排序，确保长的字段优先匹配
    terms.sort((a, b) => b.length - a.length);
    // 将terms数组中的每个字段用正则表达式匹配并替换
    terms.forEach((term) => {
      // 创建一个正则表达式对象，使用g标志表示全局匹配
      const regex = new RegExp(term, "g");
      // 使用replace方法将匹配到的字段替换为带有高亮的格式
      text = text.replace(regex, highlightFormat);
    });

    return text;
  }

  function makeText(str: string, find: string[]) {
    const _text = highlightTerms(str, find);
    return _text;
    // return _text.map((item, index) => {
    //   return (
    //     <Text key={index}>
    //       <Text>{item}</Text>
    //       {index !== _text.length - 1 ? (
    //         <Text
    //           style={{ color: "red", fontWeight: "bold", fontFamily: "MyFont" }}
    //         >
    //           {find}
    //         </Text>
    //       ) : null}
    //     </Text>
    //   );
    // });
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
          {fuckShowDetail ? (
            <MpHtml
              content={`${makeText(item.school_name, hightLightText)}`}
            ></MpHtml>
          ) : (
            <View>{item.school_name}</View>
          )}

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
            textAlign: "justify",
          }}
        >
          {open ? (
            <>
              <MpHtml
                content={`<p style="width: 100%; overflow: hidden;">${makeText(
                  fuck,
                  hightLightText
                )}</p>`}
              ></MpHtml>
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
              <MpHtml
                style={{
                  flex: 1,
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                  marginRight: "10px",
                  height: "17px",
                }}
                content={`<p style="width: 100%; overflow: hidden;">${makeText(
                  dd,
                  hightLightText
                )}</p>`}
              ></MpHtml>
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
