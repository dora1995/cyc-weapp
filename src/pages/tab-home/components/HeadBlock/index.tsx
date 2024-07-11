import React, { useMemo } from "react";
import { View, Image } from "remax/one";
import { getFillHeightExpression } from "@/components/NavBar";

import s from "./index.scss";
import LogoImage from "@/imgs/logo_youxiao.png";
import LogoZImage from "@/imgs/logo_zuoyue.png";
import MatrixPointImage from "./matrix-point.png";

export type Props = {
  tabs: any[];
  currentIndex: number;
  onTapTabIndex(tabIndex: number): void;
};
export default ({ tabs, currentIndex, onTapTabIndex }: Props) => {
  const navBarHeight = getFillHeightExpression();
  const HeadBlockHeight = useMemo(() => {
    return `calc(${navBarHeight})`;
  }, []);

  return (
    <View className={s.HeadBlock} style={{ paddingTop: HeadBlockHeight }}>
      <Image className={s.MatrixPointImage} src={MatrixPointImage} />
      <View className={s.imgG}>
        <Image className={s.LogoImageZ} src={LogoZImage} />
        <Image className={s.LogoImage} src={LogoImage} />
      </View>
      <View className={s.TabArea}>
        {tabs.map((item, tabIndex) => {
          const isHighlight = tabIndex === currentIndex;
          return (
            <View
              key={tabIndex}
              className={`${s.TabItem} ${isHighlight ? s.TabHighlight : ""}`}
              onTap={() => onTapTabIndex(tabIndex)}
            >
              <Image className={s.tabIcon} src={item.icon} />
              <View
                className={`${s.tabText} ${isHighlight ? s.TabHighlight : ""}`}
              >
                {item.name}
              </View>
              {!isHighlight ? null : <View className={s.HighlightLine}></View>}
            </View>
          );
        })}
      </View>
    </View>
  );
};
