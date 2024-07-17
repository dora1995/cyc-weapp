import React, { useMemo, useState } from "react";
import { View, Image } from "remax/one";
import { getFillHeightExpression } from "@/components/NavBar";

import s from "./index.scss";
import LogoImage from "@/imgs/logo_youxiao.png";
import LogoZImage from "@/imgs/logo_zuoyue.png";
import MatrixPointImage from "./matrix-point.png";
import Icon1 from "@/imgs/icon1.png";
import Icon2 from "@/imgs/icon2.png";
import Icon3 from "@/imgs/icon3.png";
import Icon4 from "@/imgs/icon4.png";
import Icon5 from "@/imgs/icon5.png";
import Duikou from "../../bottonView/duikou";
import Dingwei from "../../bottonView/dingwei";
import Redu from "../../bottonView/redu";
import Yixiang from "../../bottonView/yixiang";
import Jinqun from "../../bottonView/jinqun";
import { useQuery } from "remax";

export default (props) => {
  const { name_status } = props;

  const newTabs = useMemo(
    () => [
      { name: "定位查", id: 1, icon: Icon1, component: Dingwei },
      { name: "对口查", id: 2, icon: Icon2, component: Duikou },
      {
        name: name_status == 1 ? "分类搜索" : "热度排行",
        id: 3,
        icon: Icon3,
        component: Redu,
      },
      { name: "意向调查", id: 4, icon: Icon4, component: Yixiang },
      { name: "进群交流", id: 5, icon: Icon5, component: Jinqun },
    ],
    [name_status]
  );

  const navBarHeight = getFillHeightExpression();

  const query = useQuery();
  const { tabIndex = 0 } = query;

  // tab
  const [currentTabIndex, setTabIndex] = useState(() => {
    return tabIndex ? +tabIndex : 0;
  });

  const HeadBlockHeight = useMemo(() => {
    return `calc(${navBarHeight})`;
  }, []);

  const Render = newTabs[currentTabIndex].component;
  return (
    <>
      <View className={s.HeadBlock} style={{ paddingTop: HeadBlockHeight }}>
        <Image className={s.MatrixPointImage} src={MatrixPointImage} />
        <View className={s.imgG}>
          <Image className={s.LogoImageZ} src={LogoZImage} />
          <Image className={s.LogoImage} src={LogoImage} />
        </View>
        <View className={s.TabArea}>
          {newTabs.map((item, tabIndex) => {
            const isHighlight = tabIndex === currentTabIndex;
            return (
              <View
                key={tabIndex}
                className={`${s.TabItem} ${isHighlight ? s.TabHighlight : ""}`}
                onTap={() => setTabIndex(tabIndex)}
              >
                <Image className={s.tabIcon} src={item.icon} />
                <View
                  className={`${s.tabText} ${
                    isHighlight ? s.TabHighlight : ""
                  }`}
                >
                  {item.name}
                </View>
                {!isHighlight ? null : (
                  <View className={s.HighlightLine}></View>
                )}
              </View>
            );
          })}
        </View>
      </View>
      <Render name_status={name_status} />
    </>
  );
};
