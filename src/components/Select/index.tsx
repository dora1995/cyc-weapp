import React, { CSSProperties, memo, useMemo, useState } from "react";
import { View, Image } from "@remax/one";
import { ScrollView } from "@remax/wechat";

import WindowLayout from "@/components/WindowLayout";
import classNames from "classNames";
import s from "./index.scss";
import Icon from "./Icon.svg";
import { useWhyDidYouUpdate } from "ahooks";

export default memo(
  <ID extends string, IDVal extends unknown, Title extends string>({
    idKey,
    titleKey,
    currentId,
    list,
    onSelect,
    placeholder,
    placeholderColor,
    className,
    onClick,
  }: {
    idKey: ID;
    titleKey: Title;
    className?: string;
    currentId: IDVal;
    list: any;
    placeholder: string;
    placeholderColor?: CSSProperties["color"];
    onClick?: () => boolean;
    onSelect(id: IDVal): void;
  }) => {
    const [showLayout, setShowLayout] = useState(false);
    console.log("showLayout", placeholder, showLayout);

    const currentIdx = list
      .map((item) => {
        return item[idKey] as IDVal;
      })
      .indexOf(currentId);

    useWhyDidYouUpdate("Select", {
      idKey,
      titleKey,
      currentId,
      list,
      onSelect,
      placeholder,
      placeholderColor,
      className,
    });
    const listItems = useMemo(() => {
      return list.map((item, idx) => {
        return (
          <View
            key={idx}
            className={s.ListItem}
            onTap={() => {
              onSelect(item[idKey]);
              setShowLayout(false);
            }}
          >
            {item[titleKey]}
          </View>
        );
      });
    }, [idKey, list, onSelect, titleKey]);

    const currentValueElement = useMemo(() => {
      if (currentIdx >= 0) {
        return <View className={s.Current}>{list[currentIdx][titleKey]}</View>;
      } else {
        return (
          <View
            className={`${s.Current} ${s.Placeholder}`}
            style={{ color: placeholderColor }}
          >
            {placeholder}
          </View>
        );
      }
    }, [currentIdx, list, placeholder, placeholderColor, titleKey]);

    return (
      <>
        <View
          className={classNames(s.Wrapper, className)}
          onTap={(e) => {
            e.stopPropagation();
            let cb = true;
            if (onClick) {
              cb = onClick();
            }
            if (cb) {
              setShowLayout(true);
            }
            return false;
          }}
        >
          {currentValueElement}
          <Image className={s.Icon} src={Icon} />
        </View>

        <WindowLayout
          zIndex={9999}
          show={showLayout}
          onTapBackground={() => setShowLayout(false)}
        >
          <ScrollView scrollY className={s.SelectList}>
            {listItems}
          </ScrollView>
        </WindowLayout>
      </>
    );
  }
);
