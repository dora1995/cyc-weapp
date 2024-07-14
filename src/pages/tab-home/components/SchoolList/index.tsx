import React, { useMemo } from "react";
import { Image, View, Text } from "@remax/one";

import LeftIcon from "./LeftIcon.svg";

import s from "./index.scss";
import Empty from "../Empty";
import SchoolItem from "../SchoolItem";
import Empty2 from "../Empty2";
type Props = {
  count: number;
  list: Array<{ id: number; school_name: string; distance?: string }>;
  currentTabIndex: number;
  showDetail: boolean;
  hightLightText?: string;
};

const map = {
  1: "公办",
  2: "民办",
};
export default ({
  list,
  count,
  currentTabIndex,
  showDetail = false,
  hightLightText = "",
}: Props) => {
  return (
    <View className={s.Wrapper}>
      <View className={s.Count}>
        {count} 条搜索结果 {currentTabIndex == 0 ? `(当前定位统筹范围)` : ""}{" "}
        <Text className={s.Tips}>(信息仅供参考)</Text>
      </View>
      {count == 0 ? (
        currentTabIndex == 1 ? (
          <Empty2 />
        ) : (
          <Empty />
        )
      ) : (
        <View className={s.SchoolList}>
          {list.map((item, idx) => {
            return (
              <SchoolItem
                hightLightText={hightLightText}
                showDetail={showDetail}
                key={item.id}
                item={item}
              />
            );
          })}
        </View>
      )}
    </View>
  );
};
