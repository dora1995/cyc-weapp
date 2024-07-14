import { Image, View } from "@remax/one";
import React from "react";

import EmptyImage from "./empty.svg";

import s from "./index.scss";

export default () => {
  return (
    <View className={s.Wrapper}>
      <Image className={s.Image} src={EmptyImage} />
      <View className={s.Label}>无匹配结果，请扩大或缩小地址范围后重试</View>
    </View>
  );
};
