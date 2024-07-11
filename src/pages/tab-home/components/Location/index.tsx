import React from "react";
import { Image, View } from "@remax/one";
import useLocation from "@/components/useLocation";
import s from "./index.scss";
import LocationDeny from "./LocationDeny.svg";

export default (): ReturnType<typeof useLocation> => {
  return useLocation({
    deny: () => (
      <View className={s.DenyElement}>
        <Image className={s.LocateIcon} src={LocationDeny} />
        无法获得当前定位，点此重新定位
      </View>
    ),
    loaded: (locationCtx) => {
      return (
        <View className={s.newLocation}>
          当前定位：
          {locationCtx
            ? `${locationCtx.city}${locationCtx.district}${locationCtx.street}`
            : "N/A"}
        </View>
      );
    },
    loading: () => <div className={s.newLocation}>加载中</div>,
    failure: (failure) => <>{`定位失败：${failure.message}`}</>,
  });
};
